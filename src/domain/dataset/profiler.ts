/**
 * OpenMIS Data Profiler
 *
 * Implements PRD Section 7.2:
 * Computes deterministic statistics, distinct values, null/empty counts,
 * min/max/mean/median, date ranges, and dataset health warnings.
 */

import {
  FieldMetadata,
  DatasetMetadata,
  DatasetProfile,
  DataQualityWarning,
  RowData,
  ValueFrequency,
} from "./types";
import { inferFieldType } from "./inference";

export function profileDataset(
  rows: RowData[],
  rawHeaders: string[],
  metadataInput: Omit<DatasetMetadata, "rowCount" | "columnCount">
): DatasetProfile {
  const rowCount = rows.length;
  const columnCount = rawHeaders.length;

  const metadata: DatasetMetadata = {
    ...metadataInput,
    rowCount,
    columnCount,
  };

  const fields: FieldMetadata[] = [];
  const warnings: DataQualityWarning[] = [];

  // Deduplicate and sanitize headers deterministically (PRD Section 7.1)
  const headerCountMap = new Map<string, number>();
  const sanitizedHeaders = rawHeaders.map((rawHeader, idx) => {
    let clean = (rawHeader || "").trim();
    if (!clean) clean = `Column_${idx + 1}`;
    const count = headerCountMap.get(clean.toLowerCase()) || 0;
    headerCountMap.set(clean.toLowerCase(), count + 1);
    return count > 0 ? `${clean}_${count + 1}` : clean;
  });

  // Calculate duplicate rows count
  const rowFingerprints = new Set<string>();
  let duplicateRowsCount = 0;
  for (const row of rows) {
    const serialized = JSON.stringify(row);
    if (rowFingerprints.has(serialized)) {
      duplicateRowsCount++;
    } else {
      rowFingerprints.add(serialized);
    }
  }

  if (duplicateRowsCount > 0) {
    warnings.push({
      id: "dup-rows-warn",
      severity: duplicateRowsCount > rowCount * 0.1 ? "warning" : "info",
      title: "Duplicate Rows Detected",
      description: `Found ${duplicateRowsCount.toLocaleString()} exact duplicate rows (${(
        (duplicateRowsCount / Math.max(rowCount, 1)) *
        100
      ).toFixed(1)}% of dataset).`,
      recommendedAction: "Use the Clean Data tool to remove duplicate rows.",
    });
  }

  // Profile each column
  for (let colIdx = 0; colIdx < rawHeaders.length; colIdx++) {
    const rawHeader = rawHeaders[colIdx];
    const headerKey = sanitizedHeaders[colIdx];
    const fieldId = `field_${colIdx + 1}_${headerKey.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`;

    const values = rows.map((r) => r[rawHeader] ?? r[headerKey]);
    const inferred = inferFieldType(headerKey, values);

    let nullCount = 0;
    let emptyStringCount = 0;
    const frequencyMap = new Map<string, number>();
    const numericValues: number[] = [];
    const dateValues: number[] = [];

    for (const val of values) {
      if (val === null || val === undefined) {
        nullCount++;
      } else if (typeof val === "string" && val.trim() === "") {
        emptyStringCount++;
      } else {
        const strVal = String(val).trim();
        frequencyMap.set(strVal, (frequencyMap.get(strVal) || 0) + 1);

        // Numeric parsing
        if (inferred.type === "number" || inferred.type === "integer") {
          const num = Number(strVal.replace(/^[$\u20AC\u00A3\u20B9]/, "").replace(/,/g, ""));
          if (!isNaN(num) && isFinite(num)) {
            numericValues.push(num);
          }
        }

        // Date parsing
        if (inferred.type === "date") {
          const parsedTimestamp = Date.parse(strVal);
          if (!isNaN(parsedTimestamp)) {
            dateValues.push(parsedTimestamp);
          }
        }
      }
    }

    const totalMissing = nullCount + emptyStringCount;
    const missingPercentage = rowCount > 0 ? (totalMissing / rowCount) * 100 : 0;
    const distinctCount = frequencyMap.size;

    // Check missing values warning
    if (missingPercentage >= 20) {
      warnings.push({
        id: `missing-${fieldId}`,
        fieldId,
        fieldName: headerKey,
        severity: missingPercentage >= 50 ? "critical" : "warning",
        title: `High Missing Data in "${headerKey}"`,
        description: `${missingPercentage.toFixed(1)}% of values in this column are empty or null.`,
        recommendedAction: "Check if missing rows affect aggregate KPIs.",
      });
    }

    const fieldMeta: FieldMetadata = {
      id: fieldId,
      name: headerKey,
      originalName: rawHeader,
      inferredType: inferred.type,
      userType: inferred.type,
      confidence: inferred.confidence,
      role: inferred.role,
      sampleValues: values.slice(0, 5),
      nullCount,
      emptyStringCount,
      missingPercentage,
      distinctCount,
    };

    // Calculate Numeric Statistics (min, max, mean, median)
    if (numericValues.length > 0) {
      numericValues.sort((a, b) => a - b);
      const min = numericValues[0];
      const max = numericValues[numericValues.length - 1];
      const sum = numericValues.reduce((acc, v) => acc + v, 0);
      const mean = sum / numericValues.length;

      const mid = Math.floor(numericValues.length / 2);
      const median =
        numericValues.length % 2 !== 0
          ? numericValues[mid]
          : (numericValues[mid - 1] + numericValues[mid]) / 2;

      fieldMeta.min = min;
      fieldMeta.max = max;
      fieldMeta.mean = Math.round(mean * 100) / 100;
      fieldMeta.median = Math.round(median * 100) / 100;
    }

    // Calculate Date Range
    if (dateValues.length > 0) {
      dateValues.sort((a, b) => a - b);
      fieldMeta.minDate = new Date(dateValues[0]).toISOString().split("T")[0];
      fieldMeta.maxDate = new Date(dateValues[dateValues.length - 1]).toISOString().split("T")[0];
    }

    // Calculate Top 5 Values for Categorical / Text
    if (frequencyMap.size > 0) {
      const sortedFreq: ValueFrequency[] = Array.from(frequencyMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([val, count]) => ({
          value: val,
          count,
          percentage: rowCount > 0 ? Math.round((count / rowCount) * 1000) / 10 : 0,
        }));
      fieldMeta.topValues = sortedFreq;
    }

    fields.push(fieldMeta);
  }

  // Calculate Overall Dataset Health Score (0 - 100)
  let penalty = 0;
  for (const f of fields) {
    if (f.missingPercentage > 50) penalty += 15;
    else if (f.missingPercentage > 20) penalty += 5;
  }
  if (duplicateRowsCount > 0) {
    penalty += Math.min(25, (duplicateRowsCount / Math.max(rowCount, 1)) * 50);
  }
  const qualityScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  return {
    metadata,
    fields,
    duplicateRowsCount,
    qualityScore,
    warnings,
  };
}
