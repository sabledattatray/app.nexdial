"use client";

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useECharts } from "./useECharts";
import { ChartWidgetSpec } from "@/domain/recommendations/chart-recommender";
import { RowData } from "@/domain/dataset/types";
import {
  HelpCircle,
  Table as TableIcon,
  BarChart2,
  TrendingUp,
  PieChart,
  Activity,
  Layers,
  Edit2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import * as echarts from "echarts";

interface WidgetCardProps {
  spec: ChartWidgetSpec;
  rows: RowData[];
  onEdit?: (spec: ChartWidgetSpec) => void;
  onDuplicate?: (spec: ChartWidgetSpec) => void;
  onDelete?: (widgetId: string) => void;
  onMoveUp?: (widgetId: string) => void;
  onMoveDown?: (widgetId: string) => void;
}

export function WidgetCard({
  spec,
  rows,
  onEdit,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: WidgetCardProps) {
  const [showTable, setShowTable] = useState(false);
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 1. Process Chart Data from Rows
  const processedData = useMemo(() => {
    if (spec.type === "kpi") {
      let sum = 0;
      let count = 0;
      for (const r of rows) {
        const val = Number(r[spec.measureField || ""]);
        if (!isNaN(val)) {
          sum += val;
          count++;
        }
      }
      return {
        kpiValue: spec.aggregation === "count" ? rows.length : sum,
        count,
      };
    }

    if (spec.type === "bar" || spec.type === "donut") {
      const dim = spec.dimensionField || "";
      const meas = spec.measureField || "";
      const groupSums = new Map<string, number>();

      for (const r of rows) {
        const key = String(r[dim] ?? "Unassigned").trim();
        const val = Number(r[meas] || 0);
        if (!isNaN(val)) {
          groupSums.set(key, (groupSums.get(key) || 0) + val);
        }
      }

      let entries = Array.from(groupSums.entries()).sort((a, b) => b[1] - a[1]);
      if (spec.topN && entries.length > spec.topN) {
        const top = entries.slice(0, spec.topN);
        const otherSum = entries.slice(spec.topN).reduce((acc, v) => acc + v[1], 0);
        top.push(["Other", otherSum]);
        entries = top;
      }

      return {
        categories: entries.map((e) => e[0]),
        values: entries.map((e) => Math.round(e[1] * 100) / 100),
      };
    }

    if (spec.type === "line" || spec.type === "area") {
      const dateDim = spec.dimensionField || "";
      const meas = spec.measureField || "";
      const timeSums = new Map<string, number>();

      for (const r of rows) {
        const dateKey = String(r[dateDim] ?? "").trim();
        const val = Number(r[meas] || 0);
        if (dateKey && !isNaN(val)) {
          timeSums.set(dateKey, (timeSums.get(dateKey) || 0) + val);
        }
      }

      // Sort dates chronologically
      const entries = Array.from(timeSums.entries()).sort((a, b) =>
        a[0].localeCompare(b[0])
      );

      return {
        categories: entries.map((e) => e[0]),
        values: entries.map((e) => Math.round(e[1] * 100) / 100),
      };
    }

    if (spec.type === "scatter") {
      const m1 = spec.measureField || "";
      const m2 = spec.secondaryMeasureField || "";
      const points: [number, number][] = [];

      for (const r of rows) {
        const v1 = Number(r[m1]);
        const v2 = Number(r[m2]);
        if (!isNaN(v1) && !isNaN(v2)) {
          points.push([v1, v2]);
        }
      }

      return {
        scatterPoints: points.slice(0, 500), // Cap at 500 for snappy rendering
      };
    }

    return null;
  }, [spec, rows]);

  // 2. Build ECharts Options Object
  const echartsOptions = useMemo<echarts.EChartsOption>(() => {
    const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
    const textColor = isDark ? "#94a3b8" : "#475569";
    const gridLineColor = isDark ? "#1e293b" : "#f1f5f9";

    if (spec.type === "bar") {
      const data = processedData as { categories: string[]; values: number[] } | null;
      return {
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        grid: { top: 20, right: 20, bottom: 40, left: 60 },
        xAxis: {
          type: "category",
          data: data?.categories || [],
          axisLabel: { color: textColor, fontSize: 11, rotate: 20 },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textColor, fontSize: 11 },
        },
        series: [
          {
            data: data?.values || [],
            type: "bar",
            itemStyle: { color: "#6366f1", borderRadius: [4, 4, 0, 0] },
          },
        ],
      };
    }

    if (spec.type === "line" || spec.type === "area") {
      const data = processedData as { categories: string[]; values: number[] } | null;
      return {
        backgroundColor: "transparent",
        tooltip: { trigger: "axis" },
        grid: { top: 20, right: 20, bottom: 40, left: 60 },
        xAxis: {
          type: "category",
          data: data?.categories || [],
          axisLabel: { color: textColor, fontSize: 11 },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textColor, fontSize: 11 },
        },
        series: [
          {
            data: data?.values || [],
            type: "line",
            smooth: true,
            areaStyle: spec.type === "area" ? { opacity: 0.25, color: "#6366f1" } : undefined,
            lineStyle: { color: "#4f46e5", width: 2.5 },
            itemStyle: { color: "#4f46e5" },
          },
        ],
      };
    }

    if (spec.type === "donut") {
      const data = processedData as { categories: string[]; values: number[] } | null;
      const pieData = (data?.categories || []).map((cat, idx) => ({
        name: cat,
        value: data?.values[idx] || 0,
      }));

      return {
        backgroundColor: "transparent",
        tooltip: { trigger: "item" },
        legend: { bottom: 0, textStyle: { color: textColor, fontSize: 11 } },
        series: [
          {
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 6, borderColor: isDark ? "#0f172a" : "#fff", borderWidth: 2 },
            label: { show: false },
            data: pieData,
          },
        ],
      };
    }

    if (spec.type === "scatter") {
      const data = processedData as { scatterPoints: [number, number][] } | null;
      return {
        backgroundColor: "transparent",
        tooltip: { trigger: "item" },
        grid: { top: 20, right: 20, bottom: 40, left: 60 },
        xAxis: {
          type: "value",
          splitLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textColor, fontSize: 11 },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: gridLineColor } },
          axisLabel: { color: textColor, fontSize: 11 },
        },
        series: [
          {
            type: "scatter",
            symbolSize: 8,
            data: data?.scatterPoints || [],
            itemStyle: { color: "#818cf8" },
          },
        ],
      };
    }

    return {};
  }, [spec, processedData]);

  const { containerRef } = useECharts({ options: echartsOptions });

  const getWidgetIcon = () => {
    switch (spec.type) {
      case "bar":
        return <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case "line":
      case "area":
        return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "donut":
        return <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case "scatter":
        return <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  // If KPI Widget
  if (spec.type === "kpi") {
    const kpi = processedData as { kpiValue: number; count: number } | null;
    return (
      <Card className="p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all break-inside-avoid print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate max-w-[180px] print:text-slate-700">
            {spec.title}
          </p>
          <div className="flex items-center gap-1 print:hidden">
            <button
              onClick={() => setWhyModalOpen(true)}
              className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
              title="Formula definition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            {onEdit && (
              <button
                onClick={() => onEdit(spec)}
                className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
                title="Edit KPI"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(spec)}
                className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
                title="Duplicate KPI"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                title="Delete KPI"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="py-2">
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight font-mono">
            {kpi?.kpiValue !== null && kpi?.kpiValue !== undefined
              ? kpi.kpiValue.toLocaleString()
              : "0"}
          </p>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 mt-1">
          <span>{spec.aggregation.toUpperCase()}({spec.measureField})</span>
          <span>{rows.length.toLocaleString()} rows</span>
        </div>

        {/* Modal for calculation formula */}
        <Modal
          isOpen={whyModalOpen}
          onClose={() => setWhyModalOpen(false)}
          title={spec.title}
          description="Mathematical Formula & Definition"
          maxWidth="sm"
        >
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p><strong>Aggregation:</strong> {spec.aggregation.toUpperCase()}</p>
            <p><strong>Field:</strong> {spec.measureField}</p>
            <p><strong>Calculated Value:</strong> {kpi?.kpiValue?.toLocaleString()}</p>
            <p><strong>Evidence:</strong> {spec.whyThisChart}</p>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete KPI Card"
          description="Are you sure you want to remove this widget from your dashboard?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Removing &ldquo;{spec.title}&rdquo; will delete it from this view. You can re-add it anytime from the Add Widget button.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setDeleteModalOpen(false);
                  onDelete?.(spec.id);
                }}
              >
                Delete Widget
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    );
  }

  // Regular Chart Widget (Bar, Line, Donut, Scatter)
  const chartData = processedData as { categories?: string[]; values?: number[]; scatterPoints?: [number, number][] } | null;

  return (
    <Card className="flex flex-col justify-between overflow-hidden shadow-2xs break-inside-avoid print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white">
      <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 print:border print:border-slate-200">
            {getWidgetIcon()}
          </div>
          <div>
            <CardTitle className="text-sm font-semibold print:text-slate-900">{spec.title}</CardTitle>
            {spec.subtitle && (
              <CardDescription className="text-[11px] print:text-slate-500">{spec.subtitle}</CardDescription>
            )}
          </div>
        </div>

        {/* Controls: Why this chart + Data Table toggle + Inspector actions */}
        <div className="flex items-center gap-1 print:hidden">
          {spec.topN && (
            <Badge variant="outline" className="text-[10px] hidden sm:inline-flex mr-1">
              Top {spec.topN}
            </Badge>
          )}

          {onMoveUp && (
            <button
              onClick={() => onMoveUp(spec.id)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              title="Move Earlier"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}

          {onMoveDown && (
            <button
              onClick={() => onMoveDown(spec.id)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              title="Move Later"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(spec)}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Edit Widget"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDuplicate && (
            <button
              onClick={() => onDuplicate(spec)}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Duplicate Widget"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              title="Delete Widget"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setWhyModalOpen(true)}
            className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            title="Why this chart?"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTable(!showTable)}
            className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-0.5"
            title={showTable ? "Switch to Chart View" : "Switch to Table Alternative"}
          >
            {showTable ? <BarChart2 className="w-3.5 h-3.5" /> : <TableIcon className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col justify-center min-h-[300px]">
        {showTable ? (
          /* Accessible Data Table Fallback (PRD Section 7.5) */
          <div className="overflow-x-auto max-h-[280px] overflow-y-auto text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="p-2">{spec.dimensionField || "Index"}</th>
                  <th className="p-2 text-right">{spec.measureField || "Value"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {chartData?.categories?.map((cat, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2 text-slate-800 dark:text-slate-200">{cat}</td>
                    <td className="p-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {chartData.values?.[idx]?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* ECharts Canvas Visual */
          <div ref={containerRef} className="w-full h-[280px]" />
        )}
      </CardContent>

      {/* "Why this chart?" Modal */}
      <Modal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        title="Why this chart was selected"
        description="Transparent rule-based recommendation logic (PRD Section 7.5)"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200">
              Recommendation Rationale:
            </p>
            <p className="mt-1">{spec.whyThisChart}</p>
          </div>

          <div className="space-y-1.5 font-mono">
            <p><strong>Chart Type:</strong> {spec.type.toUpperCase()}</p>
            <p><strong>Dimension:</strong> {spec.dimensionField || "None"}</p>
            <p><strong>Measure:</strong> {spec.measureField || "None"}</p>
            <p><strong>Aggregation:</strong> {spec.aggregation.toUpperCase()}</p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Chart Widget"
        description="Are you sure you want to remove this chart from your dashboard?"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Removing &ldquo;{spec.title}&rdquo; will delete it from this view. You can re-add it anytime from the Add Widget button.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDeleteModalOpen(false);
                onDelete?.(spec.id);
              }}
            >
              Delete Widget
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
