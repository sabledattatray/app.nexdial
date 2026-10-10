"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useECharts } from "./useECharts";
import { ChartWidgetSpec } from "@/domain/recommendations/chart-recommender";
import { RowData } from "@/domain/dataset/types";
import { ReportFilter } from "@/domain/report/schema";
import { TemplateColorTheme } from "@/lib/templates/template-registry";
import {
  HelpCircle,
  Table as TableIcon,
  BarChart2,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Layers,
  Edit2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sliders,
  Gauge,
  Filter,
  Table2,
  ArrowUpDown,
  Check,
  Search,
  X,
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

export interface WidgetCardProps {
  spec: ChartWidgetSpec;
  rows: RowData[];
  colorTheme?: TemplateColorTheme;
  activeFilters?: ReportFilter[];
  onFilterSelect?: (fieldName: string, value: string) => void;
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
  activeFilters,
  onFilterSelect,
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

  // Slicer local search state
  const [slicerSearch, setSlicerSearch] = useState("");

  // Executive Table local search and sort state
  const [tableSearch, setTableSearch] = useState("");
  const [tableSortField, setTableSortField] = useState<"label" | "value" | "count">("value");
  const [tableSortDir, setTableSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const handler = () => setThemeTrigger((v) => v + 1);
    window.addEventListener("openmis-theme-change", handler);
    return () => window.removeEventListener("openmis-theme-change", handler);
  }, []);

  // 1. Process Chart Data from Rows
  const processedData = useMemo(() => {
    // KPI
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

    // Bar, Horizontal Bar, Donut, Pie, Funnel
    if (
      spec.type === "bar" ||
      spec.type === "horizontal_bar" ||
      spec.type === "donut" ||
      spec.type === "pie" ||
      spec.type === "funnel"
    ) {
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
      const totalSum = entries.reduce((acc, v) => acc + v[1], 0);

      if (spec.topN && entries.length > spec.topN) {
        const top = entries.slice(0, spec.topN);
        const otherSum = entries.slice(spec.topN).reduce((acc, v) => acc + v[1], 0);
        if (spec.type !== "funnel") {
          top.push(["Other", otherSum]);
        }
        entries = top;
      }

      return {
        categories: entries.map((e) => e[0]),
        values: entries.map((e) => Math.round(e[1] * 100) / 100),
        totalSum,
      };
    }

    // Line and Area (Time series)
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

      const entries = Array.from(timeSums.entries()).sort((a, b) =>
        a[0].localeCompare(b[0])
      );

      return {
        categories: entries.map((e) => e[0]),
        values: entries.map((e) => Math.round(e[1] * 100) / 100),
      };
    }

    // Waterfall Bridge Chart
    if (spec.type === "waterfall") {
      const dim = spec.dimensionField || "";
      const meas = spec.measureField || "";
      const groupDeltas = new Map<string, number>();

      for (const r of rows) {
        const key = String(r[dim] ?? "General").trim();
        const val = Number(r[meas] || 0);
        if (!isNaN(val)) {
          groupDeltas.set(key, (groupDeltas.get(key) || 0) + val);
        }
      }

      let entries = Array.from(groupDeltas.entries());
      if (spec.topN && entries.length > spec.topN) {
        entries = entries.slice(0, spec.topN);
      } else if (entries.length > 8) {
        entries = entries.slice(0, 8);
      }

      const categories: string[] = [];
      const baseData: number[] = [];
      const increaseData: number[] = [];
      const decreaseData: number[] = [];
      const totalData: number[] = [];
      const cumulativeBalances: number[] = [];

      let runningBalance = 0;
      for (const [cat, val] of entries) {
        categories.push(cat);
        const prevBalance = runningBalance;
        runningBalance += val;
        cumulativeBalances.push(Math.round(runningBalance * 100) / 100);

        if (val >= 0) {
          baseData.push(Math.round(prevBalance * 100) / 100);
          increaseData.push(Math.round(val * 100) / 100);
          decreaseData.push(0);
          totalData.push(0);
        } else {
          baseData.push(Math.round(runningBalance * 100) / 100);
          increaseData.push(0);
          decreaseData.push(Math.round(Math.abs(val) * 100) / 100);
          totalData.push(0);
        }
      }

      // Net Total Anchor Bar
      categories.push("Net Total");
      baseData.push(0);
      increaseData.push(0);
      decreaseData.push(0);
      totalData.push(Math.round(runningBalance * 100) / 100);
      cumulativeBalances.push(Math.round(runningBalance * 100) / 100);

      return {
        waterfall: {
          categories,
          baseData,
          increaseData,
          decreaseData,
          totalData,
          cumulativeBalances,
        },
      };
    }

    // Radial Gauge
    if (spec.type === "gauge") {
      const meas = spec.measureField || "";
      let sum = 0;
      let count = 0;
      let maxVal = 0;

      for (const r of rows) {
        const val = Number(r[meas] || 0);
        if (!isNaN(val)) {
          sum += val;
          count++;
          if (val > maxVal) maxVal = val;
        }
      }

      const avg = count > 0 ? sum / count : 0;
      let gaugeScore = Math.round(avg * 10) / 10;
      if (gaugeScore > 100) {
        const benchmark = maxVal > 0 ? maxVal : 100;
        gaugeScore = Math.min(100, Math.round((avg / benchmark) * 100 * 10) / 10);
      }

      return {
        gauge: {
          score: Math.max(0, Math.min(100, gaugeScore)),
          rawAverage: avg,
          rawSum: sum,
          count,
        },
      };
    }

    // Scatter Plot
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
        scatterPoints: points.slice(0, 500),
      };
    }

    // Executive Data Table Grid
    if (spec.type === "table") {
      const dim = spec.dimensionField || "";
      const meas = spec.measureField || "";
      const groupMap = new Map<string, { sum: number; count: number }>();

      for (const r of rows) {
        const key = String(r[dim] ?? "Unassigned").trim();
        const val = Number(r[meas] || 0);
        const cur = groupMap.get(key) || { sum: 0, count: 0 };
        if (!isNaN(val)) {
          cur.sum += val;
        }
        cur.count += 1;
        groupMap.set(key, cur);
      }

      const items = Array.from(groupMap.entries()).map(([label, stats]) => ({
        label,
        sum: Math.round(stats.sum * 100) / 100,
        count: stats.count,
        average: stats.count > 0 ? Math.round((stats.sum / stats.count) * 100) / 100 : 0,
      }));

      const grandTotal = items.reduce((acc, i) => acc + i.sum, 0);
      const maxVal = Math.max(...items.map((i) => i.sum), 1);

      return {
        tableData: {
          items,
          grandTotal,
          maxVal,
          totalRecords: rows.length,
        },
      };
    }

    // Interactive Slicer
    if (spec.type === "slicer") {
      const dim = spec.dimensionField || "";
      const counts = new Map<string, number>();

      for (const r of rows) {
        const key = String(r[dim] ?? "Unassigned").trim();
        counts.set(key, (counts.get(key) || 0) + 1);
      }

      const items = Array.from(counts.entries())
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);

      return {
        slicerData: {
          items,
          totalRows: rows.length,
        },
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

    // Vertical Bar
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

    // Horizontal Bar / Leaderboard
    if (spec.type === "horizontal_bar") {
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
        grid: { top: 20, right: 65, bottom: 25, left: 95, containLabel: true },
        xAxis: {
          type: "value",
          splitLine: { lineStyle: { color: gridLineColor, type: "dashed" } },
          axisLabel: {
            color: textColor,
            fontSize: 11,
            formatter: (v: number) => formatChartValue(v),
          },
        },
        yAxis: {
          type: "category",
          inverse: true,
          data: data?.categories || [],
          axisLabel: {
            color: textColor,
            fontSize: 11,
            overflow: "truncate",
            width: 90,
          },
          axisLine: { lineStyle: { color: isDark ? "#334155" : "#e2e8f0" } },
          axisTick: { show: false },
        },
        series: [
          {
            data: data?.values || [],
            type: "bar",
            barMaxWidth: 26,
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: palette.primary },
                  { offset: 1, color: palette.accent },
                ],
              },
            },
            label: {
              show: true,
              position: "right",
              distance: 8,
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

    // Line and Area
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

    // Donut and Solid Pie Charts
    if (spec.type === "donut" || spec.type === "pie") {
      const data = processedData as { categories: string[]; values: number[] } | null;
      const isDonut = spec.type === "donut";
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
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: isDonut ? ["36%", "58%"] : ["0%", "58%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: true,
            minAngle: 12,
            itemStyle: {
              borderRadius: isDonut ? 6 : 4,
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

    // Waterfall Chart
    if (spec.type === "waterfall") {
      const data = (processedData as {
        waterfall?: {
          categories: string[];
          baseData: number[];
          increaseData: number[];
          decreaseData: number[];
          totalData: number[];
          cumulativeBalances: number[];
        };
      } | null)?.waterfall;

      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params: unknown) => {
            const arr = (Array.isArray(params) ? params : [params]) as Array<{
              name?: string;
              dataIndex?: number;
            }>;
            if (!arr || arr.length === 0) return "";
            const idx = arr[0]?.dataIndex ?? 0;
            const name = arr[0]?.name ?? "";
            const inc = data?.increaseData[idx] ?? 0;
            const dec = data?.decreaseData[idx] ?? 0;
            const tot = data?.totalData[idx] ?? 0;
            const bal = data?.cumulativeBalances[idx] ?? 0;

            let impactText = "";
            if (name === "Net Total") {
              impactText = `<span style="color:${palette.primary};font-weight:700;">Net Balance: ${tot.toLocaleString()}</span>`;
            } else if (inc > 0) {
              impactText = `<span style="color:#10b981;font-weight:700;">+${inc.toLocaleString()} (Addition)</span>`;
            } else if (dec > 0) {
              impactText = `<span style="color:#f43f5e;font-weight:700;">-${dec.toLocaleString()} (Reduction)</span>`;
            } else {
              impactText = `<span>0</span>`;
            }

            return `<div style="font-family:inherit;font-size:12px;padding:2px 4px;">
              <div style="font-weight:600;margin-bottom:4px;color:${isDark ? "#e2e8f0" : "#1e293b"};">${name}</div>
              <div style="margin-bottom:2px;">${impactText}</div>
              <div style="font-size:11px;color:${textColor};">Balance: <strong>${bal.toLocaleString()}</strong></div>
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
            rotate: (data?.categories?.length || 0) > 5 ? 25 : 0,
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
            name: "Base",
            type: "bar",
            stack: "waterfall",
            itemStyle: { borderColor: "transparent", color: "transparent" },
            emphasis: { itemStyle: { borderColor: "transparent", color: "transparent" } },
            data: data?.baseData || [],
          },
          {
            name: "Increase",
            type: "bar",
            stack: "waterfall",
            data: data?.increaseData || [],
            itemStyle: { color: "#10b981", borderRadius: [4, 4, 0, 0] },
            label: {
              show: true,
              position: "top",
              formatter: (p: unknown) => {
                const v = Number((p as { value?: number }).value || 0);
                return v > 0 ? `+${formatChartValue(v)}` : "";
              },
              fontSize: 10,
              fontWeight: 700,
              color: "#10b981",
            },
          },
          {
            name: "Decrease",
            type: "bar",
            stack: "waterfall",
            data: data?.decreaseData || [],
            itemStyle: { color: "#f43f5e", borderRadius: [0, 0, 4, 4] },
            label: {
              show: true,
              position: "bottom",
              formatter: (p: unknown) => {
                const v = Number((p as { value?: number }).value || 0);
                return v > 0 ? `-${formatChartValue(v)}` : "";
              },
              fontSize: 10,
              fontWeight: 700,
              color: "#f43f5e",
            },
          },
          {
            name: "Total",
            type: "bar",
            stack: "waterfall",
            data: data?.totalData || [],
            itemStyle: { color: palette.primary, borderRadius: [4, 4, 0, 0] },
            label: {
              show: true,
              position: "top",
              formatter: (p: unknown) => {
                const v = Number((p as { value?: number }).value || 0);
                return v !== 0 ? formatChartValue(v) : "";
              },
              fontSize: 11,
              fontWeight: 700,
              color: palette.primary,
            },
          },
        ],
      };
    }

    // Radial Attainment Gauge
    if (spec.type === "gauge") {
      const score = (processedData as { gauge?: { score: number; rawAverage: number } } | null)?.gauge?.score || 0;
      return {
        backgroundColor: "transparent",
        series: [
          {
            type: "gauge",
            startAngle: 210,
            endAngle: -30,
            min: 0,
            max: 100,
            splitNumber: 5,
            radius: "84%",
            center: ["50%", "56%"],
            itemStyle: {
              color: palette.primary,
            },
            progress: {
              show: true,
              roundCap: true,
              width: 14,
            },
            pointer: {
              length: "55%",
              width: 5,
              offsetCenter: [0, "5%"],
              itemStyle: {
                color: palette.primary,
              },
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 14,
                color: [[1, isDark ? "#1e293b" : "#f1f5f9"]],
              },
            },
            axisTick: {
              distance: -20,
              splitNumber: 4,
              lineStyle: {
                width: 1,
                color: isDark ? "#475569" : "#cbd5e1",
              },
            },
            splitLine: {
              distance: -24,
              length: 10,
              lineStyle: {
                width: 2,
                color: isDark ? "#64748b" : "#94a3b8",
              },
            },
            axisLabel: {
              distance: -16,
              color: textColor,
              fontSize: 10,
            },
            title: {
              show: true,
              offsetCenter: [0, "45%"],
              fontSize: 12,
              fontWeight: 600,
              color: textColor,
            },
            detail: {
              valueAnimation: true,
              fontSize: 26,
              fontWeight: 800,
              offsetCenter: [0, "18%"],
              formatter: "{value}%",
              color: isDark ? "#f8fafc" : "#0f172a",
            },
            data: [
              {
                value: score,
                name: "Attainment",
              },
            ],
          },
        ],
      };
    }

    // Conversion Funnel
    if (spec.type === "funnel") {
      const data = processedData as { categories: string[]; values: number[] } | null;
      const funnelData = (data?.categories || []).map((cat, idx) => ({
        name: cat,
        value: data?.values[idx] || 0,
      }));

      return {
        backgroundColor: "transparent",
        color: palette.donutPalette,
        tooltip: {
          trigger: "item",
          formatter: (params: unknown) => {
            const p = params as { name?: string; value?: number; percent?: number };
            return `<div style="font-family:inherit;font-size:12px;padding:2px 4px;">
              <div style="font-weight:600;margin-bottom:4px;color:${isDark ? "#e2e8f0" : "#1e293b"};">${p.name || ""}</div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-weight:700;color:${isDark ? "#f8fafc" : "#0f172a"};">${Number(p.value || 0).toLocaleString()} (${p.percent || 0}%)</span>
              </div>
            </div>`;
          },
        },
        series: [
          {
            name: spec.title,
            type: "funnel",
            left: "12%",
            top: 25,
            bottom: 25,
            width: "76%",
            minSize: "18%",
            maxSize: "100%",
            sort: "descending",
            gap: 4,
            label: {
              show: true,
              position: "inside",
              formatter: (params: unknown) => {
                const p = params as { name?: string; value?: number };
                return `${p.name}: ${formatChartValue(Number(p.value || 0))}`;
              },
              fontSize: 11,
              fontWeight: 700,
              color: "#ffffff",
            },
            itemStyle: {
              borderColor: isDark ? "#0f172a" : "#ffffff",
              borderWidth: 2,
              borderRadius: 4,
            },
            data: funnelData,
          },
        ],
      };
    }

    // Scatter
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
      case "horizontal_bar":
        return <BarChart3 className="w-4 h-4 rotate-90" style={iconStyle} />;
      case "line":
      case "area":
        return <TrendingUp className="w-4 h-4" style={iconStyle} />;
      case "donut":
      case "pie":
        return <PieChart className="w-4 h-4" style={iconStyle} />;
      case "waterfall":
        return <BarChart3 className="w-4 h-4" style={iconStyle} />;
      case "gauge":
        return <Gauge className="w-4 h-4" style={iconStyle} />;
      case "funnel":
        return <Filter className="w-4 h-4" style={iconStyle} />;
      case "scatter":
        return <Activity className="w-4 h-4" style={iconStyle} />;
      case "table":
        return <Table2 className="w-4 h-4" style={iconStyle} />;
      case "slicer":
        return <Sliders className="w-4 h-4" style={iconStyle} />;
      default:
        return <Layers className="w-4 h-4 text-slate-500" />;
    }
  };

  // =========================================================================
  // VIEW 1: KPI Widget Card
  // =========================================================================
  if (spec.type === "kpi") {
    const kpi = processedData as { kpiValue: number; count: number } | null;
    return (
      <Card className={`p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all break-inside-avoid print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white relative overflow-hidden ${palette.kpiBorder} border`}>
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

  // =========================================================================
  // VIEW 2: Interactive Dimension Slicer Visual
  // =========================================================================
  // =========================================================================
  // VIEW 2: Interactive Dimension Slicer Visual (Ultra-Compact & Executive)
  // =========================================================================
  if (spec.type === "slicer") {
    const rawSlicer = (processedData as { slicerData?: { items: { label: string; count: number }[]; totalRows: number } } | null)?.slicerData;
    const allItems = rawSlicer?.items || [];
    const activeValues = (activeFilters?.find((f) => f.fieldName === spec.dimensionField)?.values || []).map(String);

    const filteredItems = allItems.filter((i) =>
      i.label.toLowerCase().includes(slicerSearch.toLowerCase())
    );

    return (
      <Card className="flex flex-col overflow-hidden shadow-2xs hover:shadow-xs transition-shadow break-inside-avoid print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 rounded-xl">
        <div
          className="h-0.5 w-full shrink-0"
          style={{ background: `linear-gradient(to right, ${palette.primary}, ${palette.accent})` }}
        />
        <CardHeader className="p-2.5 px-3.5 border-b border-slate-100 dark:border-slate-800/70 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0 print:border print:border-slate-200">
              <Sliders className="w-3.5 h-3.5" style={{ color: palette.primary }} />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <CardTitle className="text-xs font-semibold print:text-slate-900 text-slate-800 dark:text-slate-200 truncate">
                {spec.title}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono text-slate-500">
                {spec.dimensionField}
              </Badge>
              {activeValues.length > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {activeValues.length} active
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 print:hidden">
            {activeValues.length > 0 && onFilterSelect && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilterSelect(spec.dimensionField || "", "__ALL__")}
                className="h-6 text-[10px] px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 gap-1 rounded font-medium"
                title="Clear filter on this slicer"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </Button>
            )}

            {onMoveUp && (
              <button
                onClick={() => onMoveUp(spec.id)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Move Earlier"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}

            {onMoveDown && (
              <button
                onClick={() => onMoveDown(spec.id)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Move Later"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(spec)}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit Slicer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {onDuplicate && (
              <button
                onClick={() => onDuplicate(spec)}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Duplicate Slicer"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete Slicer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-3 px-3.5 flex flex-col justify-start space-y-2">
          {allItems.length > 8 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={slicerSearch}
                onChange={(e) => setSlicerSearch(e.target.value)}
                placeholder={`Search ${spec.dimensionField}...`}
                className="w-full text-xs pl-8 pr-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 max-h-[160px] overflow-y-auto pr-0.5 scrollbar-thin">
            {/* All / Clear Pill */}
            <button
              onClick={() => onFilterSelect?.(spec.dimensionField || "", "__ALL__")}
              className={`h-7 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs border active:scale-95 cursor-pointer ${
                activeValues.length === 0
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              <span>All Values</span>
              <span className="text-[10px] opacity-75 font-mono">({rawSlicer?.totalRows || 0})</span>
            </button>

            {filteredItems.map((item) => {
              const isSelected = activeValues.includes(item.label);
              return (
                <button
                  key={item.label}
                  onClick={() => onFilterSelect?.(spec.dimensionField || "", item.label)}
                  className={`h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs border active:scale-95 cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-offset-1 text-white shadow-xs font-bold"
                      : "bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:border-slate-400 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: palette.primary,
                          borderColor: palette.primary,
                        }
                      : undefined
                  }
                >
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />}
                  <span className="truncate max-w-[140px]">{item.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>
              {activeValues.length > 0 ? `${activeValues.length} active filter • click to toggle` : "Click any pill to cross-filter all visuals"}
            </span>
            <span>{allItems.length} segments</span>
          </div>
        </CardContent>

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Slicer"
          description="Are you sure you want to remove this slicer?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Removing &ldquo;{spec.title}&rdquo; will remove this interactive slicer from the view.
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
                Delete Slicer
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    );
  }

  // =========================================================================
  // VIEW 3: Executive Data Table Grid Visual
  // =========================================================================
  if (spec.type === "table") {
    const rawTable = (processedData as {
      tableData?: {
        items: { label: string; sum: number; count: number; average: number }[];
        grandTotal: number;
        maxVal: number;
        totalRecords: number;
      };
    } | null)?.tableData;

    const allItems = rawTable?.items || [];
    const maxVal = rawTable?.maxVal || 1;
    const grandTotal = rawTable?.grandTotal || 0;

    const filteredItems = allItems.filter((i) =>
      i.label.toLowerCase().includes(tableSearch.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
      let diff = 0;
      if (tableSortField === "label") diff = a.label.localeCompare(b.label);
      else if (tableSortField === "count") diff = a.count - b.count;
      else diff = a.sum - b.sum;
      return tableSortDir === "asc" ? diff : -diff;
    });

    const toggleSort = (field: "label" | "value" | "count") => {
      if (tableSortField === field) {
        setTableSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setTableSortField(field);
        setTableSortDir("desc");
      }
    };

    return (
      <Card className="flex flex-col justify-between overflow-hidden shadow-2xs break-inside-avoid print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white border border-slate-200 dark:border-slate-800">
        <div
          className="h-1 w-full shrink-0"
          style={{ background: `linear-gradient(to right, ${palette.primary}, ${palette.accent})` }}
        />
        <CardHeader className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 print:border print:border-slate-200">
              <Table2 className="w-4 h-4" style={{ color: palette.primary }} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold print:text-slate-900">{spec.title}</CardTitle>
              <CardDescription className="text-[11px]">
                {spec.dimensionField || "Segment"} • {spec.measureField || "Measure"}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1 print:hidden">
            {allItems.length > 5 && (
              <div className="relative mr-1">
                <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter table..."
                  className="w-28 text-[11px] pl-6 pr-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none"
                />
              </div>
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
                title="Edit Table"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {onDuplicate && (
              <button
                onClick={() => onDuplicate(spec)}
                className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Duplicate Table"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                title="Delete Table"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col justify-start min-h-[300px]">
          <div className="overflow-x-auto max-h-[290px] overflow-y-auto text-xs font-mono">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px] tracking-wider z-10">
                <tr>
                  <th className="p-2.5 w-10 text-center">#</th>
                  <th
                    className="p-2.5 cursor-pointer hover:text-indigo-600"
                    onClick={() => toggleSort("label")}
                  >
                    <div className="flex items-center gap-1">
                      <span>{spec.dimensionField || "Segment"}</span>
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    className="p-2.5 cursor-pointer hover:text-indigo-600 text-right w-20"
                    onClick={() => toggleSort("count")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Rows</span>
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th className="p-2.5 w-32 hidden sm:table-cell">Distribution</th>
                  <th
                    className="p-2.5 cursor-pointer hover:text-indigo-600 text-right w-28"
                    onClick={() => toggleSort("value")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>{spec.measureField || "Sum"}</span>
                      <ArrowUpDown className="w-3 h-3 opacity-60" />
                    </div>
                  </th>
                  <th className="p-2.5 text-right w-16">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedItems.map((item, idx) => {
                  const pct = grandTotal > 0 ? Math.round((item.sum / grandTotal) * 1000) / 10 : 0;
                  const barWidth = Math.min(100, Math.max(4, Math.round((item.sum / maxVal) * 100)));
                  return (
                    <tr
                      key={item.label}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-2.5 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="p-2.5 font-sans font-semibold text-slate-800 dark:text-slate-200">
                        {item.label}
                      </td>
                      <td className="p-2.5 text-right text-slate-500 dark:text-slate-400">
                        {item.count.toLocaleString()}
                      </td>
                      <td className="p-2.5 hidden sm:table-cell">
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${barWidth}%`,
                              background: `linear-gradient(to right, ${palette.primary}, ${palette.accent})`,
                            }}
                          />
                        </div>
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {item.sum.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right text-slate-500 font-mono text-[11px]">
                        {pct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t-2 border-slate-200 dark:border-slate-800 font-bold text-[11px]">
                <tr>
                  <td className="p-2.5 text-center text-slate-400">Total</td>
                  <td className="p-2.5 text-slate-900 dark:text-slate-100">
                    {allItems.length} segments
                  </td>
                  <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">
                    {rawTable?.totalRecords.toLocaleString()}
                  </td>
                  <td className="p-2.5 hidden sm:table-cell">100% total</td>
                  <td className="p-2.5 text-right text-slate-900 dark:text-slate-100 font-mono">
                    {grandTotal.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-right">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>

        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Table Grid"
          description="Are you sure you want to remove this table from your dashboard?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 dark:text-slate-300">
              Removing &ldquo;{spec.title}&rdquo; will remove this executive table grid.
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
                Delete Table
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    );
  }

  // =========================================================================
  // VIEW 4: ECharts Visualizations (Bar, Horizontal Bar, Line, Area, Donut, Pie, Waterfall, Gauge, Funnel, Scatter)
  // =========================================================================
  const chartData = processedData as { categories?: string[]; values?: number[]; scatterPoints?: [number, number][] } | null;

  return (
    <Card className="flex flex-col justify-between overflow-hidden shadow-2xs break-inside-avoid print:break-inside-avoid print:shadow-none print:border-slate-300 print:bg-white border border-slate-200 dark:border-slate-800">
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
          <div ref={containerRef} className="w-full h-[300px]" />
        )}
      </CardContent>

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
