/**
 * OpenMIS Client-Side Filter Evaluation Engine
 *
 * Implements PRD Section 7.8:
 * Instant client-side re-aggregation across categorical, date, and numeric filters.
 */

import { RowData } from "../dataset/types";
import { ReportFilter } from "./schema";

export function applyReportFilters(
  rows: RowData[],
  filters: ReportFilter[]
): RowData[] {
  if (filters.length === 0 || rows.length === 0) {
    return rows;
  }

  return rows.filter((row) => {
    for (const filter of filters) {
      const rawVal = row[filter.fieldName];

      // 1. Categorical In-List Filter
      if (filter.type === "categorical") {
        if (filter.values.length === 0) continue;
        const strVal = String(rawVal ?? "Unknown").trim();
        const allowed = filter.values.map((v) => String(v).trim().toLowerCase());
        if (!allowed.includes(strVal.toLowerCase())) {
          return false;
        }
      }

      // 2. Date Range Filter
      else if (filter.type === "date_range") {
        if (!rawVal) return false;
        const rowDate = String(rawVal).slice(0, 10);
        const startDate = String(filter.values[0] ?? "");
        const endDate = String(filter.values[1] ?? "");

        if (startDate && rowDate < startDate) return false;
        if (endDate && rowDate > endDate) return false;
      }

      // 3. Numeric Range Filter
      else if (filter.type === "numeric_range") {
        const numVal = Number(rawVal);
        if (isNaN(numVal) || !isFinite(numVal)) return false;

        const minVal = filter.values[0] !== undefined ? Number(filter.values[0]) : -Infinity;
        const maxVal = filter.values[1] !== undefined ? Number(filter.values[1]) : Infinity;

        if (numVal < minVal || numVal > maxVal) {
          return false;
        }
      }
    }

    return true;
  });
}
