import React from "react";
import Link from "next/link";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  UploadCloud,
  ShieldCheck,
  Cpu,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <MarketingHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(9,13,22,0))]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Privacy & Free Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/70 text-indigo-800 dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-200 text-xs font-semibold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Browser-Side Processing • Zero Data Transmitted</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                Turn Spreadsheets Into Business Dashboards{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                  in Minutes.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Upload your CSV or Excel workbook and instantly get executive KPIs, charts, and deterministic business insights without learning Power BI or paying for subscriptions.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/app/new" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-indigo-500/25 text-base px-7">
                    <UploadCloud className="w-5 h-5" />
                    Create Free Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/app/templates" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base px-6">
                    <FileSpreadsheet className="w-5 h-5" />
                    Explore MIS Templates
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  No Sign-Up or Credit Card
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  100% Private (Runs Locally)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Deterministic, Traceable Math
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Free & Open Source (MIT)
                </span>
              </div>
            </div>

            {/* Dashboard Mockup / Interactive Canvas Preview */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-6 shadow-2xl shadow-indigo-950/5 dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Sample Sales MIS Report • 1,420 rows
                  </span>
                </div>
                <Badge variant="success" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Local In-Memory
                </Badge>
              </div>

              {/* KPI Grid Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    $482,910
                  </p>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+14.2% vs previous period</span>
                  </div>
                </Card>

                <Card className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    1,420
                  </p>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    <span>Formula: COUNT(order_id)</span>
                  </div>
                </Card>

                <Card className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    $340.08
                  </p>
                  <div className="text-xs text-slate-400 font-medium mt-1">
                    <span>Formula: AVG(sale_amount)</span>
                  </div>
                </Card>

                <Card className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Top Category
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                    Enterprise
                  </p>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    <span>42.8% of Total Volume</span>
                  </div>
                </Card>
              </div>

              {/* Sample Chart Banner */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-950 flex flex-col items-center justify-center py-10 space-y-3">
                <BarChart3 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Ready to test with your own spreadsheet?
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                  Upload any CSV or XLSX file right now to generate this interactive dashboard completely on your device.
                </p>
                <Link href="/app/new" className="pt-2">
                  <Button className="gap-2">
                    <UploadCloud className="w-4 h-4" />
                    Load Your Spreadsheet
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="accent">Simple 4-Step Workflow</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                From Raw Sheet to Executive Report
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                No complex data engineering required. OpenMIS analyzes your column headers and distributions automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                  Drag & Drop File
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Support for multi-sheet `.xlsx` workbooks and `.csv` files. Files are parsed inside a browser Web Worker.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                  Automatic Profiling
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Detects dates, categories, numeric measures, and identifiers. Flags missing values and duplicate rows.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                  Instant Dashboard
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Calculates executive KPIs and recommends relevant charts (time series, category bars, donuts, scatter).
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                  Customize & Export
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Filter dimensions, adjust widget layouts, and export to sanitized CSV, XLSX, or print-ready PDF reports.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CORE PILLARS / FEATURES */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="secondary">Engineered for Trust</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Built Around Privacy, Math, and Practicality
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 space-y-3">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Privacy-First by Design
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Most online BI tools upload your files to remote servers. OpenMIS runs 100% in your browser. No telemetry of your cell contents or customer records.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <Cpu className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Deterministic Analytics
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Zero black-box AI hallucinations. Every KPI shows its transparent formula (Sum, Average, MoM variance) with verified calculations you can trust.
                </p>
              </Card>

              <Card className="p-6 space-y-3">
                <Download className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Safe Exports & Sanitization
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Export filtered rows or download print-ready PDF reports. All CSV exports automatically sanitize formula injection characters (`=`, `+`, `@`).
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* PRIVACY SECTION */}
        <section id="privacy" className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Data Telemetry Policy</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Your Business Spreadsheets Stay on Your Device
            </h2>
            <p className="max-w-2xl mx-auto text-slate-300 text-base leading-relaxed">
              We never store your customer lists, salary sheets, financial rows, or column names on any cloud server. The core parsing engine operates in your browser memory and IndexedDB.
            </p>
            <div className="pt-2">
              <Link href="/privacy">
                <Button variant="secondary" className="gap-2">
                  Read Our Privacy Model
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
