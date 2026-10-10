"use client";

import React, { useState } from "react";
import { FieldMetadata } from "@/domain/dataset/types";
import { WidgetDefinition } from "@/domain/report/schema";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { AggregationType } from "@/domain/metrics/aggregations";
import { ChartType } from "@/domain/recommendations/chart-recommender";

interface WidgetInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: WidgetDefinition | null; // null means adding a new widget
  fields: FieldMetadata[];
  onSaveWidget: (updatedWidget: WidgetDefinition) => void;
}

interface WidgetInspectorFormProps {
  widget: WidgetDefinition | null;
  fields: FieldMetadata[];
  onClose: () => void;
  onSaveWidget: (updatedWidget: WidgetDefinition) => void;
}

function WidgetInspectorForm({
  widget,
  fields,
  onClose,
  onSaveWidget,
}: WidgetInspectorFormProps) {
  const defaultMeasure =
    fields.find((f) => f.role === "measure" || f.userType === "number")?.name ||
    fields[0]?.name ||
    "";
  const defaultDimension =
    fields.find((f) => f.role === "dimension" || f.userType === "categorical")?.name ||
    fields[0]?.name ||
    "";

  const [title, setTitle] = useState(widget?.title ?? "Custom Chart");
  const [subtitle, setSubtitle] = useState(widget?.subtitle ?? "");
  const [type, setType] = useState<ChartType>(widget?.type ?? "bar");
  const [dimensionField, setDimensionField] = useState(widget?.dimensionField ?? defaultDimension);
  const [measureField, setMeasureField] = useState(widget?.measureField ?? defaultMeasure);
  const [secondaryMeasureField, setSecondaryMeasureField] = useState(widget?.secondaryMeasureField ?? "");
  const [aggregation, setAggregation] = useState<AggregationType>(widget?.aggregation ?? "sum");
  const [topN, setTopN] = useState<number | undefined>(widget?.topN ?? 10);
  const [gridSpan, setGridSpan] = useState<"full" | "half" | "quarter">(widget?.gridSpan ?? "half");

  const handleSave = () => {
    const updated: WidgetDefinition = {
      id: widget?.id || `widget_custom_${Date.now()}`,
      title: title.trim() || "Untitled Widget",
      subtitle: subtitle.trim() || undefined,
      type,
      dimensionField: dimensionField || undefined,
      measureField: measureField || undefined,
      secondaryMeasureField: type === "scatter" ? secondaryMeasureField || undefined : undefined,
      aggregation,
      topN: type === "kpi" ? undefined : topN,
      gridSpan,
      whyThisChart: widget?.whyThisChart || "Custom user configured widget specification.",
    };

    onSaveWidget(updated);
    onClose();
  };

  const measureFields = fields.filter(
    (f) => f.role === "measure" || f.userType === "number" || f.userType === "integer"
  );

  return (
    <div className="space-y-4 text-xs">
      {/* Title & Subtitle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Widget Title:
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Revenue by Region"
            className="text-xs"
          />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Subtitle (Optional):
          </label>
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Aggregated YTD"
            className="text-xs"
          />
        </div>
      </div>

      {/* Chart Type & Layout Width */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Visualization Type:
          </label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as ChartType)}
            className="w-full text-xs"
          >
            <option value="kpi">Executive KPI Card</option>
            <option value="bar">Vertical Bar / Column Chart</option>
            <option value="horizontal_bar">Horizontal Bar / Leaderboard</option>
            <option value="line">Line Trend Chart</option>
            <option value="area">Area Trend Chart</option>
            <option value="donut">Donut Composition Chart</option>
            <option value="pie">Classic Pie Chart</option>
            <option value="waterfall">Waterfall Variance Bridge Chart</option>
            <option value="gauge">Radial Metric Gauge (0-100%)</option>
            <option value="funnel">Conversion Funnel Chart</option>
            <option value="scatter">Scatter Plot (Correlation)</option>
            <option value="table">Executive Data Table Grid</option>
            <option value="slicer">Interactive Dimension Slicer</option>
          </Select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Grid Width (Span):
          </label>
          <Select
            value={gridSpan}
            onChange={(e) => setGridSpan(e.target.value as "full" | "half" | "quarter")}
            className="w-full text-xs"
          >
            <option value="quarter">Quarter Width (25% - best for KPIs)</option>
            <option value="half">Half Width (50% - standard chart)</option>
            <option value="full">Full Width (100% - time trends)</option>
          </Select>
        </div>
      </div>

      {/* Fields Configuration */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
        <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
          Data Binding
        </p>

        {/* Dimension Field (for charts with categories/dates, and slicers) */}
        {type !== "kpi" && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {type === "slicer" ? "Filter Dimension (Category Column to Slice):" : "Dimension (Category / Date):"}
            </label>
            <Select
              value={dimensionField}
              onChange={(e) => {
                setDimensionField(e.target.value);
                if (type === "slicer" && (title === "Custom Chart" || title.startsWith("Filter by "))) {
                  setTitle(`Filter by ${e.target.value}`);
                }
              }}
              className="w-full text-xs"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.userType})
                </option>
              ))}
            </Select>
            {type === "slicer" && (
              <p className="text-[11px] text-slate-500 mt-1">
                Generates interactive 1-click filter pills for each unique value in this column.
              </p>
            )}
          </div>
        )}

        {/* Primary Measure Field (not needed for Slicers) */}
        {type !== "slicer" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Measure (Metric):
              </label>
              <Select
                value={measureField}
                onChange={(e) => setMeasureField(e.target.value)}
                className="w-full text-xs"
              >
                {measureFields.map((f) => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.userType})
                  </option>
                ))}
                {/* Fallback to all fields if none detected as measure */}
                {measureFields.length === 0 &&
                  fields.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
              </Select>
            </div>

            {/* Aggregation Function */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Aggregation:
              </label>
              <Select
                value={aggregation}
                onChange={(e) => setAggregation(e.target.value as AggregationType)}
                className="w-full text-xs"
              >
                <option value="sum">SUM</option>
                <option value="average">AVERAGE</option>
                <option value="count">COUNT (Rows)</option>
                <option value="distinct_count">DISTINCT COUNT</option>
                <option value="min">MINIMUM</option>
                <option value="max">MAXIMUM</option>
                <option value="median">MEDIAN</option>
              </Select>
            </div>
          </div>
        )}

        {/* Secondary Measure Field (only for Scatter) */}
        {type === "scatter" && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Secondary Measure (Y-Axis):
            </label>
            <Select
              value={secondaryMeasureField}
              onChange={(e) => setSecondaryMeasureField(e.target.value)}
              className="w-full text-xs"
            >
              {measureFields.map((f) => (
                <option key={f.id} value={f.name}>
                  {f.name} ({f.userType})
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Top-N Filter */}
        {type !== "kpi" && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Top-N Ranking Limit:
            </label>
            <Select
              value={topN !== undefined ? String(topN) : "all"}
              onChange={(e) =>
                setTopN(e.target.value === "all" ? undefined : Number(e.target.value))
              }
              className="w-full text-xs"
            >
              <option value="5">Top 5 items + Other</option>
              <option value="10">Top 10 items + Other</option>
              <option value="15">Top 15 items + Other</option>
              <option value="all">All items (No limit)</option>
            </Select>
          </div>
        )}
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export function WidgetInspectorModal({
  isOpen,
  onClose,
  widget,
  fields,
  onSaveWidget,
}: WidgetInspectorModalProps) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={widget ? `Edit Widget: ${widget.title}` : "Add Custom Dashboard Widget"}
      description="Configure visualization parameters, fields, and aggregations"
      maxWidth="md"
    >
      <WidgetInspectorForm
        key={widget?.id || "new_widget"}
        widget={widget}
        fields={fields}
        onClose={onClose}
        onSaveWidget={onSaveWidget}
      />
    </Modal>
  );
}
