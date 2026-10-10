import React from "react";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { GitCommit, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog & Product Releases | OpenMIS",
  description:
    "Track updates, features, improvements, and releases for the OpenMIS client-side dashboard builder.",
  alternates: {
    canonical: "https://openmis.dev/changelog",
  },
};

const RELEASES = [
  {
    version: "v1.0.0",
    date: "October 10, 2026",
    title: "Initial Production Release — OpenMIS Core Platform",
    badge: "Latest Release",
    description:
      "The initial full release of OpenMIS, delivering complete browser-first spreadsheet ingestion, automatic data profiling, reversible transformations, deterministic KPI analytics, interactive ECharts canvas, visual report editor, anti-DDE export sanitization, and 7 business MIS templates.",
    highlights: [
      "Client-side CSV and XLSX parser executing inside HTML5 Web Workers with zero cloud uploads.",
      "Automated Data Profiler with type inference (Number, Date, Categorical, Boolean, Identifier) and missing-rate detection.",
      "Reversible Data Cleaning Engine with trim, deduplication, row filters, and full undo/redo stack.",
      "Deterministic Insights Engine computing category concentrations, IQR outliers, and period growth with zero-divide protection.",
      "Apache ECharts Canvas with responsive resizing and accessible data table toggles on all widgets.",
      "Visual Report Editor with Widget Inspector panel, custom measures/dimensions, sort criteria, and color themes.",
      "Full local persistence in browser IndexedDB (openmis-db) and portable versioned ReportDefinitionSchema v1.0.0 JSON import/export.",
      "Formula Injection (DDE) Sanitizer escaping =, +, -, @, \\t, \\r characters on CSV/XLSX downloads.",
      "7 Production MIS Templates with synthetic datasets: Sales, Finance, Inventory, HR, Operations, Marketing, and Projects.",
      "Print-friendly executive stylesheet (@media print) for board-ready PDF generation.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <MarketingHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <GitCommit className="w-3.5 h-3.5" />
              <span>Continuous Progress</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Changelog & Release Notes
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Complete history of releases, new features, and security hardening in OpenMIS.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-10">
            {RELEASES.map((rel, idx) => (
              <Card key={idx} className="p-6 sm:p-8 border-slate-200/80 dark:border-slate-800 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{rel.version}</span>
                    <Badge variant="default" className="text-xs bg-indigo-600 text-white">
                      {rel.badge}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Released {rel.date}
                  </span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">{rel.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rel.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Included Features & Enhancements
                  </h3>
                  <ul className="space-y-2">
                    {rel.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
