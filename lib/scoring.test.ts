import { calculateBatchScore } from "./scoring";
import { Batch } from "@/types";

import { ResourceLog } from "@/types";

// Helper to create a base batch
const createBatch = (quantity: number, resources: Partial<ResourceLog>[]): Batch => ({
  id: "test-batch",
  factoryId: "f001",
  batchNumber: "TEST-001",
  productName: "Test Product",
  quantity,
  unit: "units",
  status: "completed",
  startedAt: "2025-01-01T00:00:00Z",
  resources: resources as ResourceLog[],
});

describe("Sustainability Score Engine", () => {

  test("1. Perfect Score Example (100)", () => {
    // 100 units.
    // Water: 40L per unit (4000L total) -> <= 50, deduction = 0
    // Elec: 1.5kWh per unit (150kWh total) -> <= 2, deduction = 0
    // Fuel: None -> deduction = 0
    // Waste: Composted -> deduction = 0
    // Water Source: Municipal -> deduction = 0
    const perfectBatch = createBatch(100, [
      { resourceType: "water", quantity: 4000, waterSource: "municipal" },
      { resourceType: "electricity", quantity: 150 },
      { resourceType: "waste", quantity: 50, disposalMethod: "composted" },
    ]);

    const result = calculateBatchScore(perfectBatch);
    expect(result.score).toBe(100);
    expect(result.deductions.water).toBe(0);
    expect(result.deductions.electricity).toBe(0);
    expect(result.deductions.waste).toBe(0);
  });

  test("2. Low Sustainability Example", () => {
    // 100 units.
    // Water: 300L per unit (30000L total) -> 250L over 50. 250/10 = 25. Max cap -> -20.
    // Elec: 15kWh per unit (1500kWh total) -> 13kWh over 2. 13/0.5 = 26. Max cap -> -20.
    // Fuel: Used -> -10
    // Waste: Landfill -> -15
    // Water Source: Tanker -> -10
    // Total deductions = 20 + 20 + 10 + 15 + 10 = 75. Final Score = 25.
    const badBatch = createBatch(100, [
      { resourceType: "water", quantity: 30000, waterSource: "tanker" },
      { resourceType: "electricity", quantity: 1500 },
      { resourceType: "fuel", quantity: 100, fuelType: "diesel" },
      { resourceType: "waste", quantity: 50, disposalMethod: "landfill" },
    ]);

    const result = calculateBatchScore(badBatch);
    expect(result.score).toBe(25);
    expect(result.deductions.water).toBe(20);
    expect(result.deductions.electricity).toBe(20);
    expect(result.deductions.fuel).toBe(10);
    expect(result.deductions.waste).toBe(15);
    expect(result.deductions.tanker).toBe(10);
  });

  test("3. Mixed Example", () => {
    // 100 units.
    // Water: 60L per unit (6000L total). 10L over 50. -> -1.
    // Elec: 2.5kWh per unit (250kWh total). 0.5kWh over 2. -> -1.
    // Fuel: None -> 0.
    // Waste: Recycler -> -5.
    // Water Source: Municipal -> 0.
    // Total deductions = 1 + 1 + 0 + 5 + 0 = 7. Final Score = 93.
    const mixedBatch = createBatch(100, [
      { resourceType: "water", quantity: 6000, waterSource: "municipal" },
      { resourceType: "electricity", quantity: 250 },
      { resourceType: "waste", quantity: 50, disposalMethod: "recycler" },
    ]);

    const result = calculateBatchScore(mixedBatch);
    expect(result.score).toBe(93);
    expect(result.deductions.water).toBe(1);
    expect(result.deductions.electricity).toBe(1);
    expect(result.deductions.waste).toBe(5);
  });

  describe("4. Edge Cases", () => {
    test("Zero units should not cause division by zero", () => {
      // 0 units with 1000L water. Fallback to 1 unit. Water/unit = 1000. 
      // 950 over 50. -> Max cap -20.
      const zeroBatch = createBatch(0, [
        { resourceType: "water", quantity: 1000, waterSource: "municipal" },
      ]);
      const result = calculateBatchScore(zeroBatch);
      expect(result.waterPerUnit).toBe(1000);
      expect(result.deductions.water).toBe(20);
    });

    test("Missing resource logs should default to perfect score", () => {
      const emptyBatch = createBatch(100, []);
      const result = calculateBatchScore(emptyBatch);
      expect(result.score).toBe(100);
      expect(result.totalWater).toBe(0);
      expect(result.totalElectricity).toBe(0);
    });

    test("Negative values are clamped safely", () => {
      const negativeBatch = createBatch(100, [
        { resourceType: "water", quantity: -500, waterSource: "municipal" },
      ]);
      const result = calculateBatchScore(negativeBatch);
      expect(result.totalWater).toBe(0);
      expect(result.score).toBe(100);
    });

    test("Math.floor is correctly applied for partial thresholds", () => {
      // Water: 65L/unit -> 15L over 50. 15/10 = 1.5 -> floor(1.5) = 1 point deduction.
      const floorBatch = createBatch(100, [
        { resourceType: "water", quantity: 6500, waterSource: "municipal" }
      ]);
      const result = calculateBatchScore(floorBatch);
      expect(result.deductions.water).toBe(1);
    });
  });

});
