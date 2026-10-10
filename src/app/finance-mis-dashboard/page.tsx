import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  DollarSign,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildSoftwareAppSchema,
} from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  title: "Finance & Expense MIS Dashboard Generator | OpenMIS",
  description:
    "Generate private finance, OPEX, and budget variance dashboards from Excel ledgers. Analyze cost centers, spending trends, and variance without cloud leaks.",
  alternates: {
    canonical: `${BRAND.url}/finance-mis-dashboard`,
  },
  openGraph: {
    title: "Finance & Expense MIS Dashboard Generator | OpenMIS",
    description:
      "Transform corporate financial ledgers into executive expense summaries. 100% private, free, and open source.",
    url: `${BRAND.url}/finance-mis-dashboard`,
  },
};

export default function FinanceMISDashboardPage() {
  const faqs = [
    {
      q: "How does OpenMIS calculate budget variance?",
      a: "OpenMIS calculates Variance = Actual - Budget, and Variance % = ((Actual - Budget) / |Budget|) * 100, highlighting over-budget cost centers in red/amber with zero-divide protection.",
    },
    {
      q: "Can I export sanitized financial spreadsheets back to Excel?",
      a: "Yes. OpenMIS sanitizes all CSV and XLSX exports to prevent formula injection, while preserving legitimate negative numbers (e.g. -4,250.00) and currency values.",
    },
    {
      q: "Can I try this with sample financial ledger data?",
      a: "Yes. OpenMIS includes a built-in Finance & Expense Summary MIS template loaded with realistic synthetic department expense lines.",
    },
  ];

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Finance MIS Dashboard", path: "/finance-mis-dashboard" },
  ]);

  const faqLd = buildFaqSchema(faqs);

  const softwareLd = buildSoftwareAppSchema({
    name: "OpenMIS Finance Dashboard Generator",
    description: "Generate executive expense and budget variance dashboards from Excel ledgers.",
    path: "/finance-mis-dashboard",
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
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>OPEX, Cost Center & Variance Intelligence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Finance & Expense MIS Dashboard Generator
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Transform raw general ledger exports into executive expense summaries. Track budget variance, departmental burn, and cost categories with complete local data confidentiality.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 text-base">
                  <UploadCloud className="w-5 h-5" />
                  Upload Financial Ledger
                </Button>
              </Link>
              <Link href="/app/templates?load=finance_expense">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  Load Finance Template
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
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm">Monthly OPEX Variance Summary</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Audited Calculations
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Total OPEX</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">$218,400</div>
                <div className="text-[11px] text-emerald-600 font-medium">-3.2% vs budget</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Largest Cost Center</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">Engineering</div>
                <div className="text-[11px] text-slate-400">42% of total spend</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Variance to Budget</div>
                <div className="text-lg font-bold text-emerald-600 mt-1">-$7,100</div>
                <div className="text-[11px] text-emerald-600 font-medium">Under budget favorable</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Uncategorized Lines</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">0</div>
                <div className="text-[11px] text-emerald-600 font-medium">100% reconciled</div>
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
              Check our security review on formula sanitization:
            </div>
            <Link
              href="/security"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <ShieldCheck className="w-4 h-4" />
              Security Architecture & DDE Defense <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-14 text-center space-y-4">
          <h2 className="text-2xl font-bold">Generate Boardroom Financial Summaries</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            100% local processing. Financial spreadsheets never leave your device.
          </p>
          <div className="pt-2">
            <Link href="/app/new">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Launch Finance Dashboard Builder
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
