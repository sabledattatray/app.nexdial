"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDataset } from "@/context/DatasetContext";
import { parseCsvString } from "@/lib/parsers/csv-parser";
import { profileDataset } from "@/domain/dataset/profiler";
import { MIS_TEMPLATES, MISTemplate } from "@/lib/templates/template-registry";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  ArrowLeft,
  Download,
  Loader2,
  Sparkles,
  Search,
  Layers,
} from "lucide-react";

export default function TemplatesPage() {
  const router = useRouter();
  const { setLoadedDataset } = useDataset();
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    MIS_TEMPLATES.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredTemplates = useMemo(() => {
    return MIS_TEMPLATES.filter((tpl) => {
      const matchCat = selectedCategory === "All" || tpl.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleLoadTemplate = React.useCallback(
    async (template: MISTemplate) => {
      try {
        setLoadingTemplateId(template.id);
        const response = await fetch(`/sample-data/${template.filename}`);
        if (!response.ok) {
          throw new Error(`Failed to load sample data: ${response.statusText}`);
        }
        const csvText = await response.text();

        // 1. Parse CSV string
        const parseResult = await parseCsvString(csvText);

        // 2. Profile dataset
        const profile = profileDataset(parseResult.rows, parseResult.headers, {
          id: `tpl_${template.id}`,
          name: template.filename.replace(".csv", "").toUpperCase(),
          sourceFormat: "csv",
          sizeBytes: csvText.length,
          importedAt: new Date().toISOString(),
        });

        // 3. Load into dataset context
        setLoadedDataset(profile, parseResult.rows, {
          rows: parseResult.rows,
          headers: parseResult.headers,
        });

        // 4. Navigate to report dashboard
        router.push("/app/report");
      } catch (err) {
        alert(`Error loading template: ${err instanceof Error ? err.message : String(err)}`);
        setLoadingTemplateId(null);
      }
    },
    [router, setLoadedDataset]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-3">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Executive MIS Report Templates
              </h1>
              <Badge variant="accent" className="gap-1 font-semibold text-xs py-0.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>22 Production Styles</span>
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Pre-configured business reporting layouts with realistic synthetic datasets. Select any template to preview its layout thumbnail and launch directly into the live report editor.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-2xs font-semibold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {cat} {cat === "All" && `(${MIS_TEMPLATES.length})`}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px] shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search templates & metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Templates Grid with Visual Mini-Thumbnails */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isLoading = loadingTemplateId === tpl.id;

          return (
            <Card
              key={tpl.id}
              id={tpl.id}
              className="group flex flex-col justify-between hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 hover:shadow-md overflow-hidden"
            >
              {/* Visual Mini-Thumbnail Mockup */}
              <div className="p-4 pb-0 cursor-pointer" onClick={() => handleLoadTemplate(tpl)}>
                <TemplateThumbnail
                  layoutStyle={tpl.layoutStyle}
                  colorTheme={tpl.colorTheme}
                  title={tpl.name}
                />
              </div>

              <CardHeader className="space-y-2 p-4 pt-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
                    {tpl.category}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {tpl.fictionalRows} sample rows
                  </span>
                </div>
                <div>
                  <CardTitle className="text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tpl.name}
                  </CardTitle>
                  <CardDescription className="mt-1.5 text-xs leading-relaxed line-clamp-2">
                    {tpl.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 px-4 pb-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Expected Columns
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tpl.requiredColumns.map((col) => (
                      <span
                        key={col}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300"
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Calculated KPIs & Charts
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tpl.metrics.map((m) => (
                      <span
                        key={m}
                        className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-[10px] font-medium text-indigo-700 dark:text-indigo-300"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between p-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 gap-2">
                <a
                  href={`/sample-data/${tpl.filename}`}
                  download={tpl.filename}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  title={`Download sample ${tpl.filename}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Sample CSV</span>
                </a>

                <Button
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleLoadTemplate(tpl)}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Profiling...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Launch Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Notice on Fictional Datasets (PRD 7.14) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between shadow-2xs">
        <p>
          <strong>Notice:</strong> All 22 sample datasets shipped with OpenMIS templates are strictly fictional and generated for demonstration purposes. No real personal or corporate financial data is included.
        </p>
      </div>
    </div>
  );
}
