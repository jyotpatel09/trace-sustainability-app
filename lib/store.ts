import { Batch, SustainabilityGrade } from "@/types";
import { calculateBatchScore, ScoreResult } from "./scoring";
import { grade, MOCK_BATCHES } from "./mock-data";

export interface ScoreResultWithGrade extends Batch {
  scoreResult: ScoreResult;
  grade: SustainabilityGrade;
}

const LOCAL_STORAGE_KEY = "trace_batches";

export function getStoredBatches(): Batch[] {
  if (typeof window === "undefined") {
    return MOCK_BATCHES;
  }
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_BATCHES));
    return MOCK_BATCHES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to parse stored batches", e);
    return MOCK_BATCHES;
  }
}

export function saveStoredBatches(batches: Batch[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(batches));
  }
}

export function getBatch(id: string): Batch | null {
  const batches = getStoredBatches();
  return batches.find(b => b.id === id) || null;
}

export function saveBatch(batch: Batch) {
  const batches = getStoredBatches();
  const index = batches.findIndex(b => b.id === batch.id);
  if (index > -1) {
    batches[index] = batch;
  } else {
    batches.unshift(batch);
  }
  saveStoredBatches(batches);
}

export function deleteBatch(id: string) {
  const batches = getStoredBatches();
  const updated = batches.filter(b => b.id !== id);
  saveStoredBatches(updated);
}

export function updateBatch(batch: Batch) {
  saveBatch(batch);
}

export function getScoredBatches(batches: Batch[]): ScoreResultWithGrade[] {
  return batches.map(b => {
    const result = calculateBatchScore(b);
    return {
      ...b,
      scoreResult: result,
      grade: grade(result.score),
    };
  });
}

export function getDashboardStats(batches: Batch[]) {
  const scored = getScoredBatches(batches);
  const completed = scored.filter(b => b.status === "completed");
  const avgScore = completed.reduce((s, b) => s + b.scoreResult.score, 0) / (completed.length || 1);
  const totalWater = scored.reduce((s, b) => s + b.scoreResult.totalWater, 0);
  const totalEnergy = scored.reduce((s, b) => s + b.scoreResult.totalElectricity, 0);

  return {
    totalBatches: batches.length,
    avgScore: Math.round(avgScore),
    totalWaterLiters: totalWater,
    totalEnergyKWh: Math.round(totalEnergy),
  };
}

export function getTrendData(batches: Batch[]) {
  const scored = getScoredBatches(batches);
  const sorted = [...scored]
    .filter(b => b.status === "completed")
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  // Return the last 10 batches for the trend chart
  return sorted.slice(-10).map((b) => ({
    label: b.batchNumber.replace("BATCH-", ""),
    score: b.scoreResult.score,
    water: Math.round(b.scoreResult.waterPerUnit),
    power: Math.round(b.scoreResult.electricityPerUnit * 10) / 10,
  }));
}

export function getTopBatches(batches: Batch[], count: number = 3) {
  const scored = getScoredBatches(batches);
  const completed = scored.filter((b) => b.status === "completed");
  const sorted = [...completed].sort((a, b) => b.scoreResult.score - a.scoreResult.score);
  return sorted.slice(0, count).map(b => ({
    batchId: b.id,
    batchNumber: b.batchNumber,
    productName: b.productName,
    score: b.scoreResult.score,
    grade: b.grade,
    date: new Date(b.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }),
  }));
}

export function getLowestBatches(batches: Batch[], count: number = 3) {
  const scored = getScoredBatches(batches);
  const completed = scored.filter((b) => b.status === "completed");
  const sorted = [...completed].sort((a, b) => a.scoreResult.score - b.scoreResult.score);
  return sorted.slice(0, count).map(b => ({
    batchId: b.id,
    batchNumber: b.batchNumber,
    productName: b.productName,
    score: b.scoreResult.score,
    grade: b.grade,
    date: new Date(b.startedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }),
  }));
}

export function getRecentBatches(batches: Batch[], count: number = 6) {
  const scored = getScoredBatches(batches);
  const sorted = [...scored].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
  return sorted.slice(0, count).map(b => ({
    id: b.id,
    batchNumber: b.batchNumber,
    productName: b.productName,
    quantity: b.quantity,
    unit: b.unit,
    score: b.status === "completed" ? b.scoreResult.score : null,
    grade: b.status === "completed" ? b.grade : null,
    status: b.status,
  }));
}
