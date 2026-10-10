/**
 * OpenMIS Excel (.xlsx) Parser
 *
 * Implements PRD Section 7.1:
 * Pure in-browser parsing of modern Excel workbooks with multi-sheet enumeration.
 * Uses SheetJS Community Edition.
 */

import * as XLSX from "xlsx";
import { RowData } from "@/domain/dataset/types";

export interface XlsxWorkbookInfo {
  sheetNames: string[];
}

export interface XlsxSheetResult {
  sheetName: string;
  headers: string[];
  rows: RowData[];
}

export function inspectXlsxWorkbook(data: ArrayBuffer): XlsxWorkbookInfo {
  const workbook = XLSX.read(data, {
    type: "array",
    bookSheets: true,
  });
  return {
    sheetNames: workbook.SheetNames || [],
  };
}

export function parseXlsxSheet(
  data: ArrayBuffer,
  sheetName?: string
): XlsxSheetResult {
  const workbook = XLSX.read(data, {
    type: "array",
    cellFormula: false, // Do not evaluate formula macros
    cellDates: true, // Parse dates as JS Date objects
  });

  const targetSheetName = sheetName || workbook.SheetNames[0];
  if (!targetSheetName || !workbook.Sheets[targetSheetName]) {
    throw new Error(`Sheet "${targetSheetName}" not found in workbook.`);
  }

  const worksheet = workbook.Sheets[targetSheetName];

  // Convert worksheet to raw json array
  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
    raw: false, // Format values as strings/dates where appropriate
  });

  // Extract headers from first non-empty row or sheet range
  const headers: string[] = [];
  if (rawRows.length > 0) {
    Object.keys(rawRows[0]).forEach((h) => {
      if (h && !headers.includes(h)) headers.push(h);
    });
  }

  return {
    sheetName: targetSheetName,
    headers,
    rows: rawRows as RowData[],
  };
}
