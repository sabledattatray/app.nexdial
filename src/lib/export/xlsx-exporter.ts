/**
 * OpenMIS Client-Side Excel (XLSX) Exporter
 *
 * Implements PRD Section 7.9 & 11:
 * Generates sanitized Microsoft Excel (.xlsx) workbooks honoring active filters.
 */

import * as XLSX from "xlsx";
import { RowData, FieldMetadata } from "@/domain/dataset/types";
import { sanitizeRowsForExport } from "../security/formula-sanitizer";

export function exportToXlsx(
  rows: RowData[],
  fields?: FieldMetadata[],
  sheetName = "MIS_Data",
  filename = "openmis_export.xlsx"
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

  // 3. Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31)); // Max 31 chars in sheet name

  // 4. Trigger download
  const cleanFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, cleanFilename);
}
