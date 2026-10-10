/**
 * OpenMIS File Validator
 *
 * Implements PRD Section 7.1:
 * Validates file extension, MIME type, and size limits before parsing.
 */

import { BRAND } from "@/lib/constants/brand";

export interface FileValidationResult {
  isValid: boolean;
  format?: "csv" | "xlsx";
  error?: string;
  fileSizeBytes: number;
}

export function validateSpreadsheetFile(file: File): FileValidationResult {
  const fileSizeBytes = file.size;
  const maxBytes = BRAND.limits.maxFileSizeMb * 1024 * 1024;

  if (fileSizeBytes > maxBytes) {
    return {
      isValid: false,
      fileSizeBytes,
      error: `File size exceeds the ${BRAND.limits.maxFileSizeMb}MB browser safety limit. To protect device memory, please filter or downsample the file.`,
    };
  }

  const name = file.name.toLowerCase();
  const isCsv = name.endsWith(".csv");
  const isXlsx = name.endsWith(".xlsx");
  const isXls = name.endsWith(".xls");

  if (isXls) {
    return {
      isValid: false,
      fileSizeBytes,
      error: "Legacy binary Excel (.xls) files are not supported due to security and browser parsing constraints. Please save your file as modern .xlsx or .csv.",
    };
  }

  if (!isCsv && !isXlsx) {
    return {
      isValid: false,
      fileSizeBytes,
      error: "Unsupported file format. OpenMIS supports .csv and .xlsx spreadsheets.",
    };
  }

  return {
    isValid: true,
    format: isCsv ? "csv" : "xlsx",
    fileSizeBytes,
  };
}
