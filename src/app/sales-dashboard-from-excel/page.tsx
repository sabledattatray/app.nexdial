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
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Create Sales Dashboards from Excel Spreadsheets | OpenMIS",
  description:
    "Generate interactive sales performance dashboards from Excel and CSV files. Track MoM revenue growth, gross margins, regional splits, and top customer concentrations.",
  alternates: {
    canonical: "https://openmis.dev/sales-dashboard-from-excel",
  },
  openGraph: {
    title: "Create Sales Dashboards from Excel | OpenMIS",
    description:
      "Transform Excel sales sheets into executive revenue and margin dashboards in minutes. 100% free and private.",
    url: "https://openmis.dev/sales-dashboard-from-excel",
  },
};

export default function SalesDashboardFromExcelPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OpenMIS Sales Dashboard Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Generate interactive sales performance dashboards from Excel spreadsheets.",
  };

  const faqs = [
    {
      q: "How does OpenMIS calculate Month-over-Month (MoM) sales growth?",
      a: "OpenMIS identifies date columns and periods, aggregates revenue per period, and calculates ((Current - Previous) / |Previous|) * 100. It includes safeDivide zero-denominator safeguards so missing periods do not cause #DIV/0! errors.",
    },
    {
      q: "Can I filter sales by region, sales rep, or product line?",
      a: "Yes. OpenMIS provides global filter pills for categorical columns and date range sliders, allowing you to slice sales metrics dynamically.",
    },
    {
      q: "Can I download the pre-configured Sales MIS template?",
      a: "Yes. OpenMIS includes a built-in Sales MIS template loaded with synthetic transactional data so you can test the builder before uploading your own files.",
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
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Revenue, Pipeline & Margin Analytics</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Create Sales Dashboards from Excel Spreadsheets
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Transform raw sales transaction spreadsheets into executive revenue dashboards. Monitor MoM growth, profit margins, regional trends, and customer concentration without Power BI.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 text-base">
                  <UploadCloud className="w-5 h-5" />
                  Upload Sales Spreadsheet
                </Button>
              </Link>
              <Link href="/app/templates?load=sales_mis">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  Load Sales MIS Template
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Sample Card */}
          <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm">Executive Sales MIS Dashboard</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Pre-Configured Template Available
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Gross Sales</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">$452,190</div>
                <div className="text-[11px] text-emerald-600 font-medium">+18.5% MoM</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Net Profit Margin</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">32.4%</div>
                <div className="text-[11px] text-slate-400">Target: 30%</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Avg Deal Size</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">$3,840</div>
                <div className="text-[11px] text-emerald-600 font-medium">+6.1%</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Top 3 Reps</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">54% Share</div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400">Concentrated</div>
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
              Read our mathematical deep dive on sales KPIs:
            </div>
            <Link
              href="/guides/sales-kpis-and-growth"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              Calculating Sales Growth & Concentration <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-14 text-center space-y-4">
          <h2 className="text-2xl font-bold">Build Your Sales MIS Dashboard Now</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Upload your sales file to generate verified revenue cards in seconds.
          </p>
          <div className="pt-2">
            <Link href="/app/new">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Open Sales Dashboard Builder
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
