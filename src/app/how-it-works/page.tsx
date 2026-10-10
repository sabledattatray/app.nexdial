import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  UploadCloud,
  Search,
  Sparkles,
  BarChart3,
  Download,
  ArrowRight,
  Cpu,
  Layers,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "How It Works | OpenMIS Architecture & Workflow",
  description:
    "Learn how OpenMIS parses spreadsheets, computes deterministic metrics, and renders executive MIS dashboards 100% inside your browser.",
  alternates: {
    canonical: "https://openmis.dev/how-it-works",
  },
  openGraph: {
    title: "How OpenMIS Works | Client-Side Architecture",
    description:
      "A step-by-step walkthrough of how OpenMIS transforms messy spreadsheets into interactive dashboards without sending a single byte to the cloud.",
    url: "https://openmis.dev/how-it-works",
  },
};

export default function HowItWorksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Build an MIS Dashboard from an Excel Spreadsheet in OpenMIS",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Upload Spreadsheet",
        text: "Select a CSV or XLSX workbook. Parsing executes inside a browser Web Worker with zero network transmission.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Inspect Data Profile & Clean",
        text: "Review automated type inference and missing value rates. Apply reversible whitespace trimming or row filters.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Automatic Metric & Insight Computation",
        text: "Deterministic engine computes KPIs, variance to target, MoM growth, and category dominance metrics.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Customize Dashboard Canvas",
        text: "Rearrange widgets, toggle chart types (Bar, Line, Area, Donut), adjust sort criteria, and apply global filters.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Export & Save Locally",
        text: "Download sanitized CSV/XLSX files immune to formula injection, print executive PDFs, or save to browser IndexedDB.",
      },
    ],
  };

  const steps = [
    {
      step: "01",
      icon: UploadCloud,
      title: "Local Ingestion & Web Worker Parsing",
      description:
        "When you select an Excel or CSV file, OpenMIS creates a dedicated browser Web Worker. Using SheetJS CE and PapaParse, the worker parses the binary buffer directly into an array of typed objects.",
      technicalNote:
        "Technical detail: The file never leaves your computer's RAM. No network requests (POST/PUT) are made, providing airtight confidentiality for sensitive financial or payroll spreadsheets.",
    },
    {
      step: "02",
      icon: Search,
      title: "Automated Data Profiler & Reversible Cleaning",
      description:
        "OpenMIS scans the first 1,000+ rows to detect data types (Number, Categorical, Date, Boolean, Identifier), missing value ratios, and cardinality. You can trim whitespace or deduplicate rows with full undo/redo capability.",
      technicalNote:
        "Technical detail: The raw dataset is kept in an immutable snapshot (`rawSnapshot`), while all cleaning operations are stored as an auditable transformation stack.",
    },
    {
      step: "03",
      icon: Sparkles,
      title: "Deterministic Insights & KPI Engine",
      description:
        "OpenMIS executes mathematical analysis to derive totals, averages, MoM growth rates, and category concentrations. It detects statistical outliers via IQR without relying on unpredictable AI hallucination.",
      technicalNote:
        "Technical detail: All growth calculations utilize `safeDivide` zero-denominator guards to eliminate #DIV/0! errors common in traditional spreadsheets.",
    },
    {
      step: "04",
      icon: BarChart3,
      title: "Automatic Visualization & Visual Inspector",
      description:
        "Based on data cardinality and temporal fields, OpenMIS automatically generates an executive dashboard canvas with Apache ECharts. Every widget features an accessible 'Switch to Data Table' toggle.",
      technicalNote:
        "Technical detail: You can modify chart dimensions, measures, aggregations, sort orders, and color palettes via the built-in Widget Inspector panel.",
    },
    {
      step: "05",
      icon: Download,
      title: "Export Sanitization & Local Persistence",
      description:
        "When you are ready to present or archive, export filtered CSVs, XLSX spreadsheets, or print-ready executive PDFs. Report definitions can be saved to browser IndexedDB or exported as portable JSON.",
      technicalNote:
        "Technical detail: Our automated formula sanitizer neutralizes CSV DDE formula injection by automatically escaping characters like `=`, `+`, `-`, and `@` with a leading apostrophe.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <Layers className="w-3.5 h-3.5" />
              <span>Transparent Architecture</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              How OpenMIS Works
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From raw spreadsheet ingestion to interactive executive dashboard — a transparent, 100% client-side pipeline.
            </p>
          </div>
        </section>

        {/* Visual Architecture Diagram */}
        <section className="py-12 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Browser Sandbox Execution Boundary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">1. File Input</div>
                  <div className="text-[11px] text-slate-500 mt-1">Local RAM buffer</div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200">2. Web Worker</div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">PapaParse / SheetJS</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">3. Metrics Engine</div>
                  <div className="text-[11px] text-slate-500 mt-1">Deterministic math</div>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                  <div className="font-bold text-indigo-900 dark:text-indigo-200">4. ECharts Canvas</div>
                  <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1">Reactive UI Grid</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-900 dark:text-white">5. Local Storage</div>
                  <div className="text-[11px] text-slate-500 mt-1">IndexedDB / Safe Export</div>
                </div>
              </div>
              <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 italic">
                * Zero server transmission at all steps. No API endpoints receive your data.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Steps */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div key={idx} className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-md">
                  {st.step}
                </div>
                <div className="flex-1 space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    {st.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.description}
                  </p>
                  <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.technicalNote}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl font-extrabold">Experience the Pipeline Now</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Test it with your own spreadsheet or load one of our 7 fictional MIS business templates.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg">
                  Upload Your File
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/app/templates">
                <Button size="lg" variant="outline" className="text-white border-slate-700 hover:bg-slate-800">
                  Browse Templates
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
