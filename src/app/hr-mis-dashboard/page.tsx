import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "HR MIS Dashboard & Headcount Analytics | OpenMIS",
  description:
    "Generate private HR MIS dashboards from employee rosters and payroll spreadsheets. Analyze headcount, department tenure, attendance, and turnover locally.",
  alternates: {
    canonical: "https://openmis.dev/hr-mis-dashboard",
  },
  openGraph: {
    title: "HR MIS Dashboard & Headcount Analytics | OpenMIS",
    description:
      "A 100% private, browser-first HR analytics dashboard. Employee records and compensation data never leave your computer.",
    url: "https://openmis.dev/hr-mis-dashboard",
  },
};

export default function HRMISDashboardPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OpenMIS HR Dashboard Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Generate private HR headcount and attendance dashboards from spreadsheets.",
  };

  const faqs = [
    {
      q: "Is it safe to upload confidential payroll and employee data?",
      a: "Yes. OpenMIS is uniquely suited for HR teams because all parsing, profiling, and chart rendering happen 100% inside your local web browser. No employee salaries, identification numbers, or names are sent to any remote server or AI API.",
    },
    {
      q: "How does OpenMIS calculate turnover and retention rates?",
      a: "OpenMIS calculates active headcount, terminations, and tenure distributions using deterministic mathematical formulas. Missing dates or null exit dates are handled cleanly by the data profiler.",
    },
    {
      q: "Can I download the pre-built HR template?",
      a: "Yes. OpenMIS includes a ready-to-use HR, Headcount & Attendance template loaded with synthetic personnel records.",
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
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Confidential Personnel & Payroll Analytics</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              HR MIS Dashboard & Headcount Analytics
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Create executive HR reports from spreadsheet rosters. Visualize department headcount, attendance trends, tenure distribution, and compensation bands with airtight local privacy.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 text-base">
                  <UploadCloud className="w-5 h-5" />
                  Upload HR Spreadsheet
                </Button>
              </Link>
              <Link href="/app/templates?load=hr_headcount">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  Load HR Template
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
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm">Quarterly Workforce MIS Summary</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Zero Cloud Uploads
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Active Headcount</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">284 Staff</div>
                <div className="text-[11px] text-emerald-600 font-medium">+12 net hires</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Annualized Turnover</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">6.2%</div>
                <div className="text-[11px] text-emerald-600 font-medium">Below benchmark</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Average Tenure</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">3.1 Years</div>
                <div className="text-[11px] text-slate-400">Mean duration</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Attendance Rate</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">96.4%</div>
                <div className="text-[11px] text-slate-400">30-day average</div>
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
              Review our privacy architecture:
            </div>
            <Link
              href="/privacy"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <ShieldCheck className="w-4 h-4" />
              Zero-Telemetry Privacy Guarantee <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-14 text-center space-y-4">
          <h2 className="text-2xl font-bold">Build HR Reports Without Data Leakage</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Confidential employee data remains completely inside your browser memory.
          </p>
          <div className="pt-2">
            <Link href="/app/new">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Launch HR Dashboard Builder
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
