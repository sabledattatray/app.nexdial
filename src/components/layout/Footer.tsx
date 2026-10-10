import React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{BRAND.name}</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                ₹0 Free & Open Source
              </span>
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {BRAND.description}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero-telemetry privacy promise: files stay on your machine.</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/app" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Web Workspace
                </Link>
              </li>
              <li>
                <Link href="/app/new" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Upload Spreadsheet
                </Link>
              </li>
              <li>
                <Link href="/app/templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  MIS Templates
                </Link>
              </li>
              <li>
                <Link href="/excel-to-dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Excel to Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Transparency
            </h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Use
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
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Excel users, MIS analysts, and small businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
