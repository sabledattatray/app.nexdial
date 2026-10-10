"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useDataset } from "@/context/DatasetContext";
import { recommendDashboardWidgets, ChartWidgetSpec } from "@/domain/recommendations/chart-recommender";
import { generateDeterministicInsights, EvidenceInsight } from "@/domain/insights/insights-engine";
import {
  WidgetDefinition,
  ReportFilter,
  ReportDefinition,
  serializeReportDefinition,
  validateReportJson,
} from "@/domain/report/schema";
import { applyReportFilters } from "@/domain/report/filter-engine";
import {
  saveReportLocally,
  loadReportLocally,
  listSavedReportsLocally,
  deleteReportLocally,
} from "@/lib/storage/report-storage";
import { exportToCsv } from "@/lib/export/csv-exporter";
import { exportToXlsx } from "@/lib/export/xlsx-exporter";
import { WidgetCard } from "@/components/charts/WidgetCard";
import { GlobalFilterBar } from "@/components/dashboard/GlobalFilterBar";
import { WidgetInspectorModal } from "@/components/editor/WidgetInspectorModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import {
  UploadCloud,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Info,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  Plus,
  Save,
  FolderOpen,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ChevronDown,
  FileCode,
  Layers,
} from "lucide-react";
import { TemplateSwitcherBar } from "@/components/templates/TemplateSwitcherBar";
import { TemplateSlideOverDrawer } from "@/components/templates/TemplateSlideOverDrawer";
import { PopularTemplatesBar } from "@/components/templates/PopularTemplatesBar";
import { TemplatesRightSidebar } from "@/components/templates/TemplatesRightSidebar";
import { MIS_TEMPLATES, MISTemplate, TemplateColorTheme } from "@/lib/templates/template-registry";
import { parseCsvString } from "@/lib/parsers/csv-parser";
import { profileDataset } from "@/domain/dataset/profiler";

const COLOR_THEME_OPTIONS: { id: TemplateColorTheme; name: string; hex: string }[] = [
  { id: "indigo", name: "Indigo", hex: "#6366f1" },
  { id: "emerald", name: "Emerald", hex: "#10b981" },
  { id: "blue", name: "Blue", hex: "#3b82f6" },
  { id: "violet", name: "Violet", hex: "#8b5cf6" },
  { id: "amber", name: "Amber", hex: "#f59e0b" },
  { id: "rose", name: "Rose", hex: "#f43f5e" },
  { id: "cyan", name: "Cyan", hex: "#06b6d4" },
  { id: "slate", name: "Slate", hex: "#64748b" },
];

export default function ReportDashboardPage() {
  const { profile, rows, isLoading, setLoadedDataset } = useDataset();

  // Template Right Sidebar & Active Selection State
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [selectedColorTheme, setSelectedColorTheme] = useState<TemplateColorTheme | null>(null);
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  const activeColorTheme: TemplateColorTheme = useMemo(() => {
    if (selectedColorTheme) return selectedColorTheme;
    if (activeTemplateId) {
      const tmpl = MIS_TEMPLATES.find((t) => t.id === activeTemplateId);
      if (tmpl?.colorTheme) return tmpl.colorTheme;
    }
    return "indigo";
  }, [selectedColorTheme, activeTemplateId]);

  // 1. Default recommendations
  const defaultWidgets = useMemo(() => {
    if (!profile || rows.length === 0) return [];
    return recommendDashboardWidgets(profile.fields, rows);
  }, [profile, rows]);

  // 2. Dashboard Customization State
  const [customWidgets, setCustomWidgets] = useState<WidgetDefinition[] | null>(null);
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Active widgets and title
  const widgets = customWidgets ?? defaultWidgets;
  const reportTitle = customTitle ?? (profile ? `${profile.metadata.name} Dashboard` : "MIS Dashboard");

  // Inspector & Modal states
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetDefinition | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<EvidenceInsight | null>(null);

  // Save / Load Reports State
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [savedReportsListModalOpen, setSavedReportsListModalOpen] = useState(false);
  const [savedReports, setSavedReports] = useState<ReportDefinition[]>([]);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Export Dropdown popover
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target as Node)) {
        setExportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Client-Side Real-Time Filter Evaluation
  const filteredRows = useMemo(() => {
    return applyReportFilters(rows, filters);
  }, [rows, filters]);

  // Split widgets into KPIs and Visualizations
  const kpiWidgets = useMemo(
    () => widgets.filter((w) => w.type === "kpi"),
    [widgets]
  );
  const visualWidgets = useMemo(
    () => widgets.filter((w) => w.type !== "kpi"),
    [widgets]
  );

  // 4. Generate Deterministic Insights from Filtered Data
  const deterministicInsights = useMemo(() => {
    if (!profile || filteredRows.length === 0) return [];
    return generateDeterministicInsights(filteredRows, profile.fields);
  }, [profile, filteredRows]);

  // Filter handlers
  const handleAddFilter = (newFilter: ReportFilter) => {
    setFilters((prev) => [...prev, newFilter]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId));
    setHasUnsavedChanges(true);
  };

  const handleClearFilters = () => {
    setFilters([]);
    setHasUnsavedChanges(true);
  };

  // Widget manipulation handlers
  const handleOpenAddWidget = () => {
    setEditingWidget(null);
    setInspectorOpen(true);
  };

  const handleOpenEditWidget = (spec: ChartWidgetSpec) => {
    const existing = widgets.find((w) => w.id === spec.id);
    if (existing) {
      setEditingWidget(existing);
      setInspectorOpen(true);
    }
  };

  const handleSaveWidget = (updated: WidgetDefinition) => {
    setCustomWidgets((prev) => {
      const base = prev ?? defaultWidgets;
      const index = base.findIndex((w) => w.id === updated.id);
      if (index >= 0) {
        const next = [...base];
        next[index] = updated;
        return next;
      }
      return [...base, updated];
    });
    setHasUnsavedChanges(true);
  };

  const handleDuplicateWidget = (spec: ChartWidgetSpec) => {
    const newWidget: WidgetDefinition = {
      ...spec,
      id: `widget_${Date.now()}`,
      title: `${spec.title} (Copy)`,
    };
    setCustomWidgets((prev) => [...(prev ?? defaultWidgets), newWidget]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setCustomWidgets((prev) => (prev ?? defaultWidgets).filter((w) => w.id !== widgetId));
    setHasUnsavedChanges(true);
  };

  const handleMoveUp = (widgetId: string) => {
    setCustomWidgets((prev) => {
      const base = prev ?? defaultWidgets;
      const index = base.findIndex((w) => w.id === widgetId);
      if (index <= 0) return base;
      const next = [...base];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const handleMoveDown = (widgetId: string) => {
    setCustomWidgets((prev) => {
      const base = prev ?? defaultWidgets;
      const index = base.findIndex((w) => w.id === widgetId);
      if (index < 0 || index >= base.length - 1) return base;
      const next = [...base];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
    setHasUnsavedChanges(true);
  };

  const handleResetToRecommended = () => {
    setCustomWidgets(null);
    setCustomTitle(null);
    setFilters([]);
    setActiveTemplateId(null);
    setSelectedColorTheme(null);
    setHasUnsavedChanges(true);
  };

  // Apply a template's architectural layout & chart widgets to current loaded data
  const handleApplyTemplateLayout = (template: MISTemplate) => {
    if (!profile) return;

    const numericFields = profile.fields.filter(
      (f) => f.role === "measure" || f.userType === "number" || f.userType === "integer"
    );
    const catFields = profile.fields.filter(
      (f) => f.role === "dimension" || f.userType === "categorical" || f.userType === "text" || f.userType === "date"
    );
    const dateFields = profile.fields.filter((f) => f.userType === "date");

    const defaultNum = numericFields[0]?.name || profile.fields[0]?.name || "Value";
    const defaultCat = catFields[0]?.name || profile.fields[0]?.name || "Category";
    const defaultDate = dateFields[0]?.name || defaultCat;

    const mappedWidgets: WidgetDefinition[] = template.widgets.map((tw, index) => {
      // Find matching measure or fallback
      let mField = defaultNum;
      if (tw.measureField && profile.fields.some((f) => f.name.toLowerCase() === tw.measureField?.toLowerCase())) {
        mField = profile.fields.find((f) => f.name.toLowerCase() === tw.measureField?.toLowerCase())!.name;
      } else {
        const numIdx = index % Math.max(1, numericFields.length);
        mField = numericFields[numIdx]?.name || defaultNum;
      }

      // Find matching dimension or fallback
      let dField = defaultCat;
      if (tw.type === "line" || tw.type === "area") {
        dField = defaultDate;
      } else if (tw.dimensionField && profile.fields.some((f) => f.name.toLowerCase() === tw.dimensionField?.toLowerCase())) {
        dField = profile.fields.find((f) => f.name.toLowerCase() === tw.dimensionField?.toLowerCase())!.name;
      } else {
        const catIdx = index % Math.max(1, catFields.length);
        dField = catFields[catIdx]?.name || defaultCat;
      }

      let secMeasure: string | undefined = undefined;
      if (tw.secondaryMeasureField && profile.fields.some((f) => f.name.toLowerCase() === tw.secondaryMeasureField?.toLowerCase())) {
        secMeasure = profile.fields.find((f) => f.name.toLowerCase() === tw.secondaryMeasureField?.toLowerCase())!.name;
      } else if (tw.type === "scatter" && numericFields.length > 1) {
        secMeasure = numericFields[1]?.name;
      }

      const widgetType = (tw.type === "column" ? "bar" : tw.type) as WidgetDefinition["type"];

      return {
        id: `tpl_w_${Date.now()}_${index}`,
        type: widgetType,
        title: tw.title,
        measureField: mField,
        dimensionField: tw.type === "kpi" ? undefined : dField,
        secondaryMeasureField: secMeasure,
        aggregation: (tw.aggregation === "avg" ? "average" : tw.aggregation || "sum") as WidgetDefinition["aggregation"],
        gridSpan: tw.gridSpan === "full" ? "full" : "half",
        topN: tw.topN || (tw.type === "bar" || tw.type === "donut" ? 10 : undefined),
        whyThisChart: `Configured from ${template.name} architecture.`,
      };
    });

    setCustomWidgets(mappedWidgets);
    setCustomTitle(`${template.name} • ${profile.metadata.name}`);
    setActiveTemplateId(template.id);
    setSelectedColorTheme(template.colorTheme);
    setHasUnsavedChanges(true);
    setSaveSuccessMessage(`Applied "${template.name}" layout! Live report updated.`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
    // Smoothly scroll back to report if applied from bottom shelf
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Load a template's complete synthetic dataset into memory & render live report
  const handleLoadTemplateData = async (template: MISTemplate) => {
    try {
      setLoadingTemplateId(template.id);
      const response = await fetch(`/sample-data/${template.filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load template data: ${response.statusText}`);
      }
      const csvText = await response.text();
      const parseResult = await parseCsvString(csvText);
      const newProfile = profileDataset(parseResult.rows, parseResult.headers, {
        id: `tpl_${template.id}`,
        name: template.filename.replace(".csv", "").toUpperCase(),
        sourceFormat: "csv",
        sizeBytes: csvText.length,
        importedAt: new Date().toISOString(),
      });

      setLoadedDataset(newProfile, parseResult.rows, {
        rows: parseResult.rows,
        headers: parseResult.headers,
      });

      const templateWidgets: WidgetDefinition[] = template.widgets.map((tw, index) => ({
        id: `tpl_w_${template.id}_${index}`,
        type: (tw.type === "column" ? "bar" : tw.type) as WidgetDefinition["type"],
        title: tw.title,
        measureField: tw.measureField || newProfile.fields.find((f) => f.role === "measure")?.name,
        dimensionField:
          tw.type === "kpi"
            ? undefined
            : tw.dimensionField || newProfile.fields.find((f) => f.role === "dimension")?.name,
        secondaryMeasureField: tw.secondaryMeasureField,
        aggregation: (tw.aggregation === "avg" ? "average" : tw.aggregation || "sum") as WidgetDefinition["aggregation"],
        gridSpan: tw.gridSpan === "full" ? "full" : "half",
        topN: tw.topN || (tw.type === "bar" || tw.type === "donut" ? 10 : undefined),
        whyThisChart: `Loaded from ${template.name}`,
      }));

      setCustomWidgets(templateWidgets);
      setCustomTitle(template.name);
      setActiveTemplateId(template.id);
      setSelectedColorTheme(template.colorTheme);
      setFilters([]);
      setHasUnsavedChanges(false);
      setSaveSuccessMessage(
        `Loaded "${template.name}" (${parseResult.rows.length.toLocaleString()} rows). Live report ready!`
      );
      setTimeout(() => setSaveSuccessMessage(null), 4000);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      alert(`Error loading template: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoadingTemplateId(null);
    }
  };

  // Local Persistence Handlers
  const handleSaveReportToLocal = async () => {
    if (!profile) return;
    const reportDef: ReportDefinition = {
      version: "1.0.0",
      id: `report_${profile.metadata.id}_${Date.now()}`,
      title: reportTitle.trim() || `${profile.metadata.name} Report`,
      datasetId: profile.metadata.id,
      datasetName: profile.metadata.name,
      widgets,
      filters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveReportLocally(reportDef);
    setHasUnsavedChanges(false);
    setSaveModalOpen(false);
    setSaveSuccessMessage(`Report "${reportDef.title}" saved locally in your browser.`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleOpenSavedReportsList = async () => {
    const list = await listSavedReportsLocally();
    setSavedReports(list);
    setSavedReportsListModalOpen(true);
  };

  const handleLoadSavedReport = async (reportId: string) => {
    const loaded = await loadReportLocally(reportId);
    if (loaded) {
      setCustomWidgets(loaded.widgets);
      setFilters(loaded.filters);
      setCustomTitle(loaded.title);
      setHasUnsavedChanges(false);
      setSavedReportsListModalOpen(false);
    }
  };

  const handleDeleteSavedReport = async (reportId: string) => {
    await deleteReportLocally(reportId);
    setSavedReports((prev) => prev.filter((r) => r.id !== reportId));
  };

  // Export JSON Definition
  const handleExportJson = () => {
    if (!profile) return;
    const reportDef: ReportDefinition = {
      version: "1.0.0",
      id: `report_${Date.now()}`,
      title: reportTitle.trim() || `${profile.metadata.name} Report`,
      datasetId: profile.metadata.id,
      datasetName: profile.metadata.name,
      widgets,
      filters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const jsonString = serializeReportDefinition(reportDef);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportDef.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.openmis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON Definition
  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = validateReportJson(content);
      if (validation.success && validation.data) {
        setCustomWidgets(validation.data.widgets);
        setFilters(validation.data.filters);
        setCustomTitle(validation.data.title);
        setHasUnsavedChanges(true);
        setSaveSuccessMessage(`Imported configuration "${validation.data.title}" successfully.`);
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      } else {
        alert(`Failed to load report file: ${validation.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-slate-500 animate-pulse">
        Loading dataset into dashboard memory...
      </div>
    );
  }

  // PRD Section 6 & 18 Anti-Placeholder Rule: If no dataset in memory, render genuine EmptyState
  if (!profile || rows.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Executive MIS Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Deterministic KPIs, statistical insights, and rule-based chart visualizations
            </p>
          </div>
        </div>

        <EmptyState
          icon={<BarChart3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />}
          title="No Dataset Loaded in Memory"
          description="OpenMIS requires an uploaded spreadsheet or sample business dataset to compute executive metrics and render visualizations. Zero fake numbers or mock charts are shown."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/app/new">
                <Button className="gap-2 shadow-xs">
                  <UploadCloud className="w-4 h-4" />
                  Upload Spreadsheet
                </Button>
              </Link>
              <Link href="/app/templates">
                <Button variant="outline" className="gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Try Sample MIS Dataset
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Success alert message */}
      {saveSuccessMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMessage(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dedicated Executive Boardroom Print Header (Visible ONLY when printing) */}
      <div className="hidden print:block mb-6 pb-4 border-b-2 border-slate-900 break-inside-avoid">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-900 text-white font-bold text-lg print:border print:border-indigo-900">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight uppercase text-slate-900">
                  Nexdial OpenMIS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  Boardroom Report
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-0.5 tracking-tight">
                {reportTitle || (profile ? `${profile.metadata.name} Report` : "Executive MIS Dashboard")}
              </h1>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-900 border border-amber-300 rounded">
              Confidential • Executive Distribution Only
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </div>
          </div>
        </div>

        {/* Executive Meta Bar */}
        <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-4">
            <span><strong>Source:</strong> {profile.metadata.name}</span>
            <span>•</span>
            <span><strong>Scope:</strong> {filteredRows.length.toLocaleString()} of {rows.length.toLocaleString()} active rows</span>
            <span>•</span>
            <span><strong>Dimensions:</strong> {profile.fields.length} columns</span>
            <span>•</span>
            <span><strong>Data Health Score:</strong> {profile.qualityScore}% verified</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {filters.length > 0 ? `${filters.length} active filter(s) applied` : "Full dataset (unfiltered)"}
          </div>
        </div>
      </div>

      {/* 1. Summary Header (PRD Section 7.5, 7.8 & 18) */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs min-w-0 print:hidden space-y-5">
        {/* Top Control Bar: Category Badges (Left) + Action Toolbar Buttons (Right) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Visual Report Editor
            </span>
            <Badge variant="accent" className="gap-1 text-[11px]">
              <Sparkles className="w-3 h-3" />
              <span>Customizable Canvas</span>
            </Badge>
            <Badge variant="success" className="gap-1 text-[11px]">
              <ShieldCheck className="w-3 h-3" />
              <span>100% Client-Side</span>
            </Badge>
            {hasUnsavedChanges && (
              <Badge variant="warning" className="text-[10px]">
                Unsaved Changes
              </Badge>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={rightSidebarOpen ? "primary" : "outline"}
              onClick={() => setRightSidebarOpen((v) => !v)}
              className="gap-1.5 text-xs shadow-2xs"
              title="Toggle right templates sidebar beside report"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Templates Sidebar (22)</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenAddWidget}
              className="gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Widget</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSaveModalOpen(true)}
              className="gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save Local</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenSavedReportsList}
              className="gap-1.5"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>Load Saved</span>
            </Button>

            {/* Consolidated Export Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportDropdownOpen((v) => !v)}
                className="gap-1.5"
                title="Export filtered data or report definition"
                aria-expanded={exportDropdownOpen}
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </Button>

              {exportDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      exportToCsv(filteredRows, profile.fields, `${reportTitle}.csv`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Download className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Export CSV</span>
                      <span className="text-[10px] text-slate-400">Sanitized with active filters</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      exportToXlsx(filteredRows, profile.fields, "MIS_Report", `${reportTitle}.xlsx`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Export Excel</span>
                      <span className="text-[10px] text-slate-400">Multi-column formatted .xlsx</span>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={() => {
                      setExportDropdownOpen(false);
                      handleExportJson();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Export JSON</span>
                      <span className="text-[10px] text-slate-400">.openmis.json report layout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <label className="cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.openmis.json"
                onChange={handleImportJsonFile}
                className="hidden"
              />
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Import JSON</span>
              </span>
            </label>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 print:hidden"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetToRecommended}
              className="gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs"
              title="Reset dashboard to initial auto-recommended widgets"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* Main Content Area: Left Column (Dataset Title & Meta) + Right Column (5 Popular Templates + Dropdown) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Column: Fixed Title and Dataset Details */}
          <div className="lg:col-span-5 space-y-2 min-w-0">
            <h1
              className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 truncate"
              title={reportTitle || profile.metadata.name}
            >
              {reportTitle || profile.metadata.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>
                <strong>{filteredRows.length.toLocaleString()}</strong> of{" "}
                {rows.length.toLocaleString()} rows visible
              </span>
              <span>•</span>
              <span>
                <strong>{profile.fields.length}</strong> columns
              </span>
              <span>•</span>
              <span>
                <strong>{widgets.length}</strong> widgets
              </span>
              <span>•</span>
              <span>
                Health:{" "}
                <strong
                  className={
                    profile.qualityScore >= 80
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }
                >
                  {profile.qualityScore}%
                </strong>
              </span>
            </div>

            {/* Active Template & Palette Indicator */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                  style={{
                    backgroundColor:
                      COLOR_THEME_OPTIONS.find((c) => c.id === activeColorTheme)?.hex || "#6366f1",
                  }}
                />
                <span>
                  {activeTemplateId ? (
                    <>
                      Active Layout:{" "}
                      <strong>
                        {MIS_TEMPLATES.find((t) => t.id === activeTemplateId)?.name}
                      </strong>
                    </>
                  ) : (
                    "Standard MIS Layout"
                  )}
                </span>
              </div>

              {/* Instant Color Theme Switcher */}
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Theme:</span>
                <div className="flex items-center gap-1">
                  {COLOR_THEME_OPTIONS.map((c) => {
                    const isSelected = activeColorTheme === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColorTheme(c.id)}
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                          isSelected
                            ? "scale-125 ring-2 ring-offset-1 ring-slate-900 dark:ring-white shadow-xs"
                            : "hover:scale-110 opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} Theme${isSelected ? " (Active)" : ""}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Fills the blank area): 5 Popular Templates + Dropdown Option */}
          <div className="lg:col-span-7 min-w-0">
            <PopularTemplatesBar
              onApplyTemplateLayout={handleApplyTemplateLayout}
              onLoadTemplateData={handleLoadTemplateData}
              activeTemplateId={activeTemplateId}
              loadingTemplateId={loadingTemplateId}
              isRightSidebarOpen={rightSidebarOpen}
              onToggleRightSidebar={() => setRightSidebarOpen((v) => !v)}
            />
          </div>
        </div>
      </div>

      {/* 2. Global Interactive Filter Bar (PRD Section 7.8) */}
      <GlobalFilterBar
        fields={profile.fields}
        rows={rows}
        filteredCount={filteredRows.length}
        totalCount={rows.length}
        filters={filters}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Main Workspace Layout: Report Canvas (Left) + Right Templates Sidebar (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Complete Generated Report Dashboard */}
        <div className={`${rightSidebarOpen ? "xl:col-span-8 2xl:col-span-9" : "xl:col-span-12"} space-y-6 min-w-0 transition-all duration-300`}>
          {/* 3. Executive KPI Cards Row (PRD Section 7.5) */}
          {kpiWidgets.length > 0 && (
        <section className="space-y-3 break-inside-avoid print:break-inside-avoid">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 print:text-slate-900">
              Executive Key Performance Indicators
            </h2>
            <span className="text-xs text-slate-400 print:text-slate-500">
              {kpiWidgets.length} metrics calculated from active rows
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 break-inside-avoid print:break-inside-avoid">
            {kpiWidgets.map((kpi) => (
              <WidgetCard
                key={kpi.id}
                spec={kpi}
                rows={filteredRows}
                colorTheme={activeColorTheme}
                onEdit={handleOpenEditWidget}
                onDuplicate={handleDuplicateWidget}
                onDelete={handleDeleteWidget}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Deterministic Statistical Insights Section (PRD Section 7.7) */}
      {deterministicInsights.length > 0 && (
        <section className="space-y-3 break-inside-avoid print:break-inside-avoid">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 print:text-slate-900">
                Deterministic Business Insights
              </h2>
              <Badge variant="outline" className="text-[10px] print:border-slate-300 print:text-slate-700">
                Mathematical Proof
              </Badge>
            </div>
            <span className="text-xs text-slate-400 print:text-slate-500">
              Traceable formulas • Zero hallucination
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 break-inside-avoid print:break-inside-avoid">
            {deterministicInsights.map((insight) => {
              const isWarning = insight.severity === "warning";
              const isPositive = insight.severity === "positive";

              return (
                <Card
                  key={insight.id}
                  className={`p-4.5 flex flex-col justify-between transition-all hover:shadow-xs break-inside-avoid print:break-inside-avoid print:shadow-none print:bg-white ${
                    isWarning
                      ? "border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10 print:border-amber-300"
                      : isPositive
                      ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10 print:border-emerald-300"
                      : "border-slate-200 dark:border-slate-800 print:border-slate-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isWarning ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : isPositive ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 print:text-slate-900">
                          {insight.title}
                        </span>
                      </div>
                      <Badge
                        variant={isWarning ? "warning" : "default"}
                        className="text-[10px] capitalize print:border print:border-slate-300"
                      >
                        {insight.type.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed print:text-slate-700">
                      {insight.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 print:border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {insight.computedValue}
                    </span>
                    <button
                      onClick={() => setSelectedInsight(insight)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] print:hidden"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Formula Evidence</span>
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Visualizations Canvas (PRD Section 7.5 & 7.8) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 print:text-slate-900">
              Interactive Visualizations
            </h2>
            <Badge variant="outline" className="text-[10px] print:border-slate-300 print:text-slate-700">
              ECharts Engine
            </Badge>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenAddWidget}
              className="h-7 text-xs gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Add Chart</span>
            </Button>
          </div>
        </div>

        {visualWidgets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visualWidgets.map((spec) => {
              const isFullSpan = spec.gridSpan === "full";
              return (
                <div
                  key={spec.id}
                  className={`${isFullSpan ? "col-span-1 lg:col-span-2" : "col-span-1"} break-inside-avoid print:break-inside-avoid`}
                >
                  <WidgetCard
                    spec={spec}
                    rows={filteredRows}
                    colorTheme={activeColorTheme}
                    onEdit={handleOpenEditWidget}
                    onDuplicate={handleDuplicateWidget}
                    onDelete={handleDeleteWidget}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-2">
            <BarChart3 className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No chart widgets on canvas
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Click &ldquo;Add Chart&rdquo; above to create a custom bar, line, donut, or scatter plot from your data columns.
            </p>
          </div>
        )}
      </section>
        </div>

        {/* Right Column: "RIGHT SIDEBAR BY MY SITE" containing all 22 MIS Templates */}
        {rightSidebarOpen && (
          <div className="xl:col-span-4 2xl:col-span-3 min-w-0 print:hidden">
            <TemplatesRightSidebar
              onApplyTemplateLayout={handleApplyTemplateLayout}
              onLoadTemplateData={handleLoadTemplateData}
              loadingTemplateId={loadingTemplateId}
              activeTemplateId={activeTemplateId}
              onClose={() => setRightSidebarOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Slide-Over Side Drawer for Mobile/Compact View */}
      <TemplateSlideOverDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApplyTemplateLayout={handleApplyTemplateLayout}
        onLoadTemplateData={handleLoadTemplateData}
        loadingTemplateId={loadingTemplateId}
        activeTemplateId={activeTemplateId}
      />

      {/* Dedicated Executive Boardroom Print Footer (Visible ONLY when printing) */}
      <div className="hidden print:flex items-center justify-between pt-4 mt-8 border-t border-slate-300 text-[10px] text-slate-500 break-inside-avoid">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Nexdial OpenMIS</span>
          <span>•</span>
          <span>100% Client-Side Private Analytics</span>
          <span>•</span>
          <span>Zero Cloud Telemetry • No Data Leaves Browser</span>
          <span>•</span>
          <span>app.nexdial.io</span>
        </div>
        <div className="text-right font-mono text-slate-600">
          Strictly Confidential • CFO / Executive Management Information System
        </div>
      </div>

      {/* Modal: Widget Inspector (Add / Edit Widget) */}
      <WidgetInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        widget={editingWidget}
        fields={profile.fields}
        onSaveWidget={handleSaveWidget}
      />

      {/* Modal: Save Report Configuration to IndexedDB */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Report Locally"
        description="Save your customized dashboard widgets and filters into browser IndexedDB"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Report Title:
            </label>
            <Input
              value={reportTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Monthly Executive Sales MIS"
              className="text-xs"
            />
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p><strong>Dataset:</strong> {profile.metadata.name}</p>
            <p><strong>Widgets:</strong> {widgets.length} items</p>
            <p><strong>Filters:</strong> {filters.length} active</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveReportToLocal}>
              Save to Browser
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Saved Reports Manager */}
      <Modal
        isOpen={savedReportsListModalOpen}
        onClose={() => setSavedReportsListModalOpen(false)}
        title="Saved Reports in this Browser"
        description="Select a previously saved dashboard configuration to restore"
        maxWidth="md"
      >
        <div className="space-y-3 text-xs">
          {savedReports.length === 0 ? (
            <div className="py-6 text-center text-slate-400">
              No reports saved in this browser yet. Use &ldquo;Save Local&rdquo; to persist your customized dashboards.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
              {savedReports.map((saved) => (
                <div
                  key={saved.id}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-lg"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {saved.title}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {saved.widgets.length} widgets • {new Date(saved.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadSavedReport(saved.id)}
                      className="h-7 text-xs"
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSavedReport(saved.id)}
                      className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      title="Delete saved report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSavedReportsListModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Insight Evidence & Calculation Proof (PRD Section 7.7) */}
      {selectedInsight && (
        <Modal
          isOpen={!!selectedInsight}
          onClose={() => setSelectedInsight(null)}
          title={selectedInsight.title}
          description="Transparent statistical formula & evidentiary details"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 font-mono">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Formula Definition:
              </p>
              <p className="text-indigo-600 dark:text-indigo-400">
                {selectedInsight.formulaExplanation}
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Metric:</strong> {selectedInsight.metricName}
              </p>
              {selectedInsight.groupName && (
                <p>
                  <strong>Category / Segment:</strong> {selectedInsight.groupName}
                </p>
              )}
              <p>
                <strong>Computed Value:</strong> {selectedInsight.computedValue}
              </p>
              {selectedInsight.baselineValue && (
                <p>
                  <strong>Baseline Benchmark:</strong> {selectedInsight.baselineValue}
                </p>
              )}
              <p>
                <strong>Sample Size:</strong> {selectedInsight.sampleSize.toLocaleString()} rows
              </p>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
              <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                Data Evidence:
              </p>
              <p>{selectedInsight.evidence}</p>
            </div>

            {selectedInsight.caveats && (
              <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                <p className="font-semibold mb-1">Caveats & Interpretation:</p>
                <p>{selectedInsight.caveats}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
