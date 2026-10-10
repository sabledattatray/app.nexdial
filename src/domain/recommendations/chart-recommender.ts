/**
 * OpenMIS Chart Recommender & Specification Builder
 *
 * Implements PRD Section 7.5:
 * Rule-based chart recommendations based on field data types, cardinality, and roles.
 */

import { FieldMetadata, RowData } from "../dataset/types";
import { AggregationType } from "../metrics/aggregations";

export type ChartType =
  | "kpi"
  | "bar"
  | "line"
  | "area"
  | "donut"
  | "scatter"
  | "table";

export interface ChartWidgetSpec {
  id: string;
  type: ChartType;
  title: string;
  subtitle?: string;
  dimensionField?: string;
  measureField?: string;
  secondaryMeasureField?: string;
  aggregation: AggregationType;
  topN?: number;
  whyThisChart?: string;
  gridSpan: "full" | "half" | "quarter";
}

export function recommendDashboardWidgets(
  fields: FieldMetadata[],
  rows?: RowData[]
): ChartWidgetSpec[] {
  const widgets: ChartWidgetSpec[] = [];

  const dateFields = fields.filter((f) => f.role === "time_dimension" || f.userType === "date");
  const measureFields = fields.filter((f) => f.role === "measure" || f.userType === "number" || f.userType === "integer");
  const categoricalFields = fields.filter((f) => f.role === "dimension" || f.userType === "categorical");

  // 1. Executive KPI Cards (Top 3-4 measures or row counts)
  if (measureFields.length > 0) {
    measureFields.slice(0, 3).forEach((m, idx) => {
      widgets.push({
        id: `widget_kpi_${m.id}_${idx}`,
        type: "kpi",
        title: `Total ${m.name}`,
        measureField: m.name,
        aggregation: "sum",
        whyThisChart: `Displays executive total sum of the primary numeric measure "${m.name}".`,
        gridSpan: "quarter",
      });
    });
  }

  // Row Count KPI
  const sampleCount = rows && rows.length > 0 ? rows.length : null;
  widgets.push({
    id: `widget_kpi_rows`,
    type: "kpi",
    title: "Total Records",
    measureField: fields[0]?.name || "id",
    aggregation: "count",
    whyThisChart: sampleCount
      ? `Tracks total transaction volume across all ${sampleCount.toLocaleString()} recorded rows.`
      : "Tracks total transaction volume across all recorded rows.",
    gridSpan: "quarter",
  });

  // 2. Time-Series Trend (Date + Measure)
  if (dateFields.length > 0 && measureFields.length > 0) {
    const dateField = dateFields[0];
    const measureField = measureFields[0];

    widgets.push({
      id: `widget_timeseries_${dateField.id}_${measureField.id}`,
      type: "area",
      title: `${measureField.name} Trend Over Time`,
      subtitle: `Aggregated by ${dateField.name}`,
      dimensionField: dateField.name,
      measureField: measureField.name,
      aggregation: "sum",
      whyThisChart: `Time-series visualization maps "${measureField.name}" against date field "${dateField.name}" to highlight seasonal trends and growth.`,
      gridSpan: "full",
    });
  }

  // 3. Category Comparison Bar Chart
  if (categoricalFields.length > 0 && measureFields.length > 0) {
    const catField = categoricalFields[0];
    const measureField = measureFields[0];

    widgets.push({
      id: `widget_bar_${catField.id}_${measureField.id}`,
      type: "bar",
      title: `${measureField.name} by ${catField.name}`,
      dimensionField: catField.name,
      measureField: measureField.name,
      aggregation: "sum",
      topN: 10,
      whyThisChart: `Bar chart compares "${measureField.name}" across categories in "${catField.name}", ranked by descending volume.`,
      gridSpan: "half",
    });
  }

  // 4. Composition Donut Chart (for low cardinality category <= 6)
  const lowCardField = categoricalFields.find(
    (f) => f.distinctCount >= 2 && f.distinctCount <= 6
  ) || categoricalFields[1];

  if (lowCardField && measureFields.length > 0) {
    const measureField = measureFields[0];
    widgets.push({
      id: `widget_donut_${lowCardField.id}`,
      type: "donut",
      title: `${lowCardField.name} Distribution`,
      dimensionField: lowCardField.name,
      measureField: measureField.name,
      aggregation: "sum",
      topN: 5,
      whyThisChart: `Donut chart displays proportional share of "${measureField.name}" across categories with few distinct segments.`,
      gridSpan: "half",
    });
  }

  // 5. Relationship / Correlation Scatter Plot (2 Measures)
  if (measureFields.length >= 2) {
    const m1 = measureFields[0];
    const m2 = measureFields[1];

    widgets.push({
      id: `widget_scatter_${m1.id}_${m2.id}`,
      type: "scatter",
      title: `Correlation: ${m1.name} vs ${m2.name}`,
      measureField: m1.name,
      secondaryMeasureField: m2.name,
      aggregation: "sum",
      whyThisChart: `Scatter plot maps two continuous numeric measures ("${m1.name}" vs "${m2.name}") to evaluate statistical correlation.`,
      gridSpan: "half",
    });
  }

  return widgets;
}
