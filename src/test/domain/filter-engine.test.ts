import { describe, it, expect } from "vitest";
import { applyReportFilters } from "@/domain/report/filter-engine";
import { ReportFilter } from "@/domain/report/schema";
import { RowData } from "@/domain/dataset/types";

describe("Client-Side Filter Engine (PRD 7.8)", () => {
  const sampleRows: RowData[] = [
    { id: 1, region: "North", date: "2026-01-15", amount: 100 },
    { id: 2, region: "South", date: "2026-02-20", amount: 250 },
    { id: 3, region: "North", date: "2026-03-10", amount: 400 },
    { id: 4, region: "East", date: "2026-04-05", amount: 50 },
    { id: 5, region: "West", date: "2026-05-12", amount: 600 },
  ];

  it("returns all rows when no filters are applied", () => {
    const result = applyReportFilters(sampleRows, []);
    expect(result.length).toBe(5);
  });

  it("filters accurately by categorical in-list match", () => {
    const filters: ReportFilter[] = [
      {
        id: "f_cat",
        fieldId: "f_reg",
        fieldName: "region",
        type: "categorical",
        operator: "in",
        values: ["North", "East"],
      },
    ];

    const result = applyReportFilters(sampleRows, filters);
    expect(result.length).toBe(3);
    expect(result.every((r) => r.region === "North" || r.region === "East")).toBe(true);
  });

  it("filters accurately by date range interval", () => {
    const filters: ReportFilter[] = [
      {
        id: "f_date",
        fieldId: "f_dt",
        fieldName: "date",
        type: "date_range",
        operator: "between",
        values: ["2026-02-01", "2026-04-01"],
      },
    ];

    const result = applyReportFilters(sampleRows, filters);
    expect(result.length).toBe(2); // IDs 2 (2026-02-20) and 3 (2026-03-10)
    expect(result.map((r) => r.id)).toEqual([2, 3]);
  });

  it("filters accurately by numeric range interval", () => {
    const filters: ReportFilter[] = [
      {
        id: "f_num",
        fieldId: "f_amt",
        fieldName: "amount",
        type: "numeric_range",
        operator: "between",
        values: [100, 400],
      },
    ];

    const result = applyReportFilters(sampleRows, filters);
    expect(result.length).toBe(3); // 100, 250, 400
    expect(result.map((r) => r.id)).toEqual([1, 2, 3]);
  });

  it("combines multiple filters using strict logical AND", () => {
    const filters: ReportFilter[] = [
      {
        id: "f_cat",
        fieldId: "f_reg",
        fieldName: "region",
        type: "categorical",
        operator: "in",
        values: ["North"],
      },
      {
        id: "f_num",
        fieldId: "f_amt",
        fieldName: "amount",
        type: "numeric_range",
        operator: "between",
        values: [200, 500],
      },
    ];

    const result = applyReportFilters(sampleRows, filters);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(3); // North and 400
  });
});
