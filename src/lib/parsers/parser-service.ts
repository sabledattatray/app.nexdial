/**
 * OpenMIS Unified Parser Service
 *
 * Implements PRD Section 7.1, 7.2:
 * Orchestrates file validation, CSV/XLSX ingestion, sheet enumeration,
 * profiling, and dataset packaging with progress feedback.
 */

import { validateSpreadsheetFile } from "./file-validator";
import { parseCsvString, CsvParseOptions } from "./csv-parser";
import { inspectXlsxWorkbook, parseXlsxSheet } from "./xlsx-parser";
import { profileDataset } from "@/domain/dataset/profiler";
import { DatasetProfile, RowData } from "@/domain/dataset/types";

export interface ParseProgress {
  stage: "validating" | "reading" | "parsing" | "profiling" | "complete";
  percentage: number;
  message: string;
}

export interface IngestionResult {
  profile: DatasetProfile;
  rows: RowData[];
  rawSnapshot: {
    rows: RowData[];
    headers: string[];
  };
}

export async function ingestSpreadsheetFile(
  file: File,
  options?: {
    sheetName?: string;
    csvOptions?: CsvParseOptions;
    onProgress?: (p: ParseProgress) => void;
  }
): Promise<IngestionResult> {
  const onProgress = options?.onProgress || (() => {});

  // 1. Validation
  onProgress({
    stage: "validating",
    percentage: 10,
    message: "Validating file format and size limits...",
  });

  const validation = validateSpreadsheetFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || "Invalid spreadsheet file.");
  }

  // 2. Reading
  onProgress({
    stage: "reading",
    percentage: 30,
    message: "Reading file into memory...",
  });

  let rawHeaders: string[] = [];
  let rows: RowData[] = [];
  let sheetName: string | undefined = undefined;
  let availableSheets: string[] | undefined = undefined;

  if (validation.format === "csv") {
    onProgress({
      stage: "parsing",
      percentage: 50,
      message: "Parsing CSV rows and detecting delimiters...",
    });

    const text = await file.text();
    const csvResult = await parseCsvString(text, options?.csvOptions);
    rawHeaders = csvResult.headers;
    rows = csvResult.rows;
  } else {
    onProgress({
      stage: "parsing",
      percentage: 50,
      message: "Parsing Excel workbook structure...",
    });

    const arrayBuffer = await file.arrayBuffer();
    const workbookInfo = inspectXlsxWorkbook(arrayBuffer);
    availableSheets = workbookInfo.sheetNames;

    const targetSheet = options?.sheetName || workbookInfo.sheetNames[0];
    const xlsxResult = parseXlsxSheet(arrayBuffer, targetSheet);
    rawHeaders = xlsxResult.headers;
    rows = xlsxResult.rows;
    sheetName = xlsxResult.sheetName;
  }

  if (rows.length === 0) {
    throw new Error("No data rows found in this spreadsheet.");
  }

  // 3. Profiling
  onProgress({
    stage: "profiling",
    percentage: 80,
    message: "Profiling columns, inferring types, and computing stats...",
  });

  const datasetId = `dataset_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const profile = profileDataset(rows, rawHeaders, {
    id: datasetId,
    name: file.name,
    sourceFormat: validation.format as "csv" | "xlsx",
    sheetName,
    availableSheets,
    sizeBytes: file.size,
    importedAt: new Date().toISOString(),
  });

  onProgress({
    stage: "complete",
    percentage: 100,
    message: "Ingestion and profiling complete.",
  });

  return {
    profile,
    rows,
    rawSnapshot: {
      rows: JSON.parse(JSON.stringify(rows)),
      headers: [...rawHeaders],
    },
  };
}
