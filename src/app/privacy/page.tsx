import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, CheckCircle2, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Zero-Telemetry Model | OpenMIS",
  description:
    "OpenMIS privacy architecture: 100% client-side data processing, zero telemetry of spreadsheet content, and complete local IndexedDB persistence.",
  alternates: {
    canonical: "https://openmis.dev/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <MarketingHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero-Telemetry Guarantee</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Privacy Policy & Security Architecture
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Last updated: October 10, 2026 • Version 1.0.0
            </p>
          </div>

          {/* Core Plain-Language Promise */}
          <Card className="p-6 sm:p-8 border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-4">
            <h2 className="text-xl font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              The Plain-Language Privacy Promise
            </h2>
            <p className="text-sm text-emerald-900 dark:text-emerald-300 leading-relaxed">
              When you upload a spreadsheet to OpenMIS, <strong>your data never leaves your computer</strong>. OpenMIS does not have a backend database for spreadsheet ingestion, does not transmit cell values to third-party APIs, and does not record your file contents in analytics logs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero spreadsheet row transmission</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No tracking pixels or third-party cookies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No compulsory account or sign-up</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One-click complete local data wipe</span>
              </div>
            </div>
          </Card>

          {/* Formal Policy Sections */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                1. Where Your Data Is Processed
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                OpenMIS executes in a client-side sandbox. All file parsing (CSV delimiter detection, Excel workbook sheet unpacking), type inference, data profiling, mathematical aggregations, and Apache ECharts rendering occur inside the memory of your local web browser using HTML5 Web Workers.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                You can verify this at any time by opening your browser&apos;s Network Developer Tools (F12) while uploading an Excel workbook. You will observe zero outgoing POST or PUT requests containing your file payload.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                2. Local Storage and IndexedDB
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                When you click &quot;Save Report&quot; or enable session persistence, your dataset and report definition schema are saved locally inside your browser&apos;s IndexedDB database (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">openmis-db</code>).
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                This database is isolated to your local browser origin and is inaccessible to external websites. When you click the <strong>&quot;Clear Data&quot;</strong> button inside OpenMIS, the application terminates the worker session and deletes the IndexedDB records.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                3. Telemetry and Analytics Policy
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Per Section 14 of our Product Requirements, OpenMIS does not track or collect:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>Spreadsheet file names or file paths</li>
                <li>Column headers, field names, or schema structures</li>
                <li>Cell text, numerical data, or formula contents</li>
                <li>Report titles, widget configurations, or filter states</li>
                <li>User identity, email addresses, or IP addresses</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                4. Third-Party Services and AI Disclosures
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                The core OpenMIS dashboard builder requires <strong>no AI service keys</strong> (e.g. OpenAI, Anthropic, Google Gemini). All insights (concentration, variance, growth rates) are generated using deterministic mathematical algorithms running directly in JavaScript.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                5. Questions & Feedback
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                If you have questions regarding this privacy policy or our open-source security boundary, visit our public GitHub repository or review our <Link href="/security" className="text-indigo-600 dark:text-indigo-400 underline">Security Architecture</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
