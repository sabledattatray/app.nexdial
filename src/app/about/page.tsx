import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart, ShieldCheck, Sparkles, Code2, Users } from "lucide-react";
import { BRAND } from "@/lib/constants/brand";

export const metadata: Metadata = {
  title: "About OpenMIS | Mission & ₹0 Budget Philosophy",
  description:
    "Why OpenMIS was created: A free, privacy-first business intelligence and MIS dashboard tool built for Excel users, analysts, and small businesses.",
  alternates: {
    canonical: "https://openmis.dev/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <MarketingHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Open Source & Community Driven</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              About OpenMIS
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              Empowering Excel users and small businesses with private, accessible, and completely free MIS reporting tools.
            </p>
          </div>

          {/* Mission Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Across the world, millions of analysts, MIS executives, freelancers, and small business operators depend on Microsoft Excel and CSV files to track sales, monitor inventory, manage payroll, and evaluate project status.
            </p>
            <p>
              However, turning those spreadsheets into executive-ready dashboards traditionally required either mastering steep enterprise tools like Power BI or paying for expensive cloud BI subscriptions that require uploading sensitive corporate data to third-party servers.
            </p>
            <p>
              <strong>OpenMIS was built to solve this problem:</strong> to provide a browser-first, privacy-first MIS dashboard builder that runs 100% locally on your machine, requires zero logins or credit cards, and costs exactly ₹0 out-of-pocket.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 not-prose py-4">
              <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-2">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Privacy by Design</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Spreadsheet rows are parsed inside browser Web Workers and never sent to cloud servers.
                </p>
              </Card>

              <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-2">
                <Code2 className="w-6 h-6 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">MIT Open Source</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fully open-source code without vendor lock-in. Built entirely with permissive libraries.
                </p>
              </Card>

              <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-2">
                <Users className="w-6 h-6 text-violet-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Strict ₹0 Budget</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No required paid subscriptions, no mandatory AI keys, and no artificial trial paywalls.
                </p>
              </Card>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Deterministic Math, Not Hallucinated AI
            </h2>
            <p>
              We believe business decisions must be grounded in verified numbers. Rather than routing your financial data through unpredictable LLM prompts that invent numbers or causal claims, OpenMIS computes metrics using pure, deterministic algorithms (sums, averages, medians, IQR outlier detection, and safe-divide percentage growth). Every insight is directly backed by an evidentiary calculation breakdown.
            </p>
          </div>

          {/* Action Callout */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Ready to explore?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Launch the app workspace or review our code on GitHub.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/app/new">
                <Button className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Open Builder
                </Button>
              </Link>
              <a href={BRAND.links.github} target="_blank" rel="noreferrer">
                <Button variant="outline">GitHub Repository</Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
