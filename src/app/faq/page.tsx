import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | OpenMIS",
  description:
    "Honest answers about OpenMIS pricing (₹0 forever), client-side privacy, file size limits, Power BI differences, and deterministic calculations.",
  alternates: {
    canonical: "https://openmis.dev/faq",
  },
};

const FAQ_ITEMS = [
  {
    q: "Is OpenMIS really completely free (₹0)?",
    a: "Yes. OpenMIS is built under the permissive MIT Open Source License. There are no paywalls, hidden tiers, trial periods, or mandatory credit card requirements. The entire application runs client-side in your web browser with zero paid API dependencies.",
  },
  {
    q: "Does OpenMIS upload my confidential spreadsheets to the cloud?",
    a: "No. All CSV and Excel parsing, profiling, mathematical aggregation, and chart rendering happen 100% inside your local browser memory using Web Workers. OpenMIS has no server-side spreadsheet storage, ensuring strict confidentiality for sensitive financial and payroll data.",
  },
  {
    q: "How does OpenMIS differ from Microsoft Power BI or Tableau?",
    a: "OpenMIS does not attempt to replicate every enterprise feature of Power BI (such as massive DAX formulas or DirectQuery to live cloud databases). Instead, OpenMIS is designed for Excel users and MIS analysts who want a fast, private, zero-cost way to turn a spreadsheet into an interactive dashboard in minutes without learning complex BI software or managing enterprise licenses.",
  },
  {
    q: "Can I use OpenMIS without an internet connection?",
    a: "Yes. Because OpenMIS operates purely in the browser and persists saved reports to local IndexedDB, once the web application assets are cached by your browser, you can load spreadsheets, customize widgets, and export reports completely offline.",
  },
  {
    q: "What file formats and sizes are supported?",
    a: "OpenMIS supports standard Comma-Separated Values (.csv) and Microsoft Excel workbooks (.xlsx, .xls) up to 50MB. For responsive in-browser performance, datasets up to 100,000 rows are recommended, with a 250,000 row hard safety ceiling.",
  },
  {
    q: "Does OpenMIS use AI or Large Language Models (LLMs)?",
    a: "No mandatory AI API is required. All insights (category concentration, MoM growth rates, IQR outlier detection, variance analysis) are computed using transparent, deterministic mathematical algorithms. OpenMIS does not hallucinate numbers or causal explanations.",
  },
  {
    q: "Where are my saved reports stored?",
    a: "Saved reports are stored in your browser's private IndexedDB storage. You can also export any report as a portable JSON file conforming to the versioned ReportDefinitionSchema v1.0.0, allowing you to share report layouts across devices.",
  },
  {
    q: "Can someone inject malicious Excel formulas via exported CSVs?",
    a: "No. OpenMIS features built-in Dynamic Data Exchange (DDE) sanitization. Any cell text beginning with dangerous formula characters (=, +, -, @, \\t, \\r) is automatically neutralized with a leading single quote (') upon export, preventing command execution while preserving legitimate numbers.",
  },
  {
    q: "Can I customize the charts and layout?",
    a: "Yes. The visual Widget Inspector allows you to change chart types (Bar, Line, Area, Donut, Scatter, Boxplot), reassign dimensions and measures, change aggregation types (SUM, AVERAGE, MIN, MAX, COUNT), adjust sort orders, reorder widgets, and apply global filters.",
  },
  {
    q: "What are the known limitations of OpenMIS?",
    a: "Because all processing runs in your browser's memory, multi-million row enterprise datasets requiring distributed compute clusters will exceed browser memory limits. Furthermore, OpenMIS does not currently support multi-table relational SQL joins across separate files.",
  },
  {
    q: "Can I print or export my dashboard for executive meetings?",
    a: "Yes. You can export filtered data as sanitized CSV or XLSX files, or use the Print/PDF button for a clean, paginated, publication-ready MIS report optimized for A4/Letter formats.",
  },
  {
    q: "How can I report a bug or request a feature?",
    a: "OpenMIS is fully open source. You can report bugs, submit feedback, or contribute enhancements directly through our public GitHub repository issue tracker.",
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Transparent & Factual Answers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about OpenMIS, our ₹0 budget policy, client-side data security, and capabilities.
            </p>
          </div>

          {/* FAQ Accordion / Cards */}
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <Card key={idx} className="p-6 border-slate-200/80 dark:border-slate-800 space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {item.q}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.a}
                </p>
              </Card>
            ))}
          </div>

          {/* CTA Box */}
          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-8 text-center space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Ready to test OpenMIS with your spreadsheets?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              No registration or software installation required. Open the builder directly in your browser.
            </p>
            <div className="pt-2">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-md">
                  <Sparkles className="w-4 h-4" />
                  Open Free Dashboard Builder
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
