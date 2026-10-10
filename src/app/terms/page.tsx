import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";

import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  title: "Terms of Use | OpenMIS",
  description: "Terms of service and software disclaimers for OpenMIS open-source platform.",
  alternates: {
    canonical: `${BRAND.url}/terms`,
  },
};

export default function TermsPage() {
  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms of Use", path: "/terms" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Use</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Effective Date: October 10, 2026 • OpenMIS Project
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Nature of the Software</h2>
              <p>
                OpenMIS is a free, open-source software project distributed under the terms of the MIT License. You are permitted to use, inspect, copy, modify, merge, publish, distribute, and sublicense copies of the software in accordance with the license.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Local-First Processing & User Responsibility</h2>
              <p>
                OpenMIS is provided as a browser-first application. When you load spreadsheets into OpenMIS, processing executes within your local computing environment. You are solely responsible for ensuring you possess the lawful right and necessary authorizations to process the data loaded into your browser session.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Disclaimer of Warranties</h2>
              <p className="uppercase text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.
              </p>
              <p>
                While OpenMIS implements deterministic calculations, safe-divide formulas, and automated formula injection sanitization, you should independently verify all critical financial, compliance, or regulatory figures before submitting reports to executives, regulatory bodies, or tax authorities.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">4. Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL THE AUTHORS, MAINTAINERS, OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">5. Governing License</h2>
              <p>
                For complete details regarding copyright ownership and usage rights, please refer to our full <Link href="/license" className="text-indigo-600 dark:text-indigo-400 underline">MIT License</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
