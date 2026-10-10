import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  UploadCloud,
  FileSpreadsheet,
  FolderOpen,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Boxes,
  Users,
} from "lucide-react";
import { BRAND } from "@/lib/constants/brand";

export default function WorkspaceHome() {
  const featuredTemplates = [
    {
      title: "Sales MIS Dashboard",
      desc: "Revenue by region, average deal size, sales rep leaderboard, and month-over-month growth.",
      icon: TrendingUp,
      rows: 1420,
      href: "/app/templates#sales",
    },
    {
      title: "Inventory & Stock Status",
      desc: "Stock on hand, reorder alerts, warehouse turnover rate, and inventory valuation.",
      icon: Boxes,
      rows: 850,
      href: "/app/templates#inventory",
    },
    {
      title: "HR Headcount & Attendance",
      desc: "Department headcount breakdown, attendance percentages, overtime hours, and turnover.",
      icon: Users,
      rows: 420,
      href: "/app/templates#hr",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 p-6 sm:p-8 dark:border-slate-800 dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-950 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="accent" className="gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Workspace Ready</span>
              </Badge>
              <Badge variant="success" className="gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Local-First</span>
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Welcome to {BRAND.name}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload your Excel or CSV dataset to start profiling fields and generating an executive MIS dashboard. All processing happens right here in your browser.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link href="/app/new">
              <Button size="lg" className="w-full sm:w-auto gap-2 shadow-md shadow-indigo-500/20">
                <UploadCloud className="w-4 h-4" />
                Upload Spreadsheet
              </Button>
            </Link>
            <Link href="/app/templates">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Browse Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Empty State / Quick Start & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Workspace / Ingestion Action */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Active Session
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Browser Storage: Connected
            </span>
          </div>

          {/* Genuine Empty State (Per PRD Section 6 & 18: No fake charts with hardcoded numbers) */}
          <EmptyState
            icon={<UploadCloud className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />}
            title="No Dataset Loaded in Memory"
            description="To generate an executive dashboard, upload a supported CSV or XLSX file, or load one of our ready-to-use business templates."
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href="/app/new">
                  <Button className="gap-2">
                    <UploadCloud className="w-4 h-4" />
                    Upload File
                  </Button>
                </Link>
                <Link href="/app/templates">
                  <Button variant="outline" className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Try Sample Dataset
                  </Button>
                </Link>
              </div>
            }
          />

          {/* Saved Reports Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Locally Saved Reports
              </h3>
            </div>
            <Card className="p-6 text-center text-sm text-slate-500 dark:text-slate-400 border-dashed">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p>No reports saved in this browser yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Saved reports remain in your browser’s IndexedDB storage and are never uploaded to the cloud.
              </p>
            </Card>
          </div>
        </div>

        {/* Right Col: Quick MIS Templates */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              MIS Templates
            </h2>
            <Link
              href="/app/templates"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All 7</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {featuredTemplates.map((t) => {
              const Icon = t.icon;
              return (
                <Link key={t.title} href={t.href} className="block group">
                  <Card className="p-4 transition-all hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                            {t.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {t.rows} rows
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {t.desc}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Privacy Guarantee Card */}
          <Card className="p-5 bg-slate-900 text-white dark:bg-slate-900/90 border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Telemetry Security</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              OpenMIS performs all file parsing in your browser via Web Workers. No file rows or column headers are sent to our servers.
            </p>
            <div className="pt-1">
              <Link
                href="/privacy"
                className="text-xs font-medium text-indigo-300 hover:text-white underline"
              >
                Learn how your privacy is protected →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
