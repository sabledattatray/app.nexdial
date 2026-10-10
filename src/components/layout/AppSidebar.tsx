"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  TableProperties,
  BarChart2,
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/app",
      icon: LayoutDashboard,
      active: pathname === "/app",
    },
    {
      label: "Import File",
      href: "/app/new",
      icon: UploadCloud,
      active: pathname === "/app/new",
    },
    {
      label: "Data & Profiling",
      href: "/app/data/current",
      icon: TableProperties,
      active: pathname.startsWith("/app/data"),
    },
    {
      label: "Report Editor",
      href: "/app/report/current",
      icon: BarChart2,
      active: pathname.startsWith("/app/report"),
    },
    {
      label: "MIS Templates",
      href: "/app/templates",
      icon: FileSpreadsheet,
      active: pathname === "/app/templates",
    },
    {
      label: "Local Settings",
      href: "/app/settings",
      icon: Settings,
      active: pathname === "/app/settings",
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      {/* Navigation Links */}
      <div className="p-4 space-y-1">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  item.active
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Bottom Privacy & Cost Info */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% Client-Side</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Data never leaves your browser. Parsing and chart math run on your device.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 px-1 py-1"
        >
          <span>Marketing Home</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
