"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants/brand";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  Upload,
  Layers,
  Settings,
  Sun,
  Moon,
  ShieldCheck,
} from "lucide-react";

import { useDataset } from "@/context/DatasetContext";

interface AppHeaderProps {
  datasetName?: string;
  rowCount?: number;
}

const subscribeToTheme = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  window.addEventListener("openmis-theme-change", callback);
  return () => {
    media.removeEventListener("change", callback);
    window.removeEventListener("openmis-theme-change", callback);
  };
};

const getThemeSnapshot = () => {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
};

const getServerSnapshot = () => false;

export function AppHeader({ datasetName: propName, rowCount: propRows }: AppHeaderProps) {
  let contextProfile = null;
  try {
    const ctx = useDataset();
    contextProfile = ctx.profile;
  } catch {
    // Context may not be mounted outside /app
  }

  const activeDatasetName = propName || contextProfile?.metadata.name;
  const activeRowCount = propRows || contextProfile?.metadata.rowCount;

  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  const toggleDarkMode = () => {
    if (typeof document !== "undefined") {
      const isCurrentlyDark = document.documentElement.classList.contains("dark");
      if (isCurrentlyDark) {
        document.documentElement.classList.remove("dark");
        try {
          localStorage.setItem("openmis-theme", "light");
        } catch {}
      } else {
        document.documentElement.classList.add("dark");
        try {
          localStorage.setItem("openmis-theme", "dark");
        } catch {}
      }
      window.dispatchEvent(new Event("openmis-theme-change"));
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 print:hidden">
      {/* Brand & Dataset Status */}
      <div className="flex items-center gap-4">
        <Link href="/app" className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-slate-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">{BRAND.name}</span>
        </Link>

        {/* Dataset Status Indicator */}
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
        <div className="flex items-center gap-2">
          {activeDatasetName ? (
            <Badge
              variant="success"
              className="gap-1 px-2.5 py-1 text-xs max-w-[140px] sm:max-w-[280px] md:max-w-none"
              title={`${activeDatasetName} ${activeRowCount ? `(${activeRowCount.toLocaleString()} rows)` : ""}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">{activeDatasetName}</span>
              {activeRowCount ? (
                <span className="shrink-0 hidden sm:inline opacity-85 font-mono">
                  ({activeRowCount.toLocaleString()} rows)
                </span>
              ) : null}
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1 px-2.5 py-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              No Dataset Loaded
            </Badge>
          )}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link href="/app/new">
          <Button size="sm" variant="accent" className="gap-1.5 text-xs sm:text-sm">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload File</span>
          </Button>
        </Link>

        <Link href="/app/templates">
          <Button size="sm" variant="ghost" className="gap-1.5 text-xs sm:text-sm">
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </Button>
        </Link>

        <Link href="/app/settings">
          <Button size="icon" variant="ghost" aria-label="Settings">
            <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </Button>
        </Link>

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Privacy shield badge */}
        <div className="hidden lg:flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local Memory Only</span>
        </div>
      </div>
    </header>
  );
}
