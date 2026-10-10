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
} from "lucide-react";

export default function ReportDashboardPage() {
  const { profile, rows, isLoading } = useDataset();

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
    setHasUnsavedChanges(true);
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

      {/* 1. Summary Header (PRD Section 7.5, 7.8 & 18) */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs min-w-0">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 min-w-0">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
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

            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 break-words"
              title={reportTitle || profile.metadata.name}
            >
              {reportTitle || profile.metadata.name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
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
                <strong>{widgets.length}</strong> active widgets
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
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0 max-w-full">
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

      {/* 3. Executive KPI Cards Row (PRD Section 7.5) */}
      {kpiWidgets.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Executive Key Performance Indicators
            </h2>
            <span className="text-xs text-slate-400">
              {kpiWidgets.length} metrics calculated from active rows
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiWidgets.map((kpi) => (
              <WidgetCard
                key={kpi.id}
                spec={kpi}
                rows={filteredRows}
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Deterministic Business Insights
              </h2>
              <Badge variant="outline" className="text-[10px]">
                Mathematical Proof
              </Badge>
            </div>
            <span className="text-xs text-slate-400">
              Traceable formulas • Zero hallucination
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deterministicInsights.map((insight) => {
              const isWarning = insight.severity === "warning";
              const isPositive = insight.severity === "positive";

              return (
                <Card
                  key={insight.id}
                  className={`p-4.5 flex flex-col justify-between transition-all hover:shadow-xs ${
                    isWarning
                      ? "border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/10"
                      : isPositive
                      ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10"
                      : "border-slate-200 dark:border-slate-800"
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
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {insight.title}
                        </span>
                      </div>
                      <Badge
                        variant={isWarning ? "warning" : "default"}
                        className="text-[10px] capitalize"
                      >
                        {insight.type.replace("_", " ")}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {insight.computedValue}
                    </span>
                    <button
                      onClick={() => setSelectedInsight(insight)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
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
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Interactive Visualizations
            </h2>
            <Badge variant="outline" className="text-[10px]">
              ECharts Engine
            </Badge>
          </div>
          <div className="flex items-center gap-2">
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
                  className={isFullSpan ? "col-span-1 lg:col-span-2" : "col-span-1"}
                >
                  <WidgetCard
                    spec={spec}
                    rows={filteredRows}
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
