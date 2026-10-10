"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  UploadCloud,
  FileSpreadsheet,
  ShieldCheck,
  Info,
  ArrowLeft,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { BRAND } from "@/lib/constants/brand";
import { ingestSpreadsheetFile, ParseProgress } from "@/lib/parsers/parser-service";
import { inspectXlsxWorkbook } from "@/lib/parsers/xlsx-parser";
import { useDataset } from "@/context/DatasetContext";

function NewUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoadedDataset } = useDataset();

  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<ParseProgress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-sheet dialog state
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [sheetModalOpen, setSheetModalOpen] = useState(false);

  // Process file
  const processFile = React.useCallback(
    async (file: File, sheetName?: string) => {
      setErrorMessage(null);
      try {
        // Check if XLSX has multiple sheets and no sheet was selected yet
        if (file.name.toLowerCase().endsWith(".xlsx") && !sheetName) {
          const buffer = await file.arrayBuffer();
          const info = inspectXlsxWorkbook(buffer);
          if (info.sheetNames.length > 1) {
            setPendingFile(file);
            setSheetNames(info.sheetNames);
            setSheetModalOpen(true);
            return;
          }
        }

        const result = await ingestSpreadsheetFile(file, {
          sheetName,
          onProgress: (p) => setProgress(p),
        });

        setLoadedDataset(result.profile, result.rows, result.rawSnapshot);
        router.push("/app/data");
      } catch (err: unknown) {
        setProgress(null);
        setErrorMessage(
          err instanceof Error ? err.message : "An unexpected error occurred while parsing."
        );
      }
    },
    [router, setLoadedDataset]
  );

  // Handle template pre-selection
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (!templateParam) return;

    const templateMap: Record<string, string> = {
      sales: "/sample-data/sales-mis.csv",
      finance: "/sample-data/finance-expense.csv",
      inventory: "/sample-data/inventory-stock.csv",
      hr: "/sample-data/hr-attendance.csv",
      operations: "/sample-data/operations-sla.csv",
      marketing: "/sample-data/marketing-campaigns.csv",
      project: "/sample-data/project-tasks.csv",
    };

    const path = templateMap[templateParam];
    if (!path) return;

    let isSubscribed = true;
    const loadTemplate = async () => {
      try {
        if (!isSubscribed) return;
        setProgress({
          stage: "reading",
          percentage: 20,
          message: `Loading synthetic ${templateParam} sample dataset...`,
        });

        const res = await fetch(path);
        const blob = await res.blob();
        if (!isSubscribed) return;
        const sampleFile = new File([blob], `${templateParam}-sample.csv`, {
          type: "text/csv",
        });
        await processFile(sampleFile);
      } catch (err: unknown) {
        if (!isSubscribed) return;
        setErrorMessage(
          "Failed to load sample dataset: " + (err instanceof Error ? err.message : String(err))
        );
        setProgress(null);
      }
    };

    loadTemplate();

    return () => {
      isSubscribed = false;
    };
  }, [searchParams, processFile]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button & Title */}
      <div className="space-y-2">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Upload Dataset
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select or drop your spreadsheet. Files are processed entirely inside your browser.
            </p>
          </div>
          <Badge variant="success" className="gap-1 hidden sm:inline-flex">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero Network Transfer</span>
          </Badge>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Import Error</p>
            <p className="mt-0.5 text-rose-700 dark:text-rose-300">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Zone or Active Progress */}
      {progress ? (
        <Card className="p-8 sm:p-12 text-center border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto animate-pulse">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {progress.message}
          </h3>
          <div className="w-full max-w-md mx-auto bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Parsing offloaded to client thread • Your data never leaves your computer
          </p>
        </Card>
      ) : (
        <Card className="p-8 sm:p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 transition-all text-center">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center space-y-4 ${
              dragOver ? "opacity-75 scale-[0.99] bg-indigo-50/40 rounded-xl p-4" : ""
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Drag and drop your spreadsheet here
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Supports <strong>.csv</strong> and <strong>.xlsx</strong> workbooks
              </p>
            </div>

            <div className="pt-2">
              <input
                type="file"
                id="file-upload"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="primary"
                  size="lg"
                  className="cursor-pointer gap-2"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <UploadCloud className="w-4 h-4" />
                  Browse from Device
                </Button>
              </label>
            </div>

            {/* Explicit Limits Notice per PRD 7.1 & 11 */}
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pt-4">
              <Info className="w-3.5 h-3.5" />
              <span>
                Configured limit: Max {BRAND.limits.maxFileSizeMb}MB • Recommended under{" "}
                {BRAND.limits.maxRecommendedRows.toLocaleString()} rows for optimum speed
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Or Load Template Banner */}
      <Card className="p-6 bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Don&apos;t have a file ready right now?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try one of our 7 verified business MIS templates with synthetic sample data.
            </p>
          </div>
        </div>
        <Link href="/app/templates" className="shrink-0 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            Browse Sample Datasets
          </Button>
        </Link>
      </Card>

      {/* Security and Privacy Assurance */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Your Data Privacy Is Guaranteed</p>
          <p className="text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
            Unlike commercial BI tools that upload your spreadsheets to remote multi-tenant clouds, OpenMIS executes parsing and formulas entirely in your browser&apos;s Web Worker thread.
          </p>
        </div>
      </div>

      {/* Multi-Sheet Selection Modal (PRD Section 7.1) */}
      <Modal
        isOpen={sheetModalOpen}
        onClose={() => setSheetModalOpen(false)}
        title="Select Worksheet"
        description="This workbook contains multiple sheets. Choose which sheet you want to profile and report on."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sheetNames.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setSheetModalOpen(false);
                  if (pendingFile) processFile(pendingFile, name);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-indigo-950/40 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {name}
                  </span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function NewReportUploadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading upload wizard...</div>}>
      <NewUploadContent />
    </Suspense>
  );
}
