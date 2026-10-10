/**
 * OpenMIS Deterministic Insights Engine
 *
 * Implements PRD Section 7.7:
 * Mathematically derived, explainable business insights.
 * Zero external AI required; 100% computed evidence with traceable formulas.
 */

import { RowData, FieldMetadata } from "../dataset/types";
import { extractNumericValues } from "../metrics/aggregations";

export interface EvidenceInsight {
  id: string;
  type: "concentration" | "trend" | "outlier" | "data_quality" | "summary";
  title: string;
  description: string;
  metricName: string;
  groupName?: string;
  computedValue: string | number;
  baselineValue?: string | number;
  sampleSize: number;
  evidence: string;
  caveats?: string;
  formulaExplanation: string;
  severity?: "info" | "warning" | "positive";
}

export function generateDeterministicInsights(
  rows: RowData[],
  fields: FieldMetadata[]
): EvidenceInsight[] {
  const insights: EvidenceInsight[] = [];
  if (rows.length < 3) return insights;

  const measureFields = fields.filter((f) => f.role === "measure" || f.userType === "number" || f.userType === "integer");
  const dimensionFields = fields.filter((f) => f.role === "dimension" || f.userType === "categorical");

  // 1. Dominant Category Concentration Insight
  if (measureFields.length > 0 && dimensionFields.length > 0) {
    const measure = measureFields[0];
    const dimension = dimensionFields[0];

    const categorySums = new Map<string, number>();
    let totalSum = 0;

    for (const row of rows) {
      const cat = String(row[dimension.name] ?? "Unknown").trim();
      const val = Number(row[measure.name]);
      if (!isNaN(val) && isFinite(val)) {
        categorySums.set(cat, (categorySums.get(cat) || 0) + val);
        totalSum += val;
      }
    }

    if (totalSum > 0 && categorySums.size >= 2) {
      const sorted = Array.from(categorySums.entries()).sort((a, b) => b[1] - a[1]);
      const top1 = sorted[0];
      const top1Share = (top1[1] / totalSum) * 100;

      if (top1Share >= 40) {
        insights.push({
          id: `insight_concentration_${dimension.id}`,
          type: "concentration",
          title: `High Concentration in "${top1[0]}"`,
          description: `The top category "${top1[0]}" represents ${top1Share.toFixed(1)}% of total ${measure.name}.`,
          metricName: measure.name,
          groupName: top1[0],
          computedValue: `${top1Share.toFixed(1)}%`,
          baselineValue: `Total: ${Math.round(totalSum).toLocaleString()}`,
          sampleSize: rows.length,
          evidence: `"${top1[0]}" accounted for ${Math.round(top1[1]).toLocaleString()} out of ${Math.round(totalSum).toLocaleString()} total ${measure.name} across ${categorySums.size} categories.`,
          formulaExplanation: "Category Share = (Top Category Sum / Total Sum) * 100",
          severity: top1Share >= 65 ? "warning" : "info",
        });
      }
    }
  }

  // 2. Statistical Outliers via Interquartile Range (IQR) (PRD 7.7)
  for (const measure of measureFields.slice(0, 2)) {
    const values = extractNumericValues(rows, measure.name);
    if (values.length >= 8) {
      values.sort((a, b) => a - b);
      const q1Index = Math.floor(values.length * 0.25);
      const q3Index = Math.floor(values.length * 0.75);
      const q1 = values[q1Index];
      const q3 = values[q3Index];
      const iqr = q3 - q1;

      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      const outliers = values.filter((v) => v < lowerBound || v > upperBound);
      if (outliers.length > 0) {
        const outlierPct = (outliers.length / values.length) * 100;
        insights.push({
          id: `insight_outliers_${measure.id}`,
          type: "outlier",
          title: `Statistical Outliers in ${measure.name}`,
          description: `Detected ${outliers.length} data points outside the normal distribution [${lowerBound.toFixed(0)}, ${upperBound.toFixed(0)}].`,
          metricName: measure.name,
          computedValue: `${outliers.length} outliers`,
          baselineValue: `IQR: ${iqr.toFixed(0)}`,
          sampleSize: values.length,
          evidence: `Using the Tukey IQR method (Q1: ${q1}, Q3: ${q3}, IQR: ${iqr}), values outside [Q1 - 1.5*IQR, Q3 + 1.5*IQR] were flagged.`,
          caveats: "Outliers represent extreme values in your spreadsheet, not necessarily errors.",
          formulaExplanation: "Outlier Range = [Q1 - 1.5*(Q3-Q1), Q3 + 1.5*(Q3-Q1)]",
          severity: outlierPct >= 5 ? "warning" : "info",
        });
      }
    }
  }

  // 3. Data Quality & Null Warning Insights (PRD 7.2 & 7.7)
  for (const field of fields) {
    if (field.missingPercentage >= 25) {
      insights.push({
        id: `insight_quality_${field.id}`,
        type: "data_quality",
        title: `Sparse Column: ${field.name}`,
        description: `${field.missingPercentage.toFixed(1)}% of rows have null or empty values for "${field.name}".`,
        metricName: field.name,
        computedValue: `${field.missingPercentage.toFixed(1)}% missing`,
        sampleSize: rows.length,
        evidence: `${field.nullCount + field.emptyStringCount} rows out of ${rows.length} are empty.`,
        caveats: "Aggregations involving this column will exclude null records.",
        formulaExplanation: "Missing % = ((Null Count + Empty String Count) / Total Rows) * 100",
        severity: "warning",
      });
    }
  }

  return insights;
}
