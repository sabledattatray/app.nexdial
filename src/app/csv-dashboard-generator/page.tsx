import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  UploadCloud,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Instant CSV Dashboard Generator | OpenMIS",
  description:
    "Generate business dashboards from CSV files in seconds. Automatic delimiter detection, data profiling, deterministic metrics, and anti-formula injection export protection.",
  alternates: {
    canonical: "https://openmis.dev/csv-dashboard-generator",
  },
  openGraph: {
    title: "Instant CSV Dashboard Generator | OpenMIS",
    description:
      "Transform plain CSV exports into executive dashboards right in your browser. 100% private, free, and open source.",
    url: "https://openmis.dev/csv-dashboard-generator",
  },
};

export default function CSVDashboardGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OpenMIS CSV Dashboard Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Generate executive dashboards from CSV exports inside the browser.",
  };

  const faqs = [
    {
      q: "Does OpenMIS handle different CSV delimiters?",
      a: "Yes. PapaParse automatically detects comma, semicolon, tab, or pipe delimiters. You can also manually override the delimiter if your export uses a custom separator.",
    },
    {
      q: "Can large CSV exports crash my browser?",
      a: "OpenMIS runs CSV parsing in a dedicated HTML5 Web Worker off the main UI thread. For smooth interactive visualization, files up to 50MB and 100,000 rows are recommended.",
    },
    {
      q: "Is CSV formula injection (DDE) prevented?",
      a: "Yes. When you export or clean CSV files, OpenMIS inspects every cell string and prepends an apostrophe (') to any cell starting with =, +, -, @, \\t, or \\r, neutralizing spreadsheet execution risks.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Comma, Tab & Semicolon Delimited CSV Files</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Instant CSV Dashboard Generator
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Exported a CSV from your database, CRM, or Stripe? Drop it into OpenMIS to get executive charts, summary KPIs, and data profiling without sending rows across the web.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 text-base">
                  <UploadCloud className="w-5 h-5" />
                  Upload CSV File
                </Button>
              </Link>
              <Link href="/app/templates?load=marketing_campaign">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <FileText className="w-5 h-5" />
                  Try With Sample CSV Data
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Deep Dive Content */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="outline">The Problem</Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Raw CSV Exports Are Hard to Read
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Database dumps and SaaS exports produce raw CSVs containing thousands of lines of unformatted text. Reviewing them requires manually importing into spreadsheets, formatting headers, creating pivot tables, and fixing misaligned columns.
              </p>
            </div>

            <div className="space-y-4">
              <Badge variant="outline">The OpenMIS Solution</Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Web Worker Streaming & Auto-Profiling
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                OpenMIS parses the CSV in a background Web Worker, detects delimiters automatically, detects data types, profiles missing value rates, and generates interactive ECharts visuals with zero wait time and strict confidentiality.
              </p>
            </div>
          </div>

          {/* Sample Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm">Example: payments_export_oct.csv</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Automatic Delimiter Detection (Comma)
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Total Transactions</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">4,812 Rows</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">0% Missing Rate</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Average Ticket Size</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">$128.40</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Numeric Mean</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Payment Gateways</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">4 Channels</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">Donut Distribution</div>
              </div>
            </div>
          </Card>

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
              Learn about formula injection prevention in CSV files:
            </div>
            <Link
              href="/guides/prevent-spreadsheet-errors"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              Preventing DDE Formula Injection <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-14 text-center space-y-4">
          <h2 className="text-2xl font-bold">Generate a CSV Dashboard in Seconds</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Drop your CSV file into OpenMIS. No software installation needed.
          </p>
          <div className="pt-2">
            <Link href="/app/new">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Open CSV Dashboard Builder
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
