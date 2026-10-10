"use client";

import React, { useState, useMemo } from "react";
import { MIS_TEMPLATES, MISTemplate } from "@/lib/templates/template-registry";
import { TemplateThumbnail } from "./TemplateThumbnail";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  Layers,
  Search,
  Check,
  Loader2,
  FileSpreadsheet,
  ArrowRight,
  Eye,
} from "lucide-react";

interface TemplateSwitcherBarProps {
  onApplyTemplateLayout: (template: MISTemplate) => void;
  onLoadTemplateData: (template: MISTemplate) => Promise<void>;
  loadingTemplateId: string | null;
  activeTemplateId?: string | null;
  isOpen?: boolean;
  onToggleOpen?: () => void;
}

export function TemplateSwitcherBar({
  onApplyTemplateLayout,
  onLoadTemplateData,
  loadingTemplateId,
  activeTemplateId,
  isOpen: propIsOpen,
  onToggleOpen,
}: TemplateSwitcherBarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const toggleOpen = onToggleOpen || (() => setInternalIsOpen((prev) => !prev));
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    MIS_TEMPLATES.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set)];
  }, []);

  // Filtered templates
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
    <div className="rounded-2xl border border-indigo-200 dark:border-indigo-950 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 shadow-xs overflow-hidden transition-all duration-300 print:hidden">
      {/* Header Bar / Collapsible Trigger */}
      <div className="p-4 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100/80 dark:border-indigo-950/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Executive MIS Template Gallery
              </span>
              <Badge variant="accent" className="gap-1 text-[11px] font-semibold py-0.5">
                <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>22 Production Styles</span>
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any template to live-preview report styles or load pre-configured datasets instantly.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant={isOpen ? "secondary" : "accent"}
            onClick={toggleOpen}
            className="gap-1.5 text-xs shadow-xs"
          >
            {isOpen ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Hide Template Shelf</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Browse & Switch Templates ({MIS_TEMPLATES.length})</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Shelf */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Filter pills & search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-2xs font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat} {cat === "All" && `(${MIS_TEMPLATES.length})`}
                </button>
              ))}
            </div>

            {/* Quick search input */}
            <div className="relative min-w-[200px] max-w-xs shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search 22 templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Horizontal Gallery of Template Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTemplates.map((tmpl) => {
              const isLoading = loadingTemplateId === tmpl.id;
              const isActive = activeTemplateId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  className={`group flex flex-col justify-between rounded-xl border bg-white dark:bg-slate-900/90 p-3 transition-all duration-200 hover:shadow-md ${
                    isActive
                      ? "border-indigo-500 ring-2 ring-indigo-500/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700"
                  }`}
                >
                  <div className="space-y-2.5">
                    {/* Visual Vector Mini Thumbnail */}
                    <div className="cursor-pointer" onClick={() => onApplyTemplateLayout(tmpl)}>
                      <TemplateThumbnail
                        layoutStyle={tmpl.layoutStyle}
                        colorTheme={tmpl.colorTheme}
                        title={tmpl.name}
                      />
                    </div>

                    {/* Template Info */}
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 truncate">
                          {tmpl.category}
                        </span>
                        {isActive && (
                          <Badge variant="success" className="text-[9px] px-1 py-0 gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            <span>Active</span>
                          </Badge>
                        )}
                      </div>
                      <h4
                        className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                        title={tmpl.name}
                      >
                        {tmpl.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1.5">
                    <button
                      onClick={() => onApplyTemplateLayout(tmpl)}
                      className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 transition-colors shadow-2xs"
                      title="Apply this template's chart layout & structure to your currently loaded dataset"
                    >
                      <span>Apply Layout to Data</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onLoadTemplateData(tmpl)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-1.5 px-2 py-1 rounded text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      title="Load sample dataset into memory and render full live template"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                          <span>Loading data...</span>
                        </>
                      ) : (
                        <>
                          <FileSpreadsheet className="w-3 h-3 text-slate-400" />
                          <span>Load Sample Data</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
