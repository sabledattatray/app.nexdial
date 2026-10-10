import { describe, it, expect } from "vitest";
import { recommendDashboardWidgets } from "@/domain/recommendations/chart-recommender";
import { FieldMetadata, RowData } from "@/domain/dataset/types";

describe("Chart Recommender & Specification Builder (PRD 7.5)", () => {
  const fields: FieldMetadata[] = [
    {
      id: "f_order_date",
      name: "OrderDate",
      originalName: "OrderDate",
      inferredType: "date",
      userType: "date",
      role: "time_dimension",
      nullCount: 0,
      emptyStringCount: 0,
      distinctCount: 50,
      sampleValues: ["2026-01-01"],
      missingPercentage: 0,
      confidence: 1,
    },
    {
      id: "f_region",
      name: "Region",
      originalName: "Region",
      inferredType: "categorical",
      userType: "categorical",
      role: "dimension",
      nullCount: 0,
      emptyStringCount: 0,
      distinctCount: 4, // Low cardinality <= 6 (ideal for donut/bar)
      sampleValues: ["North", "South", "East", "West"],
      missingPercentage: 0,
      confidence: 1,
    },
    {
      id: "f_sales",
      name: "Sales",
      originalName: "Sales",
      inferredType: "number",
      userType: "number",
      role: "measure",
      nullCount: 0,
      emptyStringCount: 0,
      distinctCount: 100,
      sampleValues: ["1200"],
      missingPercentage: 0,
      confidence: 1,
    },
    {
      id: "f_profit",
      name: "Profit",
      originalName: "Profit",
      inferredType: "number",
      userType: "number",
      role: "measure",
      nullCount: 0,
      emptyStringCount: 0,
      distinctCount: 95,
      sampleValues: ["300"],
      missingPercentage: 0,
      confidence: 1,
    },
  ];

  const sampleRows: RowData[] = [
    { OrderDate: "2026-01-01", Region: "North", Sales: 1000, Profit: 250 },
    { OrderDate: "2026-01-02", Region: "South", Sales: 1500, Profit: 400 },
    { OrderDate: "2026-01-03", Region: "East", Sales: 800, Profit: 150 },
  ];

  it("recommends executive KPI cards for top measures and total records", () => {
    const widgets = recommendDashboardWidgets(fields, sampleRows);
    const kpis = widgets.filter((w) => w.type === "kpi");

    expect(kpis.length).toBeGreaterThanOrEqual(2);
    expect(kpis.some((k) => k.title.includes("Sales"))).toBe(true);
    expect(kpis.some((k) => k.title === "Total Records")).toBe(true);
    expect(kpis[0].whyThisChart).toBeDefined();
  });

  it("recommends time-series area/line chart for date + measure combination", () => {
    const widgets = recommendDashboardWidgets(fields, sampleRows);
    const timeWidget = widgets.find((w) => w.type === "area" || w.type === "line");

    expect(timeWidget).toBeDefined();
    expect(timeWidget?.dimensionField).toBe("OrderDate");
    expect(timeWidget?.measureField).toBe("Sales");
    expect(timeWidget?.gridSpan).toBe("full");
  });

  it("recommends category bar chart for dimension + measure", () => {
    const widgets = recommendDashboardWidgets(fields, sampleRows);
    const barWidget = widgets.find((w) => w.type === "bar");

    expect(barWidget).toBeDefined();
    expect(barWidget?.dimensionField).toBe("Region");
    expect(barWidget?.measureField).toBe("Sales");
    expect(barWidget?.topN).toBe(10);
  });

  it("recommends donut chart for low-cardinality dimension (distinctCount <= 6)", () => {
    const widgets = recommendDashboardWidgets(fields, sampleRows);
    const donutWidget = widgets.find((w) => w.type === "donut");

    expect(donutWidget).toBeDefined();
    expect(donutWidget?.dimensionField).toBe("Region");
    expect(donutWidget?.topN).toBe(5);
  });

  it("recommends scatter plot for two continuous measures", () => {
    const widgets = recommendDashboardWidgets(fields, sampleRows);
    const scatterWidget = widgets.find((w) => w.type === "scatter");

    expect(scatterWidget).toBeDefined();
    expect(scatterWidget?.measureField).toBe("Sales");
    expect(scatterWidget?.secondaryMeasureField).toBe("Profit");
  });
});
