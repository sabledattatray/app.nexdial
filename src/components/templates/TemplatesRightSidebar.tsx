"use client";

import React, { useState, useMemo } from "react";
import { MIS_TEMPLATES, MISTemplate } from "@/lib/templates/template-registry";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Check,
  Loader2,
  FileSpreadsheet,
  ArrowRight,
  Layers,
  X,
  Sparkles,
} from "lucide-react";

interface TemplatesRightSidebarProps {
  onApplyTemplateLayout: (template: MISTemplate) => void;
  onLoadTemplateData: (template: MISTemplate) => Promise<void>;
  loadingTemplateId: string | null;
  activeTemplateId?: string | null;
  onClose?: () => void;
}

export function TemplatesRightSidebar({
  onApplyTemplateLayout,
  onLoadTemplateData,
  loadingTemplateId,
  activeTemplateId,
  onClose,
}: TemplatesRightSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    MIS_TEMPLATES.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredTemplates = useMemo(() => {
    return MIS_TEMPLATES.filter((tmpl) => {
      const matchCategory = selectedCategory === "All" || tmpl.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tmpl.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <aside
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col overflow-hidden max-h-[calc(100vh-5rem)] sticky top-4 print:hidden"
      aria-label="MIS Templates Right Sidebar"
    >
      {/* Sidebar Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                Templates Library
              </h3>
              <Badge variant="accent" className="text-[10px] py-0 px-1 font-semibold">
                22 Styles
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              Click any style to update live report
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Hide right templates sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search & Category Pills Filter */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search 22 templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Templates List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredTemplates.map((tmpl) => {
          const isLoading = loadingTemplateId === tmpl.id;
          const isActive = activeTemplateId === tmpl.id;

          return (
            <div
              key={tmpl.id}
              className={`group rounded-xl border p-2.5 space-y-2 transition-all duration-150 ${
                isActive
                  ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30 shadow-2xs"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-2xs"
              }`}
            >
              {/* Thumbnail preview wireframe */}
              <div
                className="cursor-pointer rounded-lg overflow-hidden border border-slate-150 dark:border-slate-800"
                onClick={() => onApplyTemplateLayout(tmpl)}
                title="Click to apply this layout"
              >
                <TemplateThumbnail
                  layoutStyle={tmpl.layoutStyle}
                  colorTheme={tmpl.colorTheme}
                  title={tmpl.name}
                />
              </div>

              {/* Template Meta */}
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {tmpl.category}
                  </span>
                  {isActive && (
                    <Badge variant="success" className="text-[9px] px-1.5 py-0 gap-0.5">
                      <Check className="w-2.5 h-2.5" />
                      <span>Active</span>
                    </Badge>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 line-clamp-1">
                  {tmpl.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                  {tmpl.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                <button
                  onClick={() => onApplyTemplateLayout(tmpl)}
                  className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs"
                  title="Apply this layout architecture to your active dataset"
                >
                  <span>Apply Style</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>

                <button
                  onClick={() => onLoadTemplateData(tmpl)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Load synthetic dataset into browser"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-2.5 h-2.5 animate-spin text-indigo-600" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-2.5 h-2.5 text-slate-400" />
                      <span>Load Data</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-center shrink-0">
        <p className="text-[10px] text-slate-400">
          22 Private MIS Styles • Zero Data Leaves Browser
        </p>
      </div>
    </aside>
  );
}
