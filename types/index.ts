// ─── Core Domain Types for Trace ─────────────────────────────
// These interfaces model the sustainability tracking domain
// for Indian SME manufacturers.

export type ResourceUnit =
  | "kWh"       // electricity
  | "liters"    // water
  | "kg"        // materials / waste
  | "MJ"        // energy (generic)
  | "m3"        // gas / compressed air
  | "units";    // generic count

export type BatchStatus = "in-progress" | "completed" | "cancelled";

export type SustainabilityGrade = "A+" | "A" | "B" | "C" | "D" | "F";

// ─── Resource Log ────────────────────────────────────────────
/**
 * A single resource consumption entry within a batch.
 */
export type WaterSource = "municipal" | "borewell" | "tanker";
export type FuelType = "diesel" | "LPG" | "coal";
export type WasteType = "fabric offcuts" | "chemical" | "food" | "mixed";
export type WasteDisposal = "landfill" | "recycler" | "composted" | "unknown";

export interface ResourceLog {
  id: string;
  batchId: string;
  resourceType: "electricity" | "water" | "fuel" | "material" | "waste";
  name: string;           // e.g. "Electricity – Main Line"
  quantity: number;
  unit: ResourceUnit;
  recordedAt: string;     // ISO 8601
  notes?: string;

  // Specific fields based on type
  waterSource?: WaterSource;
  tankerCost?: number;
  solarContribution?: number;
  fuelType?: FuelType;
  wasteType?: WasteType;
  disposalMethod?: WasteDisposal;
}

// ─── Production Batch ────────────────────────────────────────
/**
 * A production batch represents one manufacturing run.
 * All resource logs are linked to a batch.
 */
export interface Batch {
  id: string;
  factoryId: string;
  batchNumber: string;    // e.g. "BATCH-2024-001"
  productName: string;
  productType?: string;
  rawMaterial?: string;
  quantity: number;
  unit: string;           // e.g. "units", "kg", "meters"
  status: BatchStatus;
  startedAt: string;      // ISO 8601
  completedAt?: string;
  resources: ResourceLog[];
  notes?: string;
}

// ─── Sustainability Scores ────────────────────────────────────
/**
 * Calculated per-resource sustainability metrics.
 */
export interface ResourceScore {
  resourceType: ResourceLog["resourceType"];
  totalConsumed: number;
  unit: ResourceUnit;
  perUnitConsumption: number;   // consumption per output unit
  benchmark: number;            // industry baseline per output unit
  score: number;                // 0–100
  grade: SustainabilityGrade;
}

// ─── Sustainability Report Card ───────────────────────────────
/**
 * The final report card generated for a completed batch.
 */
export interface SustainabilityReport {
  id: string;
  batchId: string;
  generatedAt: string;          // ISO 8601
  overallScore: number;         // 0–100
  overallGrade: SustainabilityGrade;
  resourceScores: ResourceScore[];
  totalCO2eKg: number;          // CO₂ equivalent in kg
  totalWaterLiters: number;
  totalEnergyKWh: number;
  recommendations: string[];
  complianceFlags: string[];    // e.g. "BEE Star Rating Target Met"
}

// ─── Factory (Demo) ───────────────────────────────────────────
/**
 * A factory entity (for multi-factory support in future).
 */
export interface Factory {
  id: string;
  name: string;
  location: string;             // city, state
  industry: string;             // e.g. "Textile", "Food Processing"
  gstin?: string;
  createdAt: string;
}

// ─── Navigation ──────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
