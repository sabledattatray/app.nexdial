/**
 * OpenMIS Client-Side CSV Exporter
 *
 * Implements PRD Section 7.9 & 11:
 * Generates sanitized, UTF-8 encoded CSV files honoring active filters.
 */

import Papa from "papaparse";
import { RowData, FieldMetadata } from "@/domain/dataset/types";
import { sanitizeRowsForExport } from "../security/formula-sanitizer";

export function exportToCsv(
  rows: RowData[],
  fields?: FieldMetadata[],
  filename = "openmis_export.csv"
): void {
  if (typeof window === "undefined") return;

  // 1. Sanitize to guard against formula injection
  const safeRows = sanitizeRowsForExport(rows);

  // 2. Select columns if fields are specified
  let exportData: RowData[] = safeRows;
  if (fields && fields.length > 0) {
    const fieldNames = fields.map((f) => f.name);
    exportData = safeRows.map((row) => {
      const filtered: RowData = {};
      for (const name of fieldNames) {
        filtered[name] = row[name] ?? "";
      }
      return filtered;
    });
  }

  // 3. Unparse to CSV string
  const csvString = Papa.unparse(exportData);

  // 4. Add UTF-8 Byte Order Mark (\uFEFF) so Excel respects UTF-8 encoding
  const blob = new Blob(["\uFEFF", csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
