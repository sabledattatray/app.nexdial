"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MIS_TEMPLATES, MISTemplate } from "@/lib/templates/template-registry";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  X,
  Search,
  Sparkles,
  Check,
  Loader2,
  FileSpreadsheet,
  ArrowRight,
  Layers,
  Palette,
} from "lucide-react";

interface TemplateSlideOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplateLayout: (template: MISTemplate) => void;
  onLoadTemplateData: (template: MISTemplate) => Promise<void>;
  loadingTemplateId: string | null;
  activeTemplateId?: string | null;
}

export function TemplateSlideOverDrawer({
  isOpen,
  onClose,
  onApplyTemplateLayout,
  onLoadTemplateData,
  loadingTemplateId,
  activeTemplateId,
}: TemplateSlideOverDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end print:hidden pointer-events-auto">
      {/* Semi-transparent non-blocking backdrop that keeps the live report crisp and visible */}
      <div
        className="fixed inset-0 bg-slate-900/15 dark:bg-black/30 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Panel */}
      <aside
        className="relative z-10 w-full sm:w-[480px] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        aria-label="MIS Templates Live Drawer"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Live MIS Templates
                </h3>
                <Badge variant="accent" className="text-[10px] py-0 px-1.5 font-semibold">
                  22 Styles
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Click any template to watch the live report update beside you.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close template drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls (Sticky Top) */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 22 templates (sales, finance, saas, oee)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-2xs font-semibold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {cat} {cat === "All" && `(${MIS_TEMPLATES.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Template Cards Scrollable Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredTemplates.map((tmpl) => {
            const isLoading = loadingTemplateId === tmpl.id;
            const isActive = activeTemplateId === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className={`group rounded-xl border bg-white dark:bg-slate-900/90 p-3.5 space-y-3 transition-all duration-200 hover:shadow-md ${
                  isActive
                    ? "border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20 dark:bg-indigo-950/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                {/* Visual Thumbnail */}
                <div
                  className="cursor-pointer"
                  onClick={() => onApplyTemplateLayout(tmpl)}
                  title="Click to apply this layout"
                >
                  <TemplateThumbnail
                    layoutStyle={tmpl.layoutStyle}
                    colorTheme={tmpl.colorTheme}
                    title={tmpl.name}
                  />
                </div>

                {/* Info */}
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {tmpl.category}
                    </span>
                    {isActive && (
                      <Badge variant="success" className="text-[9px] px-1.5 py-0 gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        <span>Active on Canvas</span>
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {tmpl.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => onApplyTemplateLayout(tmpl)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors shadow-2xs"
                    title="Apply layout architecture to your current dataset"
                  >
                    <span>Apply Style</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onLoadTemplateData(tmpl)}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                    title="Load sample dataset into memory"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-3 h-3 text-slate-400" />
                        <span>Load Data</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            All 22 templates calculate 100% locally in your browser.
          </p>
        </div>
      </aside>
    </div>
  );
}
