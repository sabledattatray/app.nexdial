import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  UploadCloud,
  Printer,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Free MIS Report Generator & Dashboard Builder | OpenMIS",
  description:
    "Generate executive Management Information System (MIS) reports from spreadsheets. Print-ready boardroom PDF exports, KPI rollups, and zero software licensing cost.",
  alternates: {
    canonical: "https://openmis.dev/free-mis-report-generator",
  },
  openGraph: {
    title: "Free MIS Report Generator | OpenMIS",
    description:
      "Automate monthly and weekly MIS reports without expensive corporate BI licenses. 100% private, free, and open source.",
    url: "https://openmis.dev/free-mis-report-generator",
  },
};

export default function FreeMISReportGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OpenMIS Free MIS Report Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Executive MIS report and summary builder running client-side in the browser.",
  };

  const faqs = [
    {
      q: "What makes OpenMIS ideal for MIS executives?",
      a: "MIS analysts often spend hours every week reformatting Excel columns and manually copying charts into PowerPoint. OpenMIS automates data profiling, calculates variance to target and growth velocity, and formats a clean print-ready report in minutes.",
    },
    {
      q: "Can I print or save MIS reports as PDF?",
      a: "Yes. OpenMIS features a dedicated executive print stylesheet (@media print). Clicking Print or Export PDF produces a paginated, boardroom-ready report without browser navigation artifacts.",
    },
    {
      q: "Can I save custom MIS report layouts for recurring weekly reports?",
      a: "Yes. Save your configured report layout in local IndexedDB or export it as a JSON file. Next week, load your new spreadsheet and apply the saved report definition in 1 click.",
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Free Executive MIS Reporting • ₹0 Software Budget</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Free MIS Report Generator & Executive Summary Builder
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Create professional weekly and monthly Management Information System (MIS) reports from raw Excel spreadsheets. Verifiable KPIs, transparent formulas, and boardroom PDF exports.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 text-base">
                  <UploadCloud className="w-5 h-5" />
                  Generate MIS Report
                </Button>
              </Link>
              <Link href="/app/templates?load=operations_sla">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <Printer className="w-5 h-5" />
                  View Sample MIS Report
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <Badge variant="outline">The Challenge</Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Hours Wasted on Manual Weekly Reporting
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                MIS teams spend countless hours downloading ERP dumps, removing duplicate rows, standardizing dates, building pivot tables, and manually drafting variance commentary. If a single formula breaks, executive trust is eroded.
              </p>
            </div>

            <div className="space-y-4">
              <Badge variant="outline">The Solution</Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Deterministic Automation & Auditable Calculations
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                OpenMIS removes the repetitive friction. Upload your raw spreadsheet, apply one-click reversible cleaning operations (trim, deduplicate, filter), and generate verified executive summaries with zero cloud transmission.
              </p>
            </div>
          </div>

          {/* Sample Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm">Operations & SLA Performance MIS</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Weekly Executive Review
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Total SLA Compliance</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">94.8%</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">+2.4% vs SLA target</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Mean Turnaround Time</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">4.2 Hours</div>
                <div className="text-[11px] text-slate-400 mt-0.5">IQR Outliers detected: 3</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Volume by Shift</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">1,820 Tasks</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">Day shift dominates 58%</div>
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
              Explore how to choose the right chart types for your MIS:
            </div>
            <Link
              href="/guides/choose-chart-types"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              Guide to Choosing Chart Types <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-14 text-center space-y-4">
          <h2 className="text-2xl font-bold">Generate Board-Ready MIS Reports Today</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            100% free forever under MIT. No signup or credit card required.
          </p>
          <div className="pt-2">
            <Link href="/app/new">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Launch Free MIS Generator
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
