import { describe, it, expect } from "vitest";
import { generateDeterministicInsights } from "@/domain/insights/insights-engine";
import { FieldMetadata, RowData } from "@/domain/dataset/types";

describe("Deterministic Insights Engine (PRD 7.7)", () => {
  const fields: FieldMetadata[] = [
    {
      id: "f_cat",
      name: "Category",
      originalName: "Category",
      inferredType: "categorical",
      userType: "categorical",
      role: "dimension",
      nullCount: 0,
      emptyStringCount: 0,
      distinctCount: 3,
      sampleValues: ["Electronics", "Books", "Clothing"],
      missingPercentage: 0,
      confidence: 1,
    },
    {
      id: "f_rev",
      name: "Revenue",
      originalName: "Revenue",
      inferredType: "number",
      userType: "number",
      role: "measure",
      nullCount: 0,
      emptyStringCount: 0,
      distinctCount: 10,
      sampleValues: ["1000", "200"],
      missingPercentage: 0,
      confidence: 1,
    },
    {
      id: "f_sparse",
      name: "Notes",
      originalName: "Notes",
      inferredType: "text",
      userType: "text",
      role: "dimension",
      nullCount: 4,
      emptyStringCount: 2,
      distinctCount: 2,
      sampleValues: ["Important"],
      missingPercentage: 60, // 6 out of 10 rows missing
      confidence: 1,
    },
  ];

  it("identifies high category concentration when dominant category exceeds 40%", () => {
    const rows: RowData[] = [
      { Category: "Electronics", Revenue: 7000 },
      { Category: "Books", Revenue: 1500 },
      { Category: "Clothing", Revenue: 1500 },
    ];

    const insights = generateDeterministicInsights(rows, fields);
    const concentration = insights.find((i) => i.type === "concentration");

    expect(concentration).toBeDefined();
    expect(concentration?.title).toContain("High Concentration");
    expect(concentration?.groupName).toBe("Electronics");
    expect(concentration?.computedValue).toBe("70.0%");
    expect(concentration?.formulaExplanation).toContain("Top Category Sum / Total Sum");
  });

  it("detects statistical outliers using IQR (Tukey method)", () => {
    // 10 data points with 1 extreme outlier
    const rows: RowData[] = [
      { Category: "A", Revenue: 10 },
      { Category: "B", Revenue: 12 },
      { Category: "C", Revenue: 14 },
      { Category: "D", Revenue: 15 },
      { Category: "E", Revenue: 16 },
      { Category: "F", Revenue: 18 },
      { Category: "G", Revenue: 20 },
      { Category: "H", Revenue: 22 },
      { Category: "I", Revenue: 24 },
      { Category: "J", Revenue: 250 }, // Outlier!
    ];

    const insights = generateDeterministicInsights(rows, fields);
    const outlierInsight = insights.find((i) => i.type === "outlier");

    expect(outlierInsight).toBeDefined();
    expect(outlierInsight?.title).toContain("Statistical Outliers in Revenue");
    expect(outlierInsight?.computedValue).toContain("1 outliers");
    expect(outlierInsight?.caveats).toBeDefined();
    expect(outlierInsight?.formulaExplanation).toContain("Q1 - 1.5*(Q3-Q1)");
  });

  it("flags sparse columns with data quality warnings when missing rate >= 25%", () => {
    const rows: RowData[] = [
      { Category: "A", Revenue: 100, Notes: "" },
      { Category: "B", Revenue: 200, Notes: null },
      { Category: "C", Revenue: 300, Notes: "Valid" },
    ];

    const insights = generateDeterministicInsights(rows, fields);
    const qualityInsight = insights.find((i) => i.type === "data_quality");

    expect(qualityInsight).toBeDefined();
    expect(qualityInsight?.title).toContain("Sparse Column: Notes");
    expect(qualityInsight?.computedValue).toBe("60.0% missing");
    expect(qualityInsight?.severity).toBe("warning");
  });

  it("returns empty insights gracefully when rows sample is less than 3", () => {
    const rows: RowData[] = [{ Category: "A", Revenue: 100 }];
    const insights = generateDeterministicInsights(rows, fields);
    expect(insights).toEqual([]);
  });
});
