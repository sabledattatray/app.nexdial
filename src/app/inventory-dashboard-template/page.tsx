import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Package,
  UploadCloud,
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Inventory Dashboard Template & Stock Tracker | OpenMIS",
  description:
    "Free inventory dashboard generator from spreadsheets. Monitor SKU stock levels, warehouse valuation, reorder thresholds, and out-of-stock risks locally.",
  alternates: {
    canonical: "https://openmis.dev/inventory-dashboard-template",
  },
  openGraph: {
    title: "Inventory Dashboard Template | OpenMIS",
    description:
      "Turn your inventory and stock spreadsheets into real-time executive dashboards with ₹0 cost and zero cloud uploads.",
    url: "https://openmis.dev/inventory-dashboard-template",
  },
};

export default function InventoryDashboardTemplatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "OpenMIS Inventory Dashboard Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Generate interactive stock and inventory dashboards from Excel spreadsheets.",
  };

  const faqs = [
    {
      q: "Can OpenMIS flag low stock and reorder thresholds?",
      a: "Yes. Using numeric range filters and custom dashboard metric cards, you can isolate SKUs where current inventory is below your minimum reorder point.",
    },
    {
      q: "How does OpenMIS calculate total inventory valuation?",
      a: "OpenMIS calculates exact sums of (Quantity On Hand * Unit Cost) across all active SKU rows. Evidentiary calculation notes show the exact row counts and averages.",
    },
    {
      q: "Can I try this with sample inventory data?",
      a: "Yes. OpenMIS includes a built-in Inventory & Stock Status MIS template with realistic synthetic SKU records.",
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>SKU Tracking, Valuation & Reorder Alerts</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Inventory Dashboard Template & Stock Tracker
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload your inventory spreadsheet to visualize total stock value, identify warehouse bottlenecks, and monitor SKUs nearing depletion without cloud BI software.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/app/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20 text-base">
                  <UploadCloud className="w-5 h-5" />
                  Upload Inventory File
                </Button>
              </Link>
              <Link href="/app/templates?load=inventory_stock">
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  Load Inventory Template
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
                <Package className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-sm">Warehouse Stock MIS Summary</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                Live Template Layout
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Total Valuation</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">$842,500</div>
                <div className="text-[11px] text-emerald-600 font-medium">+4.2% vs last audit</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Active SKUs</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">1,240</div>
                <div className="text-[11px] text-slate-400">Across 3 warehouses</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Low Stock SKUs</div>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">18 Items</div>
                <div className="text-[11px] text-amber-600 font-medium">Reorder recommended</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <div className="text-xs text-slate-500">Stock Turnover</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">4.6x</div>
                <div className="text-[11px] text-emerald-600 font-medium">Healthy velocity</div>
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
              Clean messy SKU codes and whitespace before generating your report:
            </div>
            <Link
              href="/guides/clean-excel-data"
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              Spreadsheet Cleaning Guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-14 text-center space-y-4">
          <h2 className="text-2xl font-bold">Track Your Inventory Privately</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Upload your stock spreadsheet. Zero data is sent to external servers.
          </p>
          <div className="pt-2">
            <Link href="/app/new">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
                <Sparkles className="w-4 h-4" />
                Open Inventory Dashboard Builder
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
