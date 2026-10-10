import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Activity,
  Megaphone,
  CheckSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { MIS_TEMPLATES } from "@/lib/templates/template-registry";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/constants/brand";
import { buildBreadcrumbSchema } from "@/lib/seo/schema-builders";

import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";

export const metadata: Metadata = {
  title: "22 MIS Dashboard Templates & Excel Starters | OpenMIS",
  description:
    "Free production-ready MIS dashboard templates for Executive C-Suite, SaaS, Sales, Finance, Inventory, HR, Operations, Healthcare, Logistics, and Retail. 100% browser-side with synthetic sample data.",
  alternates: {
    canonical: `${BRAND.url}/templates`,
  },
  openGraph: {
    title: "22 Free MIS Dashboard Templates | OpenMIS",
    description:
      "Explore 22 ready-to-use business MIS templates with synthetic datasets. Launch directly into the workspace with ₹0 cost and zero cloud uploads.",
    url: `${BRAND.url}/templates`,
  },
};

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  sales: TrendingUp,
  finance: DollarSign,
  inventory: Package,
  hr: Users,
  operations: Activity,
  marketing: Megaphone,
  projects: CheckSquare,
};

export default function PublicTemplatesPage() {
  const breadcrumbLd = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "MIS Templates", path: "/templates" },
  ]);

  const jsonLd = [
    breadcrumbLd,
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "OpenMIS Dashboard Templates",
      description: "Production MIS templates for Excel and CSV datasets.",
      url: `${BRAND.url}/templates`,
      hasPart: MIS_TEMPLATES.map((t) => ({
        "@type": "SoftwareApplication",
        name: t.name,
        description: t.description,
        applicationCategory: "BusinessApplication",
      })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-16 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>22 Ready-to-Use Business Layouts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Production MIS Dashboard Templates
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Pre-configured executive reporting templates built for Excel and CSV datasets. Each template includes realistic synthetic sample data, visual layout thumbnails, and automated KPI widgets.
            </p>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MIS_TEMPLATES.map((tmpl) => {
              const Icon = TEMPLATE_ICONS[tmpl.category] || FileSpreadsheet;
              return (
                <Card
                  key={tmpl.id}
                  className="p-5 flex flex-col justify-between border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="space-y-4">
                    {/* Visual Vector Mini-Thumbnail */}
                    <Link href={`/app/templates?load=${tmpl.id}`}>
                      <TemplateThumbnail
                        layoutStyle={tmpl.layoutStyle}
                        colorTheme={tmpl.colorTheme}
                        title={tmpl.name}
                      />
                    </Link>

                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                        {tmpl.category}
                      </Badge>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tmpl.name}
                    </h2>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {tmpl.description}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                        Configured Widgets:
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                        {tmpl.widgets.length} executive cards ({tmpl.widgets.map((w) => w.type).join(", ")})
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <Link href={`/app/templates?load=${tmpl.id}`}>
                      <Button className="w-full gap-2 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Launch in Workspace
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Custom Data Callout */}
        <section className="bg-indigo-50/60 dark:bg-indigo-950/20 border-t border-indigo-100 dark:border-indigo-900/40 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Have Your Own Spreadsheet?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              You don&apos;t need to use a template. Upload your own CSV or XLSX workbook and OpenMIS will automatically detect fields, metrics, and generate tailored charts.
            </p>
            <div className="pt-2">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-md">
                  Upload Custom Spreadsheet
                  <ArrowRight className="w-4 h-4" />
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
