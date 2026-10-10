"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useDataset } from "@/context/DatasetContext";
import { recommendDashboardWidgets } from "@/domain/recommendations/chart-recommender";
import { generateDeterministicInsights, EvidenceInsight } from "@/domain/insights/insights-engine";
import { WidgetCard } from "@/components/charts/WidgetCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import {
  UploadCloud,
  FileSpreadsheet,
  Table as TableIcon,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Info,
  HelpCircle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export default function ReportDashboardPage() {
  const { profile, rows, isLoading } = useDataset();
  const [selectedInsight, setSelectedInsight] = useState<EvidenceInsight | null>(null);

  // 1. Generate Widget Recommendations
  const recommendedWidgets = useMemo(() => {
    if (!profile || rows.length === 0) return [];
    return recommendDashboardWidgets(profile.fields, rows);
  }, [profile, rows]);

  // Split widgets into KPIs and Visualizations
  const kpiWidgets = useMemo(
    () => recommendedWidgets.filter((w) => w.type === "kpi"),
    [recommendedWidgets]
  );
  const visualWidgets = useMemo(
    () => recommendedWidgets.filter((w) => w.type !== "kpi"),
    [recommendedWidgets]
  );

  // 2. Generate Deterministic Insights
  const deterministicInsights = useMemo(() => {
    if (!profile || rows.length === 0) return [];
    return generateDeterministicInsights(rows, profile.fields);
  }, [profile, rows]);

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
    <div className="space-y-8 pb-16">
      {/* 1. Summary Header (PRD Section 7.5 & 18) */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Executive MIS Report
              </span>
              <Badge variant="accent" className="gap-1 text-[11px]">
                <Sparkles className="w-3 h-3" />
                <span>Auto-Generated</span>
              </Badge>
              <Badge variant="success" className="gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Client-Side</span>
              </Badge>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {profile.metadata.name || "Active Dataset"}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
              <span>
                <strong>{rows.length.toLocaleString()}</strong> rows analyzed
              </span>
              <span>•</span>
              <span>
                <strong>{profile.fields.length}</strong> columns
              </span>
              <span>•</span>
              <span>
                Health Score:{" "}
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
              <span>•</span>
              <span className="font-mono text-[11px]">
                Freshness: {new Date(profile.metadata.importedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Link href="/app/data/current">
              <Button variant="outline" size="sm" className="gap-1.5">
                <TableIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Data & Cleaning</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="gap-1.5 print:hidden"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </Button>

            <Link href="/app/new">
              <Button size="sm" className="gap-1.5 shadow-xs">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>New Dataset</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Cards Row (PRD Section 7.5) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Executive Key Performance Indicators
          </h2>
          <span className="text-xs text-slate-400">
            {kpiWidgets.length} metrics calculated from raw data
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiWidgets.map((kpi) => (
            <WidgetCard key={kpi.id} spec={kpi} rows={rows} />
          ))}
        </div>
      </section>

      {/* 3. Deterministic Statistical Insights Section (PRD Section 7.7) */}
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

      {/* 4. Recommended Visualizations Canvas (PRD Section 7.5) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Recommended Visualizations
            </h2>
            <Badge variant="outline" className="text-[10px]">
              ECharts Engine
            </Badge>
          </div>
          <span className="text-xs text-slate-400">
            Interactive charts with accessible data table toggle
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {visualWidgets.map((spec) => {
            const isFullSpan = spec.gridSpan === "full";
            return (
              <div
                key={spec.id}
                className={isFullSpan ? "col-span-1 lg:col-span-2" : "col-span-1"}
              >
                <WidgetCard spec={spec} rows={rows} />
              </div>
            );
          })}
        </div>
      </section>

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
