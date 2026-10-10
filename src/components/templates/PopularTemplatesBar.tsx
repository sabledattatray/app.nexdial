"use client";

import React, { useState } from "react";
import { MIS_TEMPLATES, MISTemplate } from "@/lib/templates/template-registry";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Check,
  ChevronDown,
  Layers,
  ArrowRight,
  Loader2,
  SidebarClose,
  SidebarOpen,
} from "lucide-react";

// Top 5 most demanded MIS templates across enterprise industries
const POPULAR_TEMPLATE_IDS = [
  "executive_boardroom",
  "sales_mis",
  "finance_expense",
  "saas_mrr_churn",
  "ecommerce_conversion",
];

interface PopularTemplatesBarProps {
  onApplyTemplateLayout: (template: MISTemplate) => void;
  onLoadTemplateData: (template: MISTemplate) => Promise<void>;
  activeTemplateId?: string | null;
  loadingTemplateId?: string | null;
  isRightSidebarOpen?: boolean;
  onToggleRightSidebar?: () => void;
}

export function PopularTemplatesBar({
  onApplyTemplateLayout,
  onLoadTemplateData,
  activeTemplateId,
  loadingTemplateId,
  isRightSidebarOpen,
  onToggleRightSidebar,
}: PopularTemplatesBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const popularTemplates = POPULAR_TEMPLATE_IDS.map((id) =>
    MIS_TEMPLATES.find((t) => t.id === id)
  ).filter((t): t is MISTemplate => Boolean(t));

  // Category grouping for dropdown
  const categories = Array.from(new Set(MIS_TEMPLATES.map((t) => t.category)));

  const handleSelectDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const found = MIS_TEMPLATES.find((t) => t.id === selectedId);
    if (found) {
      onApplyTemplateLayout(found);
    }
  };

  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/60 via-white to-slate-50/70 dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/30 p-3.5 space-y-3 shadow-2xs">
      {/* Top Header of the Bar: Label + Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100/70 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Popular MIS Templates
          </span>
          <Badge variant="accent" className="text-[10px] py-0 px-1.5 font-semibold">
            5 Quick-Apply
          </Badge>
        </div>

        {/* Dropdown to apply ANY of the 22 templates */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={activeTemplateId || ""}
              onChange={handleSelectDropdown}
              className="text-xs font-medium pl-3 pr-8 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer appearance-none"
              title="Select any of the 22 templates to apply its layout"
            >
              <option value="" disabled>
                Apply Another Template (22 Styles)...
              </option>
              {categories.map((cat) => (
                <optgroup key={cat} label={cat} className="font-semibold text-slate-900 dark:text-slate-100">
                  {MIS_TEMPLATES.filter((t) => t.category === cat).map((t) => (
                    <option key={t.id} value={t.id} className="font-normal">
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {onToggleRightSidebar && (
            <button
              onClick={onToggleRightSidebar}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-2xs"
              title={isRightSidebarOpen ? "Hide right templates sidebar" : "Show right templates sidebar"}
            >
              {isRightSidebarOpen ? (
                <>
                  <SidebarClose className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px]">Hide Sidebar</span>
                </>
              ) : (
                <>
                  <SidebarOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[11px]">Show All (22)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 5 Popular Templates Interactive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {popularTemplates.map((tmpl) => {
          const isActive = activeTemplateId === tmpl.id;
          const isLoading = loadingTemplateId === tmpl.id;

          // Theme color dot
          const themeDotColors: Record<string, string> = {
            indigo: "bg-indigo-600",
            blue: "bg-blue-600",
            emerald: "bg-emerald-600",
            violet: "bg-purple-600",
            cyan: "bg-cyan-600",
            amber: "bg-amber-600",
            rose: "bg-rose-600",
            slate: "bg-slate-600",
          };
          const dotBg = themeDotColors[tmpl.colorTheme] || "bg-indigo-600";

          return (
            <button
              key={tmpl.id}
              onClick={() => onApplyTemplateLayout(tmpl)}
              disabled={isLoading}
              className={`group relative text-left p-2.5 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                isActive
                  ? "border-indigo-600 bg-indigo-50/90 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-2xs"
              }`}
              title={`Click to apply ${tmpl.name} layout to your report`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotBg}`} />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                      {tmpl.category.split(" ")[0]}
                    </span>
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tmpl.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {tmpl.widgets.length} widgets • {tmpl.layoutStyle}
                </p>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                <span>{isActive ? "Active on Canvas" : "Apply Style"}</span>
                <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
