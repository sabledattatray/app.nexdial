/**
 * OpenMIS Report Definition Schema & Serializer
 *
 * Implements PRD Section 7.8, 10, 11:
 * Versioned schema (v1.0.0) with Zod validation.
 * Protects against malformed or injected report configurations.
 */

import { z } from "zod";

export const AggregationTypeSchema = z.enum([
  "sum",
  "average",
  "count",
  "distinct_count",
  "min",
  "max",
  "median",
  "missing_count",
]);

export const ChartTypeSchema = z.enum([
  "kpi",
  "bar",
  "line",
  "area",
  "donut",
  "scatter",
  "table",
]);

export const GridSpanSchema = z.enum(["full", "half", "quarter"]);

export const WidgetDefinitionSchema = z.object({
  id: z.string().min(1),
  type: ChartTypeSchema,
  title: z.string().min(1).max(120),
  subtitle: z.string().max(200).optional(),
  dimensionField: z.string().optional(),
  measureField: z.string().optional(),
  secondaryMeasureField: z.string().optional(),
  aggregation: AggregationTypeSchema.default("sum"),
  topN: z.number().int().positive().max(100).optional(),
  whyThisChart: z.string().optional(),
  gridSpan: GridSpanSchema.default("half"),
});

export type WidgetDefinition = z.infer<typeof WidgetDefinitionSchema>;

export const FilterOperatorSchema = z.enum([
  "in",
  "between",
  "gte",
  "lte",
  "equals",
]);

export const ReportFilterSchema = z.object({
  id: z.string().min(1),
  fieldId: z.string().min(1),
  fieldName: z.string().min(1),
  type: z.enum(["categorical", "date_range", "numeric_range"]),
  operator: FilterOperatorSchema,
  values: z.array(z.union([z.string(), z.number()])),
});

export type ReportFilter = z.infer<typeof ReportFilterSchema>;

export const ReportDefinitionSchema = z.object({
  version: z.literal("1.0.0"),
  id: z.string().min(1),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  datasetId: z.string().min(1),
  datasetName: z.string().min(1),
  widgets: z.array(WidgetDefinitionSchema),
  filters: z.array(ReportFilterSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ReportDefinition = z.infer<typeof ReportDefinitionSchema>;

/**
 * Validates and parses raw JSON or object into a typed ReportDefinition
 */
export function parseReportDefinition(data: unknown): {
  success: boolean;
  data?: ReportDefinition;
  error?: string;
} {
  const result = ReportDefinitionSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const errorMessages = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    return { success: false, error: errorMessages };
  }
}

/**
 * Validates and parses a JSON string
 */
export function validateReportJson(jsonString: string): {
  success: boolean;
  data?: ReportDefinition;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    return parseReportDefinition(parsed);
  } catch (err) {
    return {
      success: false,
      error: `Invalid JSON syntax: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/**
 * Serializes a report definition into a formatted JSON string
 */
export function serializeReportDefinition(report: ReportDefinition): string {
  return JSON.stringify(report, null, 2);
}
