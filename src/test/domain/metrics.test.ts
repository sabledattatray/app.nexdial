import { describe, it, expect } from "vitest";
import {
  calculateAggregation,
  safeDivide,
  extractNumericValues,
} from "@/domain/metrics/aggregations";
import {
  calculatePercentageChange,
  calculateMargin,
  calculateRatio,
} from "@/domain/metrics/derived";
import { RowData } from "@/domain/dataset/types";

describe("Aggregations Engine (PRD 7.6)", () => {
  const sampleRows: RowData[] = [
    { id: 1, category: "Electronics", amount: 100, cost: 60, region: "North" },
    { id: 2, category: "Furniture", amount: 200, cost: 150, region: "South" },
    { id: 3, category: "Electronics", amount: 300, cost: 180, region: "North" },
    { id: 4, category: "Clothing", amount: 400, cost: 200, region: "East" },
    { id: 5, category: "Clothing", amount: 500, cost: 350, region: "North" },
  ];

  it("calculates SUM accurately", () => {
    const res = calculateAggregation(sampleRows, "amount", "sum");
    expect(res.value).toBe(1500);
    expect(res.sampleSize).toBe(5);
    expect(res.formula).toBe("SUM(amount)");
  });

  it("calculates AVERAGE accurately", () => {
    const res = calculateAggregation(sampleRows, "amount", "average");
    expect(res.value).toBe(300);
    expect(res.sampleSize).toBe(5);
  });

  it("calculates MIN and MAX", () => {
    const minRes = calculateAggregation(sampleRows, "amount", "min");
    const maxRes = calculateAggregation(sampleRows, "amount", "max");
    expect(minRes.value).toBe(100);
    expect(maxRes.value).toBe(500);
  });

  it("calculates MEDIAN for odd and even sample sizes", () => {
    const oddRes = calculateAggregation(sampleRows, "amount", "median");
    expect(oddRes.value).toBe(300);

    const evenRows: RowData[] = [
      { amount: 10 },
      { amount: 20 },
      { amount: 30 },
      { amount: 40 },
    ];
    const evenRes = calculateAggregation(evenRows, "amount", "median");
    expect(evenRes.value).toBe(25);
  });

  it("calculates COUNT and DISTINCT_COUNT", () => {
    const countRes = calculateAggregation(sampleRows, "category", "count");
    expect(countRes.value).toBe(5);

    const distinctRes = calculateAggregation(sampleRows, "category", "distinct_count");
    expect(distinctRes.value).toBe(3); // Electronics, Furniture, Clothing
  });

  it("calculates MISSING_COUNT for empty and null rows", () => {
    const dirtyRows: RowData[] = [
      { tag: "active" },
      { tag: null },
      { tag: "" },
      { tag: "   " },
      { tag: "archived" },
    ];
    const res = calculateAggregation(dirtyRows, "tag", "missing_count");
    expect(res.value).toBe(3);
  });

  it("handles empty rows safely", () => {
    const res = calculateAggregation([], "amount", "sum");
    expect(res.value).toBeNull();
    expect(res.sampleSize).toBe(0);
  });

  it("handles currency symbols and formatted strings in extractNumericValues", () => {
    const formattedRows: RowData[] = [
      { revenue: "$1,200.50" },
      { revenue: "₹3,400.00" },
      { revenue: "€500" },
      { revenue: "N/A" },
    ];
    const values = extractNumericValues(formattedRows, "revenue");
    expect(values).toEqual([1200.5, 3400, 500]);
  });

  it("safeDivide guards against zero denominator and non-finite results", () => {
    expect(safeDivide(100, 0)).toBeNull();
    expect(safeDivide(100, NaN)).toBeNull();
    expect(safeDivide(100, Infinity)).toBeNull();
    expect(safeDivide(100, 4)).toBe(25);
  });
});

describe("Derived Metrics (PRD 7.6)", () => {
  it("calculates percentage change correctly for positive growth", () => {
    const res = calculatePercentageChange(150, 100);
    expect(res.value).toBe(50);
    expect(res.formattedText).toBe("+50.0%");
    expect(res.isPositive).toBe(true);
  });

  it("calculates percentage change correctly for negative growth", () => {
    const res = calculatePercentageChange(80, 100);
    expect(res.value).toBe(-20);
    expect(res.formattedText).toBe("-20.0%");
    expect(res.isPositive).toBe(false);
  });

  it("handles 0 baseline in percentage change without crashing", () => {
    const res = calculatePercentageChange(100, 0);
    expect(res.value).toBeNull();
    expect(res.formattedText).toBe("N/A (Baseline was 0)");
  });

  it("calculates profit margin accurately", () => {
    const res = calculateMargin(1000, 700);
    expect(res.value).toBe(30);
    expect(res.formattedText).toBe("30.0%");
    expect(res.isPositive).toBe(true);
  });

  it("handles 0 revenue in profit margin without crashing", () => {
    const res = calculateMargin(0, 500);
    expect(res.value).toBeNull();
    expect(res.formattedText).toBe("N/A");
  });

  it("calculates numeric ratio cleanly", () => {
    const res = calculateRatio(400, 100);
    expect(res.value).toBe(4);
    expect(res.formattedText).toBe("4:1");
    expect(res.isPositive).toBe(true);
  });
});
