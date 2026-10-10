/**
 * OpenMIS CSV Parser
 *
 * Implements PRD Section 7.1:
 * Client-side CSV parsing with delimiter auto-detection and override.
 */

import Papa from "papaparse";
import { RowData } from "@/domain/dataset/types";

export interface CsvParseOptions {
  delimiter?: string;
  headerRowIndex?: number;
}

export interface CsvParseResult {
  headers: string[];
  rows: RowData[];
  detectedDelimiter: string;
  errors: string[];
}

export function parseCsvString(
  csvText: string,
  options?: CsvParseOptions
): Promise<CsvParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(csvText, {
      header: true,
      skipEmptyLines: "greedy",
      dynamicTyping: true,
      delimiter: options?.delimiter || "", // Empty string enables auto-detection
      complete: (results) => {
        const sanitizeKey = (key: string): string => {
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return `_${key}_`;
          }
          return key;
        };

        const rawHeaders = results.meta.fields || [];
        const headers = rawHeaders.map(sanitizeKey);
        const detectedDelimiter = results.meta.delimiter || ",";
        const rawRows = results.data as Record<string, unknown>[];

        const rows: RowData[] = rawRows.map((raw) => {
          const cleanRow: RowData = {};
          for (const [k, v] of Object.entries(raw)) {
            cleanRow[sanitizeKey(k)] = v;
          }
          return cleanRow;
        });

        const errors = results.errors.map((e) => `Row ${e.row}: ${e.message}`);

        resolve({
          headers,
          rows,
          detectedDelimiter,
          errors,
        });
      },
      error: (err: Error) => {
        reject(new Error(`Failed to parse CSV: ${err.message}`));
      },
    });
  });
}
