"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  UploadCloud,
  FileSpreadsheet,
  ShieldCheck,
  Info,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { BRAND } from "@/lib/constants/brand";

export default function NewReportUploadPage() {
  const [dragOver, setDragOver] = useState(false);

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

      {/* Main Upload Dropzone Shell (Active Ingestion Wireframe for Phase 2) */}
      <Card className="p-8 sm:p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 transition-all text-center">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={`flex flex-col items-center justify-center space-y-4 ${
            dragOver ? "opacity-75 scale-[0.99]" : ""
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
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  alert(
                    `File selected: ${e.target.files[0].name}. Full worker parsing pipeline will activate in Phase 2.`
                  );
                }
              }}
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
    </div>
  );
}
