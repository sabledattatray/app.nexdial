import React from "react";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";

import { BRAND } from "@/lib/constants/brand";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/seo/schema-builders";

export const metadata: Metadata = {
  title: "MIT License & Third-Party Notices | OpenMIS",
  description: "Official MIT License text and open-source third-party software attributions for OpenMIS.",
  alternates: {
    canonical: `${BRAND.url}/license`,
  },
};

export default function LicensePage() {
  const thirdPartyLibraries = [
    { name: "Apache ECharts", license: "Apache License 2.0", purpose: "Interactive charting & visualization" },
    { name: "SheetJS (xlsx CE)", license: "Apache License 2.0", purpose: "Client-side Excel parsing & workbook handling" },
    { name: "PapaParse", license: "MIT License", purpose: "Fast browser-side CSV streaming parser" },
    { name: "Lucide React", license: "ISC License", purpose: "Accessible iconography system" },
    { name: "Tailwind CSS", license: "MIT License", purpose: "Utility-first design tokens & styling" },
    { name: "idb", license: "ISC License", purpose: "IndexedDB asynchronous promise wrapper" },
    { name: "Zod", license: "MIT License", purpose: "TypeScript-first schema validation" },
  ];

  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "License & Notices", path: "/license" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={breadcrumbLd} />
      <MarketingHeader />

      <main className="flex-1 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Open Source License & Notices</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              OpenMIS is free software distributed under the permissive MIT License.
            </p>
          </div>

          {/* Full MIT License Box */}
          <Card className="p-6 sm:p-8 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono text-xs leading-relaxed space-y-4 shadow-sm">
            <div className="font-bold text-sm text-slate-900 dark:text-white font-sans">
              MIT License — Copyright (c) 2026 OpenMIS Contributors
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
            </p>
            <p className="text-slate-600 dark:text-slate-400 uppercase">
              THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </Card>

          {/* Third-Party Notices */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Third-Party Software Attributions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              OpenMIS is made possible by these outstanding open-source projects. All dependencies are verified for permissive licensing (MIT, Apache 2.0, ISC) compliant with our ₹0 budget requirement.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">License</th>
                    <th className="py-3 px-4">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {thirdPartyLibraries.map((lib, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{lib.name}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          {lib.license}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{lib.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
