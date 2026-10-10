import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Cpu,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Undo2,
  Lock,
  Layers,
  SlidersHorizontal,
  Table,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  title: "Features & Technical Capabilities | OpenMIS",
  description:
    "Explore OpenMIS features: 100% browser-side parsing, automated data profiler, reversible cleaning, deterministic analytics, ECharts canvas, and formula injection defense.",
  alternates: {
    canonical: `${BRAND.url}/features`,
  },
  openGraph: {
    title: "Features & Architecture | OpenMIS",
    description:
      "Client-side spreadsheet intelligence with zero cloud telemetry, deterministic math, and customizable executive dashboards.",
    url: `${BRAND.url}/features`,
  },
};

export default function FeaturesPage() {
  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
  ]);

  const jsonLd = [
    breadcrumbLd,
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: BRAND.appName,
      operatingSystem: "Any (Web Browser)",
      applicationCategory: "BusinessApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Client-Side CSV & XLSX Parsing",
        "Automated Data Profiler and Type Inference",
        "Reversible Data Cleaning with Undo/Redo",
        "Deterministic Mathematical KPI Engine",
        "Responsive ECharts Visualization Canvas",
        "DDE Formula Injection Sanitization",
        "Local IndexedDB Persistence",
      ],
    },
  ];

  const featureBlocks = [
    {
      icon: Cpu,
      title: "100% Browser-Side Processing",
      subtitle: "Web Worker Ingestion",
      description:
        "CSV and Excel workbooks are parsed inside your browser using dedicated Web Workers. File content never traverses the public internet or external API gateways.",
      points: [
        "Runs on user's device with zero server dependency",
        "SheetJS CE & PapaParse parsing in worker thread",
        "Multi-sheet Excel workbook tab selector",
        "Configurable CSV delimiter overrides (comma, tab, semicolon)",
      ],
    },
    {
      icon: Table,
      title: "Automated Data Profiler",
      subtitle: "Instant Quality Diagnostics",
      description:
        "Immediately highlights null values, distinct cardinalities, min/max distributions, and identifies field types (Number, Categorical, Date, Boolean, Identifier).",
      points: [
        "Identifies missing value percentage per column",
        "Detects potential primary keys and dimensions",
        "Column data type override with 1 click",
        "Calculates mean, median, min, max for numeric fields",
      ],
    },
    {
      icon: Undo2,
      title: "Reversible Data Cleaning Engine",
      subtitle: "Auditable Transformations",
      description:
        "Clean dirty data without corrupting your raw file. OpenMIS maintains an immutable snapshot and a reversible stack of operations.",
      points: [
        "Trim whitespace to consolidate fragmented groups",
        "Deduplicate identical rows",
        "Filter noise rows by numeric or text thresholds",
        "Full Undo/Redo stack with transformation history",
      ],
    },
    {
      icon: Sparkles,
      title: "Deterministic Business Insights",
      subtitle: "Traceable, Factual Analytics",
      description:
        "No hallucinated AI summaries. Insights are generated from pure mathematical rules and verified distributions.",
      points: [
        "Top-N category concentration (e.g. Top 3 categories drive 68% volume)",
        "Outlier detection using Interquartile Range (IQR)",
        "Growth and decline velocity with MoM and YoY formulas",
        "Evidentiary calculation modal explaining every formula",
      ],
    },
    {
      icon: BarChart3,
      title: "Apache ECharts Visual Canvas",
      subtitle: "Responsive Executive Visuals",
      description:
        "Automatic visualization engine maps your fields to Bar, Line, Area, Donut, Scatter, and Metric cards based on statistical cardinality.",
      points: [
        "Accessible table view toggle on every single widget",
        "Fluid resize observer with auto-scaling layout",
        "Color palette themes (Corporate, Ocean, Emerald, Amber)",
        "Top-N grouping with automatic 'Other' rollup",
      ],
    },
    {
      icon: SlidersHorizontal,
      title: "Visual Report Inspector",
      subtitle: "Customizable Layouts",
      description:
        "Customize every widget title, dimension, measure, aggregation type (SUM, AVG, MIN, MAX, COUNT), sort order, and color scheme.",
      points: [
        "Global dashboard filters (date range, categories)",
        "Widget-level override filters",
        "Reorder, duplicate, or remove widgets with keyboard access",
        "Auto-saved state to IndexedDB with JSON export",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Export Sanitization (Anti-DDE)",
      subtitle: "Enterprise-Grade File Security",
      description:
        "Guards against Dynamic Data Exchange (DDE) formula injection by escaping dangerous characters (=, +, -, @, \\t, \\r) before writing CSV or XLSX files.",
      points: [
        "Automatic apostrophe prefixing for dangerous formula cells",
        "Preserves legitimate negative numbers (-42) and positives",
        "Filtered dataset download honoring active canvas filters",
        "Clean print-ready CSS for boardroom PDF reports",
      ],
    },
    {
      icon: Lock,
      title: "Zero Telemetry & Strict Privacy",
      subtitle: "Permanent ₹0 Budget Guarantee",
      description:
        "No hidden SaaS subscriptions, compulsory logins, or tracking pixels. All data stays confined to your browser session.",
      points: [
        "Zero tracking cookies or third-party ad scripts",
        "Local IndexedDB storage for offline report access",
        "1-Click 'Clear Data' memory and cache wipe",
        "Permissive MIT open-source license",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <Layers className="w-3.5 h-3.5" />
              <span>Engineered for Reliability</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Powerful Spreadsheet Intelligence.{" "}
              <span className="text-indigo-600 dark:text-indigo-400">Zero Cloud Ingestion.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to turn dirty spreadsheets into executive dashboards without enterprise subscriptions, cloud latency, or data privacy risks.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Try Live Dashboard Builder
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featureBlocks.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card
                  key={idx}
                  className="p-8 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {feat.subtitle}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{feat.title}</h2>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {feat.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Bar */}
        <section className="bg-slate-900 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-3xl font-extrabold">Ready to Build Your First Report?</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              No account creation or card required. Open the workspace, drop your spreadsheet, and get your executive summary in seconds.
            </p>
            <div className="pt-2">
              <Link href="/app/new">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shadow-lg">
                  Launch Free Workspace
                  <ArrowRight className="w-4 h-4" />
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
