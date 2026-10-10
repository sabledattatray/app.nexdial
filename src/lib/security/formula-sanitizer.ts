/**
 * OpenMIS CSV & Spreadsheet Formula Injection Guard (DDE Defense)
 *
 * Implements PRD Section 11 & 14:
 * Sanitizes exported cell values to prevent CSV formula injection attacks
 * where malicious spreadsheet cells starting with =, +, -, @, \t, or \r
 * trigger code execution or data leakage in Excel/Calc.
 */

import { RowData } from "@/domain/dataset/types";

/**
 * Sanitizes a single cell value before CSV or XLSX export.
 *
 * - Numbers and booleans pass through unchanged.
 * - Strings starting with =, @, \t, \r are escaped with a leading single quote (').
 * - Strings starting with + or -:
 *   - If the string is a valid numeric representation (e.g. "-45.2", "+100"), it is safe.
 *   - If non-numeric (e.g. "-cmd|' /C calc'!A0"), it is escaped with a leading single quote (').
 */
export function sanitizeCellForExport(val: unknown): unknown {
  if (val === null || val === undefined) {
    return "";
  }

  if (typeof val === "number" || typeof val === "boolean") {
    return val;
  }

  const rawStr = String(val);

  // 1. Tab or Carriage Return at start of raw string
  if (rawStr.startsWith("\t") || rawStr.startsWith("\r")) {
    return `'${rawStr}`;
  }

  const trimmed = rawStr.trim();

  // 2. Direct dangerous formula prefixes: = or @
  if (trimmed.startsWith("=") || trimmed.startsWith("@")) {
    return `'${rawStr}`;
  }

  // 3. Plus or minus prefix: check if it's a legitimate number
  if (trimmed.startsWith("+") || trimmed.startsWith("-")) {
    const isPureNumber = !isNaN(Number(trimmed)) && isFinite(Number(trimmed));
    if (!isPureNumber) {
      return `'${rawStr}`;
    }
  }

  return val;
}

/**
 * Sanitizes an entire record/row of cells
 */
export function sanitizeRowForExport(row: RowData): RowData {
  const sanitized: RowData = {};
  for (const [key, value] of Object.entries(row)) {
    sanitized[key] = sanitizeCellForExport(value);
  }
  return sanitized;
}

/**
 * Sanitizes an array of row data
 */
export function sanitizeRowsForExport(rows: RowData[]): RowData[] {
  return rows.map((row) => sanitizeRowForExport(row));
}
