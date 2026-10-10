/**
 * OpenMIS Pure Aggregation Calculator
 *
 * Implements PRD Section 7.6:
 * Mathematical functions for SUM, AVG, COUNT, DISTINCT_COUNT, MIN, MAX, MEDIAN.
 * Handles nulls, empty strings, and type conversions safely.
 */

import { RowData } from "../dataset/types";

export type AggregationType =
  | "sum"
  | "average"
  | "count"
  | "distinct_count"
  | "min"
  | "max"
  | "median"
  | "missing_count";

export function safeDivide(
  numerator: number,
  denominator: number
): number | null {
  if (denominator === 0 || !isFinite(denominator) || isNaN(denominator)) {
    return null;
  }
  const result = numerator / denominator;
  return isFinite(result) && !isNaN(result) ? result : null;
}

export function extractNumericValues(
  rows: RowData[],
  fieldName: string
): number[] {
  const result: number[] = [];
  for (const row of rows) {
    const val = row[fieldName];
    if (val !== null && val !== undefined && val !== "") {
      const num =
        typeof val === "number"
          ? val
          : Number(String(val).replace(/^[$\u20AC\u00A3\u20B9]/, "").replace(/,/g, ""));
      if (!isNaN(num) && isFinite(num)) {
        result.push(num);
      }
    }
  }
  return result;
}

export function calculateAggregation(
  rows: RowData[],
  fieldName: string,
  aggregation: AggregationType
): { value: number | null; formula: string; sampleSize: number } {
  if (rows.length === 0) {
    return { value: null, formula: `${aggregation.toUpperCase()}(${fieldName})`, sampleSize: 0 };
  }

  switch (aggregation) {
    case "count":
      return {
        value: rows.length,
        formula: `COUNT(${fieldName})`,
        sampleSize: rows.length,
      };

    case "missing_count": {
      let missing = 0;
      for (const row of rows) {
        const val = row[fieldName];
        if (val === null || val === undefined || (typeof val === "string" && val.trim() === "")) {
          missing++;
        }
      }
      return {
        value: missing,
        formula: `MISSING_COUNT(${fieldName})`,
        sampleSize: rows.length,
      };
    }

    case "distinct_count": {
      const distinct = new Set<string>();
      for (const row of rows) {
        const val = row[fieldName];
        if (val !== null && val !== undefined) {
          distinct.add(String(val).trim().toLowerCase());
        }
      }
      return {
        value: distinct.size,
        formula: `DISTINCT_COUNT(${fieldName})`,
        sampleSize: rows.length,
      };
    }

    case "sum": {
      const nums = extractNumericValues(rows, fieldName);
      if (nums.length === 0) return { value: null, formula: `SUM(${fieldName})`, sampleSize: 0 };
      const sum = nums.reduce((acc, v) => acc + v, 0);
      return {
        value: Math.round(sum * 100) / 100,
        formula: `SUM(${fieldName})`,
        sampleSize: nums.length,
      };
    }

    case "average": {
      const nums = extractNumericValues(rows, fieldName);
      if (nums.length === 0) return { value: null, formula: `AVG(${fieldName})`, sampleSize: 0 };
      const sum = nums.reduce((acc, v) => acc + v, 0);
      const avg = safeDivide(sum, nums.length);
      return {
        value: avg !== null ? Math.round(avg * 100) / 100 : null,
        formula: `AVG(${fieldName})`,
        sampleSize: nums.length,
      };
    }

    case "min": {
      const nums = extractNumericValues(rows, fieldName);
      if (nums.length === 0) return { value: null, formula: `MIN(${fieldName})`, sampleSize: 0 };
      return {
        value: Math.min(...nums),
        formula: `MIN(${fieldName})`,
        sampleSize: nums.length,
      };
    }

    case "max": {
      const nums = extractNumericValues(rows, fieldName);
      if (nums.length === 0) return { value: null, formula: `MAX(${fieldName})`, sampleSize: 0 };
      return {
        value: Math.max(...nums),
        formula: `MAX(${fieldName})`,
        sampleSize: nums.length,
      };
    }

    case "median": {
      const nums = extractNumericValues(rows, fieldName);
      if (nums.length === 0) return { value: null, formula: `MEDIAN(${fieldName})`, sampleSize: 0 };
      nums.sort((a, b) => a - b);
      const mid = Math.floor(nums.length / 2);
      const median =
        nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      return {
        value: Math.round(median * 100) / 100,
        formula: `MEDIAN(${fieldName})`,
        sampleSize: nums.length,
      };
    }

    default:
      return { value: null, formula: `UNKNOWN(${fieldName})`, sampleSize: 0 };
  }
}
