import React from "react";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Lock, AlertTriangle, FileCode, Cpu } from "lucide-react";

import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  title: "Security Architecture & Vulnerability Policy | OpenMIS",
  description:
    "OpenMIS security posture: Dynamic Data Exchange (DDE) formula injection sanitization, client-side browser isolation, and responsible disclosure policy.",
  alternates: {
    canonical: `${BRAND.url}/security`,
  },
};

export default function SecurityPage() {
  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Security Architecture", path: "/security" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Application Security Standard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Security Architecture & Threat Model
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
              OpenMIS implements defense-in-depth protections tailored for spreadsheet ingestion and executive file exports.
            </p>
          </div>

          {/* Core Security Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3>CSV DDE Formula Sanitization</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Prevents formula injection attacks by escaping dangerous characters (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">=</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">+</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">-</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">@</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">\t</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">\r</code>) with single quotes (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">&apos;</code>) upon CSV/XLSX export.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <h3>Strict Browser Sandbox Isolation</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Parsing executes inside isolated Web Worker threads. No remote endpoints ingest file buffers, eliminating server-side remote code execution (RCE) vectors.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <FileCode className="w-5 h-5 text-amber-500" />
                <h3>Zero Dynamic Code Execution</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">eval()</code> or <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">new Function()</code> is used in OpenMIS. Imported report schemas are validated against strict Zod type boundaries.
              </p>
            </Card>

            <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3>Resource Ceiling Safeguards</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Guards user devices against memory exhaustion with a 50MB file size ceiling and a 250,000 row hard cutoff, alerting the user gracefully before browser memory limits are reached.
              </p>
            </Card>
          </div>

          {/* Technical Details */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                Dynamic Data Exchange (DDE) Defense Explained
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                When a spreadsheet application such as Microsoft Excel or LibreOffice Calc opens a CSV file, cells starting with <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">=</code>, <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">+</code>, <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">-</code>, or <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">@</code> are automatically evaluated as executable formulas. If an unverified user imports data containing malicious formulas (e.g. <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">=cmd|&apos;/C calc&apos;!A0</code>), the host computer may execute unauthorized system commands upon opening the file.
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                OpenMIS features a multi-pass formula sanitizer. It verifies raw cell strings (including leading whitespace and tab characters) and prepends an apostrophe (<code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">&apos;</code>) to any non-numeric formula string, while preserving legitimate numbers (e.g. <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">-42.50</code> or <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">+100</code>).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold border-b border-slate-200 dark:border-slate-800 pb-2">
                Responsible Vulnerability Disclosure
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                We take security seriously. If you identify a potential security issue in OpenMIS:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>Submit a private vulnerability report via GitHub Security Advisories.</li>
                <li>Do not publish or disclose the issue publicly until a patched release is tagged.</li>
                <li>Never share real proprietary corporate spreadsheet data in bug reports; provide synthetic mock datasets.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
