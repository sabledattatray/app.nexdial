import { describe, it, expect } from "vitest";
import {
  ReportDefinition,
  parseReportDefinition,
  validateReportJson,
  serializeReportDefinition,
} from "@/domain/report/schema";

describe("Report Definition Schema & Serializer (PRD 7.8, 10, 11)", () => {
  const validReport: ReportDefinition = {
    version: "1.0.0",
    id: "report_sales_123",
    title: "Executive Sales MIS",
    description: "Monthly executive summary of regional revenue",
    datasetId: "ds_456",
    datasetName: "sales-q1.csv",
    widgets: [
      {
        id: "w_kpi_1",
        type: "kpi",
        title: "Total Sales",
        measureField: "Amount",
        aggregation: "sum",
        gridSpan: "quarter",
      },
      {
        id: "w_bar_1",
        type: "bar",
        title: "Revenue by Region",
        dimensionField: "Region",
        measureField: "Amount",
        aggregation: "sum",
        topN: 10,
        gridSpan: "half",
      },
    ],
    filters: [
      {
        id: "f_1",
        fieldId: "f_region",
        fieldName: "Region",
        type: "categorical",
        operator: "in",
        values: ["North", "South"],
      },
    ],
    createdAt: "2026-10-10T12:00:00.000Z",
    updatedAt: "2026-10-10T12:00:00.000Z",
  };

  it("validates a compliant ReportDefinition successfully", () => {
    const result = parseReportDefinition(validReport);
    expect(result.success).toBe(true);
    expect(result.data?.version).toBe("1.0.0");
    expect(result.data?.widgets.length).toBe(2);
  });

  it("serializes and deserializes report configuration losslessly", () => {
    const jsonString = serializeReportDefinition(validReport);
    const result = validateReportJson(jsonString);

    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(validReport.id);
    expect(result.data?.title).toBe(validReport.title);
    expect(result.data?.widgets[0].title).toBe("Total Sales");
  });

  it("rejects invalid JSON syntax gracefully", () => {
    const malformed = "{ this is not valid json }";
    const result = validateReportJson(malformed);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid JSON syntax");
  });

  it("rejects invalid report versions or missing fields", () => {
    const invalidVersion = {
      ...validReport,
      version: "2.0.0", // Unsupported version
    };
    const result = parseReportDefinition(invalidVersion);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("rejects unknown widget chart types or invalid aggregations", () => {
    const invalidWidget = {
      ...validReport,
      widgets: [
        {
          id: "w_bad",
          type: "unsupported_3d_chart", // Not in enum
          title: "Bad Chart",
          aggregation: "invalid_agg",
        },
      ],
    };
    const result = parseReportDefinition(invalidWidget);

    expect(result.success).toBe(false);
  });
});
