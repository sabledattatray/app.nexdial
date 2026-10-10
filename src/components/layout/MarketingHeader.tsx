"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import { Button } from "@/components/ui/Button";
import { BarChart3, ShieldCheck, Sparkles, Menu, X } from "lucide-react";

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-slate-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span>{BRAND.name}</span>
          <span className="hidden sm:inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950 dark:text-indigo-300">
            Free & Local
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            How It Works
          </Link>
          <Link href="/app/templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            MIS Templates
          </Link>
          <Link href="/#privacy" className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Privacy First
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/app">
            <Button variant="outline" size="sm">
              Open App
            </Button>
          </Link>
          <Link href="/app/new">
            <Button size="sm" className="gap-1.5 shadow-indigo-500/20 shadow-md">
              <Sparkles className="w-4 h-4" />
              Create Free Dashboard
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            How It Works
          </Link>
          <Link
            href="/app/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            MIS Templates
          </Link>
          <Link
            href="/#privacy"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Privacy First
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/app/new" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full">Create Free Dashboard</Button>
            </Link>
            <Link href="/app" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Open Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
