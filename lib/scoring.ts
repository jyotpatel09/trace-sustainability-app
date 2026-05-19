import { Batch, ResourceLog } from "@/types";

export interface ScoreDeductions {
  water: number;
  electricity: number;
  fuel: number;
  waste: number;
  tanker: number;
}

export interface ScoreResult {
  score: number;
  totalWater: number;
  totalElectricity: number;
  waterPerUnit: number;
  electricityPerUnit: number;
  deductions: ScoreDeductions;
}

/**
 * Calculates the total quantity for a specific resource type safely.
 */
function getTotalResource(resources: ResourceLog[], type: string): number {
  if (!resources || resources.length === 0) return 0;
  return resources
    .filter((r) => r.resourceType === type)
    .reduce((sum, r) => sum + Math.max(0, r.quantity || 0), 0);
}

/**
 * Validates and normalizes the batch units to prevent division by zero.
 */
function getValidUnits(batch: Batch): number {
  const units = batch.quantity || 0;
  // If a batch was created with 0 units, treat it as 1 to avoid NaN.
  // In a real factory setting, zero units might mean a failed batch, 
  // but for scoring we prevent math crashes.
  return units > 0 ? units : 1;
}

/**
 * Main Sustainability Score calculation engine based on hackathon rules.
 * Start Score = 100
 * Minimum Score = 0
 */
export function calculateBatchScore(batch: Batch): ScoreResult {
  const START_SCORE = 100;
  const units = getValidUnits(batch);
  const resources = batch.resources || [];

  // 1. Calculate consumption totals
  const totalWater = getTotalResource(resources, "water");
  const totalElectricity = getTotalResource(resources, "electricity");

  const waterPerUnit = totalWater / units;
  const electricityPerUnit = totalElectricity / units;

  // 2. Water Deduction Logic
  // > 50L -> deduct 1 point per 10L above 50. Max 20.
  let waterDeduction = 0;
  if (waterPerUnit > 50) {
    const excess = waterPerUnit - 50;
    waterDeduction = Math.floor(excess / 10);
    if (waterDeduction > 20) waterDeduction = 20;
  }

  // 3. Electricity Deduction Logic
  // > 2kWh -> deduct 1 point per 0.5kWh above 2. Max 20.
  let electricityDeduction = 0;
  if (electricityPerUnit > 2) {
    const excess = electricityPerUnit - 2;
    electricityDeduction = Math.floor(excess / 0.5);
    if (electricityDeduction > 20) electricityDeduction = 20;
  }

  // 4. Fuel Deduction Logic
  // Any fuel used -> deduct 10
  const hasFuel = resources.some(
    (r) => r.resourceType === "fuel" && r.quantity > 0
  );
  const fuelDeduction = hasFuel ? 10 : 0;

  // 5. Waste Deduction Logic
  // Landfill/unknown -> 15. Recycler -> 5. Composted/Zero -> 0.
  let wasteDeduction = 0;
  const wasteLogs = resources.filter((r) => r.resourceType === "waste" && r.quantity > 0);
  
  if (wasteLogs.length > 0) {
    const hasLandfillOrUnknown = wasteLogs.some(
      (w) => w.disposalMethod === "landfill" || w.disposalMethod === "unknown"
    );
    const hasRecycler = wasteLogs.some((w) => w.disposalMethod === "recycler");

    if (hasLandfillOrUnknown) {
      wasteDeduction = 15;
    } else if (hasRecycler) {
      wasteDeduction = 5;
    } else {
      wasteDeduction = 0; // Composted only
    }
  }

  // 6. Water Source Deduction Logic
  // Any tanker water -> deduct 10
  const hasTanker = resources.some(
    (r) => r.resourceType === "water" && r.waterSource === "tanker" && r.quantity > 0
  );
  const tankerDeduction = hasTanker ? 10 : 0;

  // 7. Calculate Final Score
  const totalDeductions =
    waterDeduction +
    electricityDeduction +
    fuelDeduction +
    wasteDeduction +
    tankerDeduction;

  const finalScore = Math.max(0, START_SCORE - totalDeductions);

  return {
    score: finalScore,
    totalWater,
    totalElectricity,
    waterPerUnit,
    electricityPerUnit,
    deductions: {
      water: waterDeduction,
      electricity: electricityDeduction,
      fuel: fuelDeduction,
      waste: wasteDeduction,
      tanker: tankerDeduction,
    },
  };
}
