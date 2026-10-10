import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookOpen, Clock, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { EDUCATIONAL_GUIDES } from "@/lib/guides/guide-data";
import { JsonLd } from "@/components/seo/JsonLd";

import { BRAND } from "@/lib/constants/brand";
import { buildBreadcrumbSchema } from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  title: "Spreadsheet Analytics & MIS Reporting Guides | OpenMIS",
  description:
    "Free practical guides on spreadsheet data cleaning, chart type selection, sales growth mathematics, and CSV formula injection security.",
  alternates: {
    canonical: `${BRAND.url}/guides`,
  },
  openGraph: {
    title: "Spreadsheet Analytics & MIS Reporting Guides | OpenMIS",
    description:
      "Master spreadsheet data cleaning, chart selection, and executive MIS reporting with reproducible steps and transparent formulas.",
    url: `${BRAND.url}/guides`,
    type: "website",
  },
};

export default function GuidesIndexPage() {
  const guides = Object.values(EDUCATIONAL_GUIDES);

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Educational Guides", path: "/guides" },
  ]);

  const jsonLd = [
    breadcrumbLd,
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "OpenMIS Educational Guides",
      description: "Guides on spreadsheet data cleaning, chart selection, and MIS reporting.",
      url: `${BRAND.url}/guides`,
      hasPart: guides.map((g) => ({
        "@type": "Article",
        headline: g.title,
        description: g.description,
        url: `${BRAND.url}/guides/${g.slug}`,
      })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Base & Tutorials</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Spreadsheet & MIS Reporting Guides
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Practical, actionable tutorials designed to help analysts, small business owners, and Excel users build accurate, executive-ready reports.
            </p>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {guides.map((guide) => (
              <Card
                key={guide.slug}
                className="flex flex-col justify-between p-6 hover:shadow-lg transition-shadow border-slate-200/80 dark:border-slate-800"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="font-medium text-xs">
                      {guide.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {guide.description}
                  </p>

                  <ul className="space-y-1.5 pt-2">
                    {guide.summaryPoints.slice(0, 2).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    Published {guide.publishDate}
                  </span>
                  <Link href={`/guides/${guide.slug}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-indigo-600 dark:text-indigo-400 p-0 hover:bg-transparent">
                      Read Guide
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Practice Banner */}
        <section className="bg-indigo-50/60 dark:bg-indigo-950/30 border-y border-indigo-100 dark:border-indigo-900/50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Put These Principles Into Practice
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Upload any raw spreadsheet to OpenMIS. Automatic data profiling, whitespace trimming, and instant KPI calculation happen in seconds — 100% locally.
            </p>
            <div className="pt-2">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Try Free Dashboard Builder
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
