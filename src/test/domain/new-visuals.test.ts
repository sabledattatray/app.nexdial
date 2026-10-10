import { describe, it, expect } from "vitest";
import { ChartTypeSchema, WidgetDefinitionSchema, ReportFilter } from "@/domain/report/schema";
import { MIS_TEMPLATES } from "@/lib/templates/template-registry";
import { applyReportFilters } from "@/domain/report/filter-engine";

describe("New Visualizations Suite", () => {
  const newVisualTypes = [
    "slicer",
    "table",
    "waterfall",
    "pie",
    "horizontal_bar",
    "gauge",
    "funnel",
  ] as const;

  it("validates all newly introduced visual types in ChartTypeSchema", () => {
    for (const visual of newVisualTypes) {
      expect(ChartTypeSchema.safeParse(visual).success).toBe(true);
    }
  });

  it("successfully parses WidgetDefinition for each visual type", () => {
    for (const visual of newVisualTypes) {
      const widget = {
        id: `w_${visual}`,
        type: visual,
        title: `Test ${visual.toUpperCase()}`,
        dimensionField: "Department",
        measureField: "Revenue",
        aggregation: "sum" as const,
        gridSpan: "half" as const,
      };
      const res = WidgetDefinitionSchema.safeParse(widget);
      expect(res.success).toBe(true);
    }
  });

  it("ensures enriched templates contain the new visual types", () => {
    const boardroom = MIS_TEMPLATES.find((t) => t.id === "executive_boardroom");
    expect(boardroom).toBeDefined();
    const boardroomTypes = boardroom?.widgets.map((w) => w.type);
    expect(boardroomTypes).toContain("waterfall");
    expect(boardroomTypes).toContain("slicer");
    expect(boardroomTypes).toContain("table");

    const sales = MIS_TEMPLATES.find((t) => t.id === "sales_mis");
    expect(sales).toBeDefined();
    const salesTypes = sales?.widgets.map((w) => w.type);
    expect(salesTypes).toContain("horizontal_bar");
    expect(salesTypes).toContain("pie");
    expect(salesTypes).toContain("slicer");
    expect(salesTypes).toContain("table");
  });

  it("tests interactive slicer categorical filter evaluation", () => {
    const rows = [
      { Department: "Finance", Gross_Revenue: 10000 },
      { Department: "Engineering", Gross_Revenue: 25000 },
      { Department: "Marketing", Gross_Revenue: 8000 },
      { Department: "Finance", Gross_Revenue: 12000 },
    ];

    const filter: ReportFilter = {
      id: "filter_dept",
      fieldId: "Department",
      fieldName: "Department",
      type: "categorical",
      operator: "in",
      values: ["Finance"],
    };

    const filtered = applyReportFilters(rows, [filter]);
    expect(filtered).toHaveLength(2);
    expect(filtered.every((r) => r.Department === "Finance")).toBe(true);
  });
});
