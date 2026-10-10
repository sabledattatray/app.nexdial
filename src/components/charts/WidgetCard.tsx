"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useECharts } from "./useECharts";
import { ChartWidgetSpec } from "@/domain/recommendations/chart-recommender";
import { RowData } from "@/domain/dataset/types";
import { TemplateColorTheme } from "@/lib/templates/template-registry";
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

export interface ThemePalette {
  primary: string;
  secondary: string;
  accent: string;
  donutPalette: string[];
  gradientTop: string;
  gradientBottom: string;
  line: string;
  area: string;
  kpiText: string;
  kpiBorder: string;
  kpiBg: string;
}

export const THEME_PALETTES: Record<TemplateColorTheme, ThemePalette> = {
  indigo: {
    primary: "#6366f1",
    secondary: "#4f46e5",
    accent: "#818cf8",
    donutPalette: ["#6366f1", "#4f46e5", "#818cf8", "#38bdf8", "#a855f7", "#ec4899", "#10b981", "#f59e0b"],
    gradientTop: "#818cf8",
    gradientBottom: "#4338ca",
    line: "#4f46e5",
    area: "#6366f1",
    kpiText: "text-indigo-600 dark:text-indigo-400",
    kpiBorder: "border-indigo-200 dark:border-indigo-900/60",
    kpiBg: "bg-indigo-50/20 dark:bg-indigo-950/20",
  },
  emerald: {
    primary: "#10b981",
    secondary: "#059669",
    accent: "#34d399",
    donutPalette: ["#10b981", "#059669", "#34d399", "#14b8a6", "#2dd4bf", "#0d9488", "#3b82f6", "#6366f1"],
    gradientTop: "#34d399",
    gradientBottom: "#047857",
    line: "#059669",
    area: "#10b981",
    kpiText: "text-emerald-600 dark:text-emerald-400",
    kpiBorder: "border-emerald-200 dark:border-emerald-900/60",
    kpiBg: "bg-emerald-50/20 dark:bg-emerald-950/20",
  },
  blue: {
    primary: "#3b82f6",
    secondary: "#2563eb",
    accent: "#60a5fa",
    donutPalette: ["#3b82f6", "#2563eb", "#60a5fa", "#0284c7", "#38bdf8", "#0ea5e9", "#6366f1", "#14b8a6"],
    gradientTop: "#60a5fa",
    gradientBottom: "#1d4ed8",
    line: "#2563eb",
    area: "#3b82f6",
    kpiText: "text-blue-600 dark:text-blue-400",
    kpiBorder: "border-blue-200 dark:border-blue-900/60",
    kpiBg: "bg-blue-50/20 dark:bg-blue-950/20",
  },
  violet: {
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#a78bfa",
    donutPalette: ["#8b5cf6", "#7c3aed", "#a78bfa", "#d946ef", "#c084fc", "#e879f9", "#ec4899", "#6366f1"],
    gradientTop: "#a78bfa",
    gradientBottom: "#6d28d9",
    line: "#7c3aed",
    area: "#8b5cf6",
    kpiText: "text-violet-600 dark:text-violet-400",
    kpiBorder: "border-violet-200 dark:border-violet-900/60",
    kpiBg: "bg-violet-50/20 dark:bg-violet-950/20",
  },
  amber: {
    primary: "#f59e0b",
    secondary: "#d97706",
    accent: "#fbbf24",
    donutPalette: ["#f59e0b", "#d97706", "#fbbf24", "#f97316", "#ea580c", "#fb923c", "#eab308", "#10b981"],
    gradientTop: "#fbbf24",
    gradientBottom: "#b45309",
    line: "#d97706",
    area: "#f59e0b",
    kpiText: "text-amber-600 dark:text-amber-400",
    kpiBorder: "border-amber-200 dark:border-amber-900/60",
    kpiBg: "bg-amber-50/20 dark:bg-amber-950/20",
  },
  rose: {
    primary: "#f43f5e",
    secondary: "#e11d48",
    accent: "#fb7185",
    donutPalette: ["#f43f5e", "#e11d48", "#fb7185", "#ec4899", "#db2777", "#f472b6", "#a855f7", "#f97316"],
    gradientTop: "#fb7185",
    gradientBottom: "#be123c",
    line: "#e11d48",
    area: "#f43f5e",
    kpiText: "text-rose-600 dark:text-rose-400",
    kpiBorder: "border-rose-200 dark:border-rose-900/60",
    kpiBg: "bg-rose-50/20 dark:bg-rose-950/20",
  },
  cyan: {
    primary: "#06b6d4",
    secondary: "#0891b2",
    accent: "#22d3ee",
    donutPalette: ["#06b6d4", "#0891b2", "#22d3ee", "#0284c7", "#38bdf8", "#0ea5e9", "#14b8a6", "#3b82f6"],
    gradientTop: "#22d3ee",
    gradientBottom: "#0e7490",
    line: "#0891b2",
    area: "#06b6d4",
    kpiText: "text-cyan-600 dark:text-cyan-400",
    kpiBorder: "border-cyan-200 dark:border-cyan-900/60",
    kpiBg: "bg-cyan-50/20 dark:bg-cyan-950/20",
  },
  slate: {
    primary: "#64748b",
    secondary: "#475569",
    accent: "#94a3b8",
    donutPalette: ["#64748b", "#475569", "#94a3b8", "#334155", "#0ea5e9", "#6366f1", "#10b981", "#f59e0b"],
    gradientTop: "#94a3b8",
    gradientBottom: "#334155",
    line: "#475569",
    area: "#64748b",
    kpiText: "text-slate-600 dark:text-slate-400",
    kpiBorder: "border-slate-300 dark:border-slate-700",
    kpiBg: "bg-slate-50 dark:bg-slate-800/40",
  },
};

export function formatChartValue(val: number): string {
  if (val === undefined || val === null || isNaN(val)) return "";
  const abs = Math.abs(val);
  if (abs >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${(val / 1_000).toFixed(1)}k`;
  if (Number.isInteger(val)) return val.toLocaleString();
  return val.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

interface WidgetCardProps {
  spec: ChartWidgetSpec;
  rows: RowData[];
  colorTheme?: TemplateColorTheme;
  onEdit?: (spec: ChartWidgetSpec) => void;
  onDuplicate?: (spec: ChartWidgetSpec) => void;
  onDelete?: (widgetId: string) => void;
  onMoveUp?: (widgetId: string) => void;
  onMoveDown?: (widgetId: string) => void;
}

export function WidgetCard({
  spec,
  rows,
  colorTheme = "indigo",
  onEdit,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: WidgetCardProps) {
  const [showTable, setShowTable] = useState(false);
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [themeTrigger, setThemeTrigger] = useState(0);

  useEffect(() => {
    const handler = () => setThemeTrigger((v) => v + 1);
    window.addEventListener("openmis-theme-change", handler);
    return () => window.removeEventListener("openmis-theme-change", handler);
  }, []);

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
    const palette = THEME_PALETTES[colorTheme] || THEME_PALETTES.indigo;

    if (spec.type === "bar") {
      const data = processedData as { categories: string[]; values: number[] } | null;
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params: unknown) => {
            const p = (Array.isArray(params) ? params[0] : params) as { name?: string; value?: number };
            if (!p) return "";
            return `<div style="font-family:inherit;font-size:12px;padding:2px 4px;">
              <div style="font-weight:600;margin-bottom:4px;color:${isDark ? "#e2e8f0" : "#1e293b"};">${p.name || ""}</div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${palette.primary};"></span>
                <span style="font-weight:700;color:${isDark ? "#f8fafc" : "#0f172a"};">${Number(p.value || 0).toLocaleString()}</span>
              </div>
            </div>`;
          },
        },
        grid: { top: 35, right: 20, bottom: 45, left: 60, containLabel: true },
        xAxis: {
          type: "category",
          data: data?.categories || [],
          axisLabel: {
            color: textColor,
            fontSize: 11,
            rotate: (data?.categories?.length || 0) > 6 ? 25 : 0,
            interval: 0,
            overflow: "truncate",
            width: 70,
          },
          axisLine: { lineStyle: { color: isDark ? "#334155" : "#e2e8f0" } },
          axisTick: { show: false },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: gridLineColor, type: "dashed" } },
          axisLabel: {
            color: textColor,
            fontSize: 11,
            formatter: (v: number) => formatChartValue(v),
          },
        },
        series: [
          {
            data: data?.values || [],
            type: "bar",
            barMaxWidth: 44,
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: palette.gradientTop },
                  { offset: 1, color: palette.gradientBottom },
                ],
              },
            },
            label: {
              show: true,
              position: "top",
              distance: 5,
              formatter: (params: unknown) => {
                const p = params as { value?: number };
                return formatChartValue(Number(p.value || 0));
              },
              fontSize: 11,
              fontWeight: 700,
              color: isDark ? "#f1f5f9" : "#1e293b",
            },
          },
        ],
      };
    }

    if (spec.type === "line" || spec.type === "area") {
      const data = processedData as { categories: string[]; values: number[] } | null;
      const isArea = spec.type === "area";
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          formatter: (params: unknown) => {
            const p = (Array.isArray(params) ? params[0] : params) as { name?: string; value?: number };
            if (!p) return "";
            return `<div style="font-family:inherit;font-size:12px;padding:2px 4px;">
              <div style="font-weight:600;margin-bottom:4px;color:${isDark ? "#e2e8f0" : "#1e293b"};">${p.name || ""}</div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${palette.primary};"></span>
                <span style="font-weight:700;color:${isDark ? "#f8fafc" : "#0f172a"};">${Number(p.value || 0).toLocaleString()}</span>
              </div>
            </div>`;
          },
        },
        grid: { top: 35, right: 20, bottom: 45, left: 60, containLabel: true },
        xAxis: {
          type: "category",
          data: data?.categories || [],
          axisLabel: {
            color: textColor,
            fontSize: 11,
            rotate: (data?.categories?.length || 0) > 8 ? 25 : 0,
          },
          axisLine: { lineStyle: { color: isDark ? "#334155" : "#e2e8f0" } },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: gridLineColor, type: "dashed" } },
          axisLabel: {
            color: textColor,
            fontSize: 11,
            formatter: (v: number) => formatChartValue(v),
          },
        },
        series: [
          {
            data: data?.values || [],
            type: "line",
            smooth: true,
            showSymbol: true,
            symbol: "circle",
            symbolSize: 7,
            lineStyle: { color: palette.line, width: 3 },
            itemStyle: {
              color: palette.primary,
              borderColor: isDark ? "#0f172a" : "#ffffff",
              borderWidth: 2,
            },
            areaStyle: isArea
              ? {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      { offset: 0, color: `${palette.primary}66` },
                      { offset: 1, color: `${palette.primary}05` },
                    ],
                  },
                }
              : undefined,
            label: {
              show: true,
              position: "top",
              distance: 6,
              formatter: (params: unknown) => {
                const p = params as { value?: number };
                return formatChartValue(Number(p.value || 0));
              },
              fontSize: 11,
              fontWeight: 700,
              color: isDark ? "#f1f5f9" : "#1e293b",
            },
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
        color: palette.donutPalette,
        tooltip: {
          trigger: "item",
          formatter: (params: unknown) => {
            const p = params as { name?: string; value?: number; percent?: number; color?: string };
            return `<div style="font-family:inherit;font-size:12px;padding:2px 4px;">
              <div style="font-weight:600;margin-bottom:4px;color:${isDark ? "#e2e8f0" : "#1e293b"};">${p.name || ""}</div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color || palette.primary};"></span>
                <span style="font-weight:700;color:${isDark ? "#f8fafc" : "#0f172a"};">${Number(p.value || 0).toLocaleString()} (${p.percent || 0}%)</span>
              </div>
            </div>`;
          },
        },
        legend: {
          show: false, // Hidden to prevent collision with bottom slice callout labels
        },
        series: [
          {
            type: "pie",
            radius: ["36%", "58%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: true,
            minAngle: 12,
            itemStyle: {
              borderRadius: 6,
              borderColor: isDark ? "#0f172a" : "#ffffff",
              borderWidth: 2,
            },
            labelLayout: {
              hideOverlap: false,
              moveOverlap: "shiftY",
            },
            label: {
              show: true,
              position: "outside",
              formatter: (params: unknown) => {
                const p = params as { name?: string; value?: number; percent?: number };
                const rawName = p.name || "";
                const truncatedName = rawName.length > 15 ? `${rawName.slice(0, 13)}…` : rawName;
                return `${truncatedName}\n${formatChartValue(Number(p.value || 0))} (${p.percent || 0}%)`;
              },
              fontSize: 11,
              fontWeight: 600,
              color: isDark ? "#e2e8f0" : "#334155",
              lineHeight: 15,
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 12,
              smooth: true,
              lineStyle: {
                color: isDark ? "#64748b" : "#94a3b8",
                width: 1.2,
              },
            },
            data: pieData,
          },
        ],
      };
    }

    if (spec.type === "scatter") {
      const data = processedData as { scatterPoints: [number, number][] } | null;
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: (params: unknown) => {
            const p = params as { value?: [number, number] };
            const val = p.value || [0, 0];
            return `<div style="font-family:inherit;font-size:12px;padding:2px 4px;">
              <div>${spec.measureField || "X"}: <strong>${val[0]?.toLocaleString()}</strong></div>
              <div>${spec.secondaryMeasureField || "Y"}: <strong>${val[1]?.toLocaleString()}</strong></div>
            </div>`;
          },
        },
        grid: { top: 30, right: 20, bottom: 45, left: 60, containLabel: true },
        xAxis: {
          type: "value",
          name: spec.measureField,
          nameTextStyle: { color: textColor, fontSize: 10 },
          splitLine: { lineStyle: { color: gridLineColor, type: "dashed" } },
          axisLabel: { color: textColor, fontSize: 11, formatter: (v: number) => formatChartValue(v) },
        },
        yAxis: {
          type: "value",
          name: spec.secondaryMeasureField,
          nameTextStyle: { color: textColor, fontSize: 10 },
          splitLine: { lineStyle: { color: gridLineColor, type: "dashed" } },
          axisLabel: { color: textColor, fontSize: 11, formatter: (v: number) => formatChartValue(v) },
        },
        series: [
          {
            type: "scatter",
            symbolSize: 9,
            data: data?.scatterPoints || [],
            itemStyle: {
              color: palette.primary,
              opacity: 0.85,
              borderColor: isDark ? "#0f172a" : "#ffffff",
              borderWidth: 1,
            },
          },
        ],
      };
    }

    return {};
  }, [spec, processedData, colorTheme, themeTrigger]);

  const { containerRef } = useECharts({ options: echartsOptions });

  const palette = THEME_PALETTES[colorTheme] || THEME_PALETTES.indigo;

  const getWidgetIcon = () => {
    const iconStyle = { color: palette.primary };
    switch (spec.type) {
      case "bar":
        return <BarChart2 className="w-4 h-4" style={iconStyle} />;
      case "line":
      case "area":
        return <TrendingUp className="w-4 h-4" style={iconStyle} />;
      case "donut":
        return <PieChart className="w-4 h-4" style={iconStyle} />;
      case "scatter":
        return <Activity className="w-4 h-4" style={iconStyle} />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  // If KPI Widget
  if (spec.type === "kpi") {
    const kpi = processedData as { kpiValue: number; count: number } | null;
    return (
      <Card className={`p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all break-inside-avoid print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white relative overflow-hidden ${palette.kpiBorder} border`}>
        {/* Top color accent strip matching template theme */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: `linear-gradient(to right, ${palette.primary}, ${palette.accent})` }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 truncate max-w-[180px] print:text-slate-700">
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

        <div className="py-2 flex items-baseline justify-between gap-2">
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight font-mono">
            {kpi?.kpiValue !== null && kpi?.kpiValue !== undefined
              ? kpi.kpiValue.toLocaleString()
              : "0"}
          </p>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0"
            style={{ color: palette.primary, backgroundColor: `${palette.primary}18` }}
          >
            {spec.aggregation}
          </span>
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
      {/* Top subtle theme accent strip */}
      <div
        className="h-1 w-full shrink-0"
        style={{ background: `linear-gradient(to right, ${palette.primary}, ${palette.accent})` }}
      />
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
          <div ref={containerRef} className="w-full h-[300px]" />
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
