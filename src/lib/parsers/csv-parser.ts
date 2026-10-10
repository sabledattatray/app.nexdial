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
        const headers = results.meta.fields || [];
        const detectedDelimiter = results.meta.delimiter || ",";
        const rows: RowData[] = results.data as RowData[];
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
