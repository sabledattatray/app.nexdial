import React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{BRAND.name}</span>
            </h3>
            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
              ₹0 Free & Open Source
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {BRAND.description}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Zero-telemetry: runs locally.</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Features & Engine
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  MIS Templates
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Educational Guides
                </Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Open Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Use Cases
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/excel-to-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Excel to Dashboard
                </Link>
              </li>
              <li>
                <Link href="/csv-dashboard-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  CSV Dashboard
                </Link>
              </li>
              <li>
                <Link href="/free-mis-report-generator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  MIS Report Generator
                </Link>
              </li>
              <li>
                <Link href="/sales-dashboard-from-excel" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sales Dashboards
                </Link>
              </li>
              <li>
                <Link href="/inventory-dashboard-template" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Inventory & Stock
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialized Dashboards */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/hr-mis-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  HR MIS & Headcount
                </Link>
              </li>
              <li>
                <Link href="/finance-mis-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Finance & OPEX
                </Link>
              </li>
              <li>
                <Link href="/guides/clean-excel-data" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cleaning Dirty Data
                </Link>
              </li>
              <li>
                <Link href="/guides/prevent-spreadsheet-errors" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Spreadsheet Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Transparency
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About OpenMIS
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Changelog (v1.0.0)
                </Link>
              </li>
              <li>
                <Link href="/license" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  MIT License
                </Link>
              </li>
              <li>
                <a
                  href={BRAND.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  GitHub Source
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <p>© {BRAND.year} {BRAND.name}. Free software licensed under MIT.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Excel users & MIS analysts.
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <a
              href="https://dattasable.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1 group"
            >
              <span>Made by</span>
              <span className="underline decoration-indigo-400 decoration-1 underline-offset-2 group-hover:text-indigo-600">
                Datta Sable
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
