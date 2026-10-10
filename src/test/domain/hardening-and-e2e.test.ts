import { describe, it, expect } from "vitest";
import { parseCsvString } from "@/lib/parsers/csv-parser";
import { profileDataset } from "@/domain/dataset/profiler";
import { trimWhitespace } from "@/domain/cleaning/transformations";
import { calculateAggregation, safeDivide } from "@/domain/metrics/aggregations";
import { generateDeterministicInsights } from "@/domain/insights/insights-engine";
import { recommendDashboardWidgets } from "@/domain/recommendations/chart-recommender";
import { applyReportFilters } from "@/domain/report/filter-engine";
import { sanitizeCellForExport } from "@/lib/security/formula-sanitizer";
import { parseReportDefinition, ReportDefinitionSchema } from "@/domain/report/schema";
import { RowData } from "@/domain/dataset/types";
import { ReportFilter } from "@/domain/report/schema";

describe("Phase 8: Hardening & End-to-End Release Gate", () => {
  it("executes the complete end-to-end user workflow flawlessly", async () => {
    // 1. Raw dirty CSV input simulating real spreadsheet with whitespace, negatives, formulas
    const rawCsv = `Date,Sales_Rep,Region,Revenue,Units
2026-01-15,Alice ,North,10000,50
2026-01-20,Bob,South,15000,60
2026-02-10,Alice ,North,20000,80
2026-02-15,Charlie,East,5000,20
2026-02-28,MaliciousUser,West,=cmd|'/C calc'!A0,10`;

    // 2. Parse CSV
    const parsed = await parseCsvString(rawCsv);
    expect(parsed.rows.length).toBe(5);
    expect(parsed.headers).toEqual(["Date", "Sales_Rep", "Region", "Revenue", "Units"]);

    // 3. Profile dataset
    const profile = profileDataset(parsed.rows, parsed.headers, {
      id: "ds_test",
      name: "TEST_SALES",
      sourceFormat: "csv",
      sizeBytes: rawCsv.length,
      importedAt: "2026-10-10T00:00:00.000Z",
    });
    expect(profile.metadata.rowCount).toBe(5);
    expect(profile.fields.length).toBe(5);

    // 4. Reversible Data Cleaning: Trim Whitespace
    const trimResult = trimWhitespace(parsed.rows, profile.fields);
    const cleanedRows = trimResult.updatedRows;
    // Check that 'Alice ' was trimmed to 'Alice'
    expect(cleanedRows[0]["Sales_Rep"]).toBe("Alice");

    // Filter out rows where Revenue is string formula
    const numericRows = cleanedRows.filter((r) => typeof r["Revenue"] === "number");
    expect(numericRows.length).toBe(4);

    // 5. Deterministic Metrics
    const totalRevenue = calculateAggregation(numericRows, "Revenue", "sum").value;
    const avgRevenue = calculateAggregation(numericRows, "Revenue", "average").value;
    const minRevenue = calculateAggregation(numericRows, "Revenue", "min").value;
    const maxRevenue = calculateAggregation(numericRows, "Revenue", "max").value;

    expect(totalRevenue).toBe(50000); // 10000 + 15000 + 20000 + 5000
    expect(avgRevenue).toBe(12500);
    expect(minRevenue).toBe(5000);
    expect(maxRevenue).toBe(20000);

    // 6. Safe Divide Guard
    expect(safeDivide(50000, 0)).toBeNull();
    expect(safeDivide(20000, 10000)).toBe(2);

    // 7. Deterministic Insights
    const insights = generateDeterministicInsights(numericRows, profile.fields);
    expect(insights.length).toBeGreaterThan(0);
    for (const insight of insights) {
      expect(insight.title.length).toBeGreaterThan(0);
      expect(insight.description.length).toBeGreaterThan(0);
    }

    // 8. Recommender
    const widgets = recommendDashboardWidgets(profile.fields, numericRows);
    expect(widgets.length).toBeGreaterThanOrEqual(2);

    // 9. Filter Engine
    const filters: ReportFilter[] = [
      {
        id: "f_region",
        fieldId: "f_reg",
        fieldName: "Region",
        type: "categorical",
        operator: "in",
        values: ["North"],
      },
    ];
    const filteredByNorth = applyReportFilters(numericRows, filters);
    expect(filteredByNorth.length).toBe(2);
    expect(calculateAggregation(filteredByNorth, "Revenue", "sum").value).toBe(30000);

    // 10. Formula Sanitization on Export
    const safeFormula = sanitizeCellForExport("=cmd|'/C calc'!A0");
    expect(safeFormula).toBe("'=cmd|'/C calc'!A0");

    const safeCmd = sanitizeCellForExport("+cmd|'/C calc'");
    expect(safeCmd).toBe("'+cmd|'/C calc'");

    const safeNegative = sanitizeCellForExport(-42.5);
    expect(safeNegative).toBe(-42.5);

    const safePositive = sanitizeCellForExport("+100");
    expect(safePositive).toBe("+100");
  });

  it("neutralizes prototype pollution attempts in parsed spreadsheets", async () => {
    const maliciousCsv = `Date,__proto__,constructor,prototype,Amount
2026-01-01,admin,true,hacked,500`;

    const parsed = await parseCsvString(maliciousCsv);
    expect(parsed.rows.length).toBe(1);

    // Ensure __proto__, constructor, and prototype were renamed to safe keys
    expect(parsed.headers).toContain("___proto___");
    expect(parsed.headers).toContain("_constructor_");
    expect(parsed.headers).toContain("_prototype_");

    // Verify global Object prototype is untouched
    const testObj: Record<string, unknown> = {};
    expect((testObj as { admin?: string }).admin).toBeUndefined();
    expect((testObj as { hacked?: string }).hacked).toBeUndefined();
  });

  it("handles edge cases: zero-row, single-row, and 100% null columns without throwing", () => {
    const emptyRows: RowData[] = [];
    expect(calculateAggregation(emptyRows, "NonExistent", "sum").value).toBeNull();
    expect(calculateAggregation(emptyRows, "NonExistent", "average").value).toBeNull();
    expect(calculateAggregation(emptyRows, "NonExistent", "min").value).toBeNull();
    expect(calculateAggregation(emptyRows, "NonExistent", "max").value).toBeNull();

    const singleRow: RowData[] = [{ Val: 42 }];
    expect(calculateAggregation(singleRow, "Val", "sum").value).toBe(42);
    expect(calculateAggregation(singleRow, "Val", "average").value).toBe(42);
    expect(calculateAggregation(singleRow, "Val", "min").value).toBe(42);
    expect(calculateAggregation(singleRow, "Val", "max").value).toBe(42);

    const nullRows: RowData[] = [{ Val: null }, { Val: null }, { Val: undefined }];
    expect(calculateAggregation(nullRows, "Val", "sum").value).toBeNull();
    expect(calculateAggregation(nullRows, "Val", "average").value).toBeNull();
  });

  it("strictly validates and rejects malformed ReportDefinitionSchema payloads", () => {
    const validReport = {
      version: "1.0.0",
      id: "rep_valid_1",
      title: "Executive Sales Dashboard",
      description: "Tested report definition",
      datasetId: "ds_123",
      datasetName: "SALES_DATA",
      createdAt: "2026-10-10T00:00:00.000Z",
      updatedAt: "2026-10-10T00:00:00.000Z",
      filters: [],
      widgets: [
        {
          id: "w1",
          title: "Total Revenue",
          type: "kpi" as const,
          measureField: "Revenue",
          aggregation: "sum" as const,
          gridSpan: "half" as const,
        },
      ],
    };

    const parseResult = parseReportDefinition(validReport);
    expect(parseResult.success).toBe(true);

    // Test rejection of invalid version
    const invalidVersion = { ...validReport, version: "2.0.0-unsupported" };
    expect(ReportDefinitionSchema.safeParse(invalidVersion).success).toBe(false);

    // Test rejection of missing title
    const missingTitle = { ...validReport, title: "" };
    expect(ReportDefinitionSchema.safeParse(missingTitle).success).toBe(false);

    // Test rejection of unsupported widget type
    const invalidWidgetType = {
      ...validReport,
      widgets: [{ ...validReport.widgets[0], type: "unknown_3d_pie" }],
    };
    expect(ReportDefinitionSchema.safeParse(invalidWidgetType).success).toBe(false);
  });
});
