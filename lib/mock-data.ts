import type { Batch, SustainabilityGrade, ResourceLog } from "@/types";
import { calculateBatchScore } from "@/lib/scoring";

// ─── Helper ──────────────────────────────────────────────────
export function grade(score: number): SustainabilityGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 50) return "D";
  return "F";
}

// Helper to generate resources
function genResources(
  batchId: string,
  waterLiters: number,
  elecKwh: number,
  hasFuel: boolean,
  hasLandfill: boolean,
  hasTanker: boolean,
  date: string
): ResourceLog[] {
  const r: ResourceLog[] = [
    {
      id: `r-${batchId}-w`,
      batchId,
      resourceType: "water",
      name: "Water Intake",
      quantity: waterLiters,
      unit: "liters",
      recordedAt: date,
      waterSource: hasTanker ? "tanker" : "municipal"
    },
    {
      id: `r-${batchId}-e`,
      batchId,
      resourceType: "electricity",
      name: "Grid Electricity",
      quantity: elecKwh,
      unit: "kWh",
      recordedAt: date,
      solarContribution: Math.random() > 0.4 ? 25 : 0
    },
  ];
  if (hasFuel) {
    r.push({
      id: `r-${batchId}-f`,
      batchId,
      resourceType: "fuel",
      name: "Boiler Fuel",
      quantity: 400,
      unit: "kg",
      fuelType: "diesel",
      recordedAt: date
    });
  }
  if (hasLandfill) {
    r.push({
      id: `r-${batchId}-wst`,
      batchId,
      resourceType: "waste",
      name: "Solid Waste",
      quantity: 120,
      unit: "kg",
      disposalMethod: "landfill",
      wasteType: "mixed",
      recordedAt: date
    });
  } else {
    r.push({
      id: `r-${batchId}-wst2`,
      batchId,
      resourceType: "waste",
      name: "Production Scrap",
      quantity: 80,
      unit: "kg",
      disposalMethod: "recycler",
      wasteType: "fabric offcuts",
      recordedAt: date
    });
  }
  return r;
}

// ─── Batch Mock Data (24 Batches over 6 months) ───────────────────────
export const MOCK_BATCHES: Batch[] = [
  // November 2023
  {
    id: "b001",
    factoryId: "f001",
    batchNumber: "BATCH-23-11-01",
    productName: "Blue Polo Shirts",
    productType: "garment",
    rawMaterial: "Organic Cotton Yarn",
    quantity: 1000,
    unit: "units",
    status: "completed",
    startedAt: "2023-11-05T06:00:00Z",
    completedAt: "2023-11-08T18:00:00Z",
    resources: genResources("b001", 40000, 1800, false, false, false, "2023-11-06T10:00:00Z")
  },
  {
    id: "b002",
    factoryId: "f001",
    batchNumber: "BATCH-23-11-02",
    productName: "Denim Jeans (14oz)",
    productType: "garment",
    rawMaterial: "Indigo Denim Fabric",
    quantity: 2000,
    unit: "units",
    status: "completed",
    startedAt: "2023-11-12T06:00:00Z",
    completedAt: "2023-11-15T18:00:00Z",
    resources: genResources("b002", 150000, 5000, true, true, false, "2023-11-13T10:00:00Z")
  },
  {
    id: "b003",
    factoryId: "f001",
    batchNumber: "BATCH-23-11-03",
    productName: "White T-Shirts",
    productType: "garment",
    rawMaterial: "Regular Cotton Yarn",
    quantity: 5000,
    unit: "units",
    status: "completed",
    startedAt: "2023-11-20T06:00:00Z",
    completedAt: "2023-11-23T18:00:00Z",
    resources: genResources("b003", 200000, 9000, false, false, false, "2023-11-21T10:00:00Z")
  },
  {
    id: "b004",
    factoryId: "f001",
    batchNumber: "BATCH-23-11-04",
    productName: "Cotton Yarn (20s)",
    productType: "garment",
    rawMaterial: "Raw Cotton",
    quantity: 1900,
    unit: "kg",
    status: "completed",
    startedAt: "2023-11-15T06:00:00Z",
    completedAt: "2023-11-17T14:00:00Z",
    resources: [
      { id: "r1", batchId: "b004", resourceType: "water", name: "Wash", quantity: 90000, unit: "liters", recordedAt: "2023-11-15T10:00:00Z", waterSource: "borewell" },
      { id: "r2", batchId: "b004", resourceType: "electricity", name: "Spin", quantity: 4000, unit: "kWh", recordedAt: "2023-11-16T10:00:00Z" }
    ],
  },

  // December 2023
  {
    id: "b005",
    factoryId: "f001",
    batchNumber: "BATCH-23-12-01",
    productName: "Vitrified Floor Tiles",
    productType: "ceramic",
    rawMaterial: "Clay & Feldspar",
    quantity: 10000,
    unit: "sqm",
    status: "completed",
    startedAt: "2023-12-05T06:00:00Z",
    completedAt: "2023-12-10T18:00:00Z",
    resources: genResources("b005", 300000, 25000, true, true, false, "2023-12-07T10:00:00Z")
  },
  {
    id: "b006",
    factoryId: "f001",
    batchNumber: "BATCH-23-12-02",
    productName: "Wall Tiles (Glossy)",
    productType: "ceramic",
    rawMaterial: "Kaolin Clay",
    quantity: 5000,
    unit: "sqm",
    status: "completed",
    startedAt: "2023-12-12T06:00:00Z",
    completedAt: "2023-12-15T18:00:00Z",
    resources: genResources("b006", 140000, 11000, true, false, false, "2023-12-13T10:00:00Z")
  },
  {
    id: "b007",
    factoryId: "f001",
    batchNumber: "BATCH-23-12-03",
    productName: "Mango Pulp Cans",
    productType: "food_processing",
    rawMaterial: "Fresh Mangoes",
    quantity: 3000,
    unit: "cans",
    status: "completed",
    startedAt: "2023-12-18T06:00:00Z",
    completedAt: "2023-12-20T18:00:00Z",
    resources: genResources("b007", 200000, 4500, false, false, false, "2023-12-19T10:00:00Z")
  },
  {
    id: "b008",
    factoryId: "f001",
    batchNumber: "BATCH-23-12-04",
    productName: "Tomato Paste Jars",
    productType: "food_processing",
    rawMaterial: "Fresh Tomatoes",
    quantity: 5000,
    unit: "jars",
    status: "completed",
    startedAt: "2023-12-22T06:00:00Z",
    completedAt: "2023-12-25T18:00:00Z",
    resources: genResources("b008", 250000, 8000, false, true, true, "2023-12-23T10:00:00Z")
  },

  // January 2024
  {
    id: "b009",
    factoryId: "f001",
    batchNumber: "BATCH-24-01-01",
    productName: "Kraft Paper Rolls",
    productType: "paper",
    rawMaterial: "Recycled Wood Pulp",
    quantity: 10000,
    unit: "kg",
    status: "completed",
    startedAt: "2024-01-04T06:00:00Z",
    completedAt: "2024-01-09T18:00:00Z",
    resources: genResources("b009", 600000, 22000, true, false, false, "2024-01-05T10:00:00Z")
  },
  {
    id: "b010",
    factoryId: "f001",
    batchNumber: "BATCH-24-01-02",
    productName: "A4 Printing Paper",
    productType: "paper",
    rawMaterial: "Bleached Pulp",
    quantity: 8000,
    unit: "kg",
    status: "completed",
    startedAt: "2024-01-12T06:00:00Z",
    completedAt: "2024-01-16T18:00:00Z",
    resources: genResources("b010", 410000, 15000, false, true, false, "2024-01-13T10:00:00Z")
  },
  {
    id: "b011",
    factoryId: "f001",
    batchNumber: "BATCH-24-01-03",
    productName: "Ceramic Mugs",
    productType: "ceramic",
    rawMaterial: "Porcelain Clay",
    quantity: 4000,
    unit: "units",
    status: "completed",
    startedAt: "2024-01-20T06:00:00Z",
    completedAt: "2024-01-23T18:00:00Z",
    resources: genResources("b011", 70000, 9000, true, false, false, "2024-01-21T10:00:00Z")
  },
  {
    id: "b012",
    factoryId: "f001",
    batchNumber: "BATCH-24-01-04",
    productName: "Corrugated Packaging Boxes",
    productType: "paper",
    rawMaterial: "Unbleached Kraft Paper",
    quantity: 15000,
    unit: "units",
    status: "completed",
    startedAt: "2024-01-25T06:00:00Z",
    completedAt: "2024-01-28T18:00:00Z",
    resources: genResources("b012", 50000, 12000, false, false, false, "2024-01-26T10:00:00Z")
  },

  // February 2024
  {
    id: "b013",
    factoryId: "f001",
    batchNumber: "BATCH-24-02-01",
    productName: "Blue Polo Shirts",
    productType: "garment",
    rawMaterial: "Organic Cotton Yarn",
    quantity: 1200,
    unit: "units",
    status: "completed",
    startedAt: "2024-02-03T06:00:00Z",
    completedAt: "2024-02-06T18:00:00Z",
    resources: genResources("b013", 45000, 1900, false, false, false, "2024-02-04T10:00:00Z")
  },
  {
    id: "b014",
    factoryId: "f001",
    batchNumber: "BATCH-24-02-02",
    productName: "Packaged Spice Blends",
    productType: "food_processing",
    rawMaterial: "Whole Spices",
    quantity: 8000,
    unit: "packs",
    status: "completed",
    startedAt: "2024-02-10T06:00:00Z",
    completedAt: "2024-02-13T18:00:00Z",
    resources: genResources("b014", 10000, 4000, false, false, false, "2024-02-11T10:00:00Z")
  },
  {
    id: "b015",
    factoryId: "f001",
    batchNumber: "BATCH-24-02-03",
    productName: "Fruit Jam Jars",
    productType: "food_processing",
    rawMaterial: "Mixed Fruits & Sugar",
    quantity: 6000,
    unit: "jars",
    status: "completed",
    startedAt: "2024-02-17T06:00:00Z",
    completedAt: "2024-02-20T18:00:00Z",
    resources: genResources("b015", 95000, 6200, false, false, false, "2024-02-18T10:00:00Z")
  },
  {
    id: "b016",
    factoryId: "f001",
    batchNumber: "BATCH-24-02-04",
    productName: "Sanitaryware (Toilets)",
    productType: "ceramic",
    rawMaterial: "Clay & Silica",
    quantity: 800,
    unit: "units",
    status: "completed",
    startedAt: "2024-02-23T06:00:00Z",
    completedAt: "2024-02-27T18:00:00Z",
    resources: genResources("b016", 60000, 10000, true, true, false, "2024-02-24T10:00:00Z")
  },

  // March 2024
  {
    id: "b017",
    factoryId: "f001",
    batchNumber: "BATCH-24-03-01",
    productName: "Denim Jeans (14oz)",
    productType: "garment",
    rawMaterial: "Indigo Denim Fabric",
    quantity: 2200,
    unit: "units",
    status: "completed",
    startedAt: "2024-03-02T06:00:00Z",
    completedAt: "2024-03-06T18:00:00Z",
    resources: genResources("b017", 120000, 4200, false, false, false, "2024-03-03T10:00:00Z")
  },
  {
    id: "b018",
    factoryId: "f001",
    batchNumber: "BATCH-24-03-02",
    productName: "Kraft Paper Rolls",
    productType: "paper",
    rawMaterial: "Recycled Wood Pulp",
    quantity: 11000,
    unit: "kg",
    status: "completed",
    startedAt: "2024-03-10T06:00:00Z",
    completedAt: "2024-03-15T18:00:00Z",
    resources: genResources("b018", 550000, 20000, false, false, false, "2024-03-11T10:00:00Z")
  },
  {
    id: "b019",
    factoryId: "f001",
    batchNumber: "BATCH-24-03-03",
    productName: "Vitrified Floor Tiles",
    productType: "ceramic",
    rawMaterial: "Clay & Feldspar",
    quantity: 11000,
    unit: "sqm",
    status: "completed",
    startedAt: "2024-03-18T06:00:00Z",
    completedAt: "2024-03-23T18:00:00Z",
    resources: genResources("b019", 280000, 21000, true, false, false, "2024-03-19T10:00:00Z")
  },
  {
    id: "b020",
    factoryId: "f001",
    batchNumber: "BATCH-24-03-04",
    productName: "Mango Pulp Cans",
    productType: "food_processing",
    rawMaterial: "Fresh Mangoes",
    quantity: 4000,
    unit: "cans",
    status: "completed",
    startedAt: "2024-03-25T06:00:00Z",
    completedAt: "2024-03-27T18:00:00Z",
    resources: genResources("b020", 180000, 5000, false, false, false, "2024-03-26T10:00:00Z")
  },

  // April 2024 (Recent)
  {
    id: "b021",
    factoryId: "f001",
    batchNumber: "BATCH-24-04-01",
    productName: "Organic Cotton Tees",
    productType: "garment",
    rawMaterial: "Organic Cotton Yarn",
    quantity: 3000,
    unit: "units",
    status: "completed",
    startedAt: "2024-04-02T06:00:00Z",
    completedAt: "2024-04-05T18:00:00Z",
    resources: genResources("b021", 120000, 4800, false, false, false, "2024-04-03T10:00:00Z")
  },
  {
    id: "b022",
    factoryId: "f001",
    batchNumber: "BATCH-24-04-02",
    productName: "Sanitaryware (Toilets)",
    productType: "ceramic",
    rawMaterial: "Clay & Silica",
    quantity: 1000,
    unit: "units",
    status: "completed",
    startedAt: "2024-04-08T06:00:00Z",
    completedAt: "2024-04-12T18:00:00Z",
    resources: genResources("b022", 65000, 11000, false, false, false, "2024-04-09T10:00:00Z")
  },
  {
    id: "b023",
    factoryId: "f001",
    batchNumber: "BATCH-24-04-03",
    productName: "Packaged Spice Blends",
    productType: "food_processing",
    rawMaterial: "Whole Spices",
    quantity: 10000,
    unit: "packs",
    status: "completed",
    startedAt: "2024-04-15T06:00:00Z",
    completedAt: "2024-04-18T18:00:00Z",
    resources: genResources("b023", 11000, 4500, false, false, false, "2024-04-16T10:00:00Z")
  },
  {
    id: "b024",
    factoryId: "f001",
    batchNumber: "BATCH-24-04-04",
    productName: "Recycled Packaging Paper",
    productType: "paper",
    rawMaterial: "Recycled Corrugated Waste",
    quantity: 6000,
    unit: "kg",
    status: "in-progress",
    startedAt: "2024-04-22T06:00:00Z",
    resources: genResources("b024", 150000, 6000, false, false, false, "2024-04-23T10:00:00Z")
  }
];

// ─── Dynamic Sustainability Scores ───────────────────────────
// We calculate scores dynamically using the real engine to ensure 100% accuracy.
export const MOCK_SCORED_BATCHES = MOCK_BATCHES.map(b => {
  const result = calculateBatchScore(b);
  return {
    ...b,
    scoreResult: result,
    grade: grade(result.score),
  };
});

// ─── Derived Dashboard Stats ──────────────────────────────────
export interface DashboardStats {
  totalBatches: number;
  avgScore: number;
  totalWaterLiters: number;
  totalEnergyKWh: number;
}

export function getDashboardStats(): DashboardStats {
  const completed = MOCK_SCORED_BATCHES.filter(b => b.status === "completed");
  const avgScore = completed.reduce((s, b) => s + b.scoreResult.score, 0) / (completed.length || 1);
  const totalWater = MOCK_SCORED_BATCHES.reduce((s, b) => s + b.scoreResult.totalWater, 0);
  const totalEnergy = MOCK_SCORED_BATCHES.reduce((s, b) => s + b.scoreResult.totalElectricity, 0);

  return {
    totalBatches: MOCK_BATCHES.length,
    avgScore: Math.round(avgScore),
    totalWaterLiters: totalWater,
    totalEnergyKWh: Math.round(totalEnergy),
  };
}

// ─── Trend data for chart ────────────────────────────────────
export interface TrendPoint {
  label: string;
  score: number;
  water: number;
  power: number;
}

export function getTrendData(): TrendPoint[] {
  // Sort completed batches chronologically
  const sorted = [...MOCK_SCORED_BATCHES]
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

// ─── Top and Lowest Ranked Batches ───────────────────────────
export interface RankedBatch {
  batchId: string;
  batchNumber: string;
  productName: string;
  score: number;
  grade: SustainabilityGrade;
  date: string;
}

export function getTopBatches(count: number = 3): RankedBatch[] {
  const completed = MOCK_SCORED_BATCHES.filter((b) => b.status === "completed");
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

export function getLowestBatches(count: number = 3): RankedBatch[] {
  const completed = MOCK_SCORED_BATCHES.filter((b) => b.status === "completed");
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

// ─── Recent Batches Table Data ────────────────────────────────
export function getRecentBatches(count: number = 6) {
  const sorted = [...MOCK_SCORED_BATCHES].sort(
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
