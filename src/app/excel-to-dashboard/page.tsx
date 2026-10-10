import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FileSpreadsheet,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildSoftwareAppSchema,
} from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  title: "Free Excel to Dashboard Generator | OpenMIS",
  description:
    "Convert Excel spreadsheets (.xlsx, .xls) into interactive business dashboards in minutes. 100% browser-side, zero cloud uploads, and ₹0 budget required.",
  alternates: {
    canonical: `${BRAND.url}/excel-to-dashboard`,
  },
  openGraph: {
    title: "Free Excel to Dashboard Generator | OpenMIS",
    description:
      "Turn your Excel workbooks into executive MIS dashboards without Power BI or cloud subscriptions. 100% private and runs locally.",
    url: `${BRAND.url}/excel-to-dashboard`,
  },
};

export default function ExcelToDashboardPage() {
  const faqs = [
    {
      q: "Does OpenMIS support multi-sheet Excel files?",
      a: "Yes. When you upload an .xlsx workbook with multiple worksheets, OpenMIS provides an interactive sheet selector, allowing you to choose which tab to profile and visualize.",
    },
    {
      q: "Are my Excel formulas evaluated?",
      a: "OpenMIS reads the evaluated cached values stored inside the XLSX file by SheetJS CE. Raw formula definitions that rely on external linked workbooks are not dynamically recomputed.",
    },
    {
      q: "What is the file size limit for Excel uploads?",
      a: "Files up to 50MB are supported. Because all parsing happens in your browser RAM, workbooks up to 100,000 rows yield the smoothest interactive responsiveness.",
    },
  ];

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Excel to Dashboard", path: "/excel-to-dashboard" },
  ]);

  const faqLd = buildFaqSchema(faqs);

  const softwareLd = buildSoftwareAppSchema({
    name: "OpenMIS Excel to Dashboard Generator",
    description: "Convert Excel workbooks into executive dashboards inside the browser.",
    path: "/excel-to-dashboard",
  });

  const jsonLd = [breadcrumbLd, faqLd, softwareLd];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Client-Side • Excel Workbooks (.xlsx, .xls)</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Turn Excel Spreadsheets Into Interactive Dashboards
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload your Excel workbook and automatically generate executive KPIs, charts, and deterministic business summaries without learning complex BI software or paying monthly subscriptions.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 text-base">
                  <UploadCloud className="w-5 h-5" />
                  Upload Excel File Now
                </Button>
              </Link>
              <Link href="/app/templates?load=sales_mis">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <FileSpreadsheet className="w-5 h-5" />
                  Try With Sample Excel Data
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* The Problem & Solution */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="outline">The Problem</Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Trapped in Static Excel Tables
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Excel is great for data entry, but presenting monthly reports to executives often requires building manual pivot tables, copying charts into PowerPoint, and re-linking broken formula ranges. Enterprise alternatives like Power BI require steep training and expensive recurring licenses.
              </p>
            </div>

            <div className="space-y-4">
              <Badge variant="outline">The OpenMIS Solution</Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Instant, Factual Visualization
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                OpenMIS parses your Excel file locally, identifies dates and numerical values, computes verifiable totals, and constructs an interactive executive dashboard in seconds. You can customize widgets, apply filters, and print board-ready reports.
              </p>
            </div>
          </div>

          {/* Sample Dashboard Preview Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm">Example: Sales_Q3_Report.xlsx</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Synthetic Sample Walkthrough
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Total Invoiced Volume</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">$1,248,500</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">+14.2% vs previous period</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Gross Margin %</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">36.8%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Safe-divide calculated</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Category Dominance</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">Top 3 = 64%</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">Concentration alert</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
              All charts feature accessible data tables and anti-formula injection export protection.
            </p>
          </Card>

          {/* How Calculations Work */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Transparent Mathematical Calculations
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              OpenMIS uses pure mathematical functions for all analytics. Totals use exact summation, period growth uses verified formulas with zero-denominator safeguards (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">safeDivide</code>), and distributions calculate IQR boundaries. Every widget includes an evidentiary calculation modal showing exactly how values were derived.
            </p>
          </div>

          {/* FAQs */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((f, idx) => (
                <Card key={idx} className="p-4 border-slate-200 dark:border-slate-800 space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{f.q}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{f.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Guides */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Need help preparing your Excel sheets? Read our guide:
            </div>
            <Link
              href="/guides/clean-excel-data"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              How to Clean Dirty Spreadsheet Data <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-14 text-center space-y-4">
          <h2 className="text-2xl font-bold">Build Your Free Excel Dashboard in 60 Seconds</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            No signup. No credit card. 100% private in your browser.
          </p>
          <div className="pt-2">
            <Link href="/app/new">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Launch Excel Dashboard Builder
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
