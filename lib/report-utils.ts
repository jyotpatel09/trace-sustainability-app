import { Batch } from "@/types";
import { ScoreResult } from "./scoring";

export interface ComparisonMetrics {
  scoreDiff: number;
  waterPerUnitDiff: number; // percentage
  elecPerUnitDiff: number;  // percentage
  hasPreviousBatch: boolean;
  prevBatchNumber?: string;
}

/**
 * Finds the most recent completed batch with the identical product name.
 */
export function getPreviousBatch(currentBatch: Batch, allBatches: Batch[]): Batch | null {
  // Filter for completed batches with the same product name, excluding the current one
  const candidates = allBatches.filter(
    (b) =>
      b.id !== currentBatch.id &&
      b.status === "completed" &&
      b.productName === currentBatch.productName
  );

  // Sort by startedAt descending to get the most recent one
  candidates.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  return candidates.length > 0 ? candidates[0] : null;
}

/**
 * Helper to calculate percentage difference.
 * Returns positive for increase, negative for decrease.
 */
function calcPercentDiff(current: number, prev: number): number {
  if (prev === 0) return current > 0 ? 100 : 0; // Avoid division by zero
  return ((current - prev) / prev) * 100;
}

/**
 * Computes difference metrics between two batch score results.
 */
export function calculateComparison(current: ScoreResult, prev: ScoreResult | null, prevBatch?: Batch): ComparisonMetrics {
  if (!prev || !prevBatch) {
    return {
      scoreDiff: 0,
      waterPerUnitDiff: 0,
      elecPerUnitDiff: 0,
      hasPreviousBatch: false,
    };
  }

  return {
    hasPreviousBatch: true,
    prevBatchNumber: prevBatch.batchNumber,
    scoreDiff: current.score - prev.score,
    waterPerUnitDiff: calcPercentDiff(current.waterPerUnit, prev.waterPerUnit),
    elecPerUnitDiff: calcPercentDiff(current.electricityPerUnit, prev.electricityPerUnit),
  };
}

/**
 * Generates deterministic, operational observations based on deductions and comparisons.
 */
export function generateObservations(current: ScoreResult, comparison: ComparisonMetrics): string[] {
  const obs: string[] = [];

  // 1. Overall Score Observations
  if (current.score === 100) {
    obs.push("Perfect sustainability score achieved. All resource metrics are within optimal thresholds.");
  } else if (current.score < 50) {
    obs.push("Critical sustainability warning: Score is below 50. Immediate operational review recommended.");
  }

  // 2. Resource Deduction Observations
  if (current.deductions.water > 0) {
    obs.push(`Water consumption exceeded threshold, resulting in a -${current.deductions.water} point deduction.`);
  }
  if (current.deductions.electricity > 0) {
    obs.push(`Electricity usage exceeded threshold, resulting in a -${current.deductions.electricity} point deduction.`);
  }
  if (current.deductions.fuel > 0) {
    obs.push(`Fuel usage detected (-${current.deductions.fuel} points). Transitioning to electric or solar alternatives will improve score.`);
  }
  if (current.deductions.waste === 15) {
    obs.push(`Landfill/Unknown waste disposal utilized (-15 points). Consider recycling or composting to recover points.`);
  } else if (current.deductions.waste === 5) {
    obs.push(`Waste sent to recycler (-5 points). Moving towards zero-waste or compost reduces this deduction to 0.`);
  }
  if (current.deductions.tanker > 0) {
    obs.push(`Tanker water usage detected (-10 points). High reliance on external tanker sources reduces operational sustainability.`);
  }

  // 3. Comparison Observations
  if (comparison.hasPreviousBatch) {
    if (comparison.waterPerUnitDiff > 5) {
      obs.push(`Water consumption per unit increased by ${Math.abs(comparison.waterPerUnitDiff).toFixed(1)}% compared to the previous batch.`);
    } else if (comparison.waterPerUnitDiff < -5) {
      obs.push(`Water consumption per unit decreased by ${Math.abs(comparison.waterPerUnitDiff).toFixed(1)}% compared to the previous batch.`);
    }

    if (comparison.elecPerUnitDiff > 5) {
      obs.push(`Electricity usage per unit increased by ${Math.abs(comparison.elecPerUnitDiff).toFixed(1)}% compared to the previous batch.`);
    } else if (comparison.elecPerUnitDiff < -5) {
      obs.push(`Electricity usage per unit decreased by ${Math.abs(comparison.elecPerUnitDiff).toFixed(1)}% compared to the previous batch.`);
    }

    if (comparison.scoreDiff > 0) {
      obs.push(`Overall sustainability score improved by ${comparison.scoreDiff} points vs previous batch.`);
    } else if (comparison.scoreDiff < 0) {
      obs.push(`Overall sustainability score dropped by ${Math.abs(comparison.scoreDiff)} points vs previous batch.`);
    }
  }

  // Fallback if no observations were generated but score isn't 100
  if (obs.length === 0 && current.score < 100) {
    obs.push("Resource consumption is stable and within acceptable operational parameters.");
  }

  return obs;
}
