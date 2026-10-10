"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  TableProperties,
  ArrowRight,
  RotateCcw,
  RotateCw,
  Sparkles,
  History,
  Trash2,
  AlertTriangle,
  Info,
  Calendar,
  Hash,
  Type,
  ToggleLeft,
  Key,
  Layers,
  Search,
  Check,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { useDataset } from "@/context/DatasetContext";
import { DataType } from "@/domain/dataset/types";

export default function DataProfilingPage() {
  const router = useRouter();
  const {
    profile,
    rows,
    transformations,
    canUndo,
    canRedo,
    undo,
    redo,
    clearDataset,
    applyTrimWhitespace,
    applyNormalizeBlanks,
    applyRemoveDuplicates,
    applyDropColumn,
    applyRenameColumn,
    applyOverrideType,
  } = useDataset();

  const [activeTab, setActiveTab] = useState<"table" | "profile">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // History Drawer modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  // Clear confirmation modal
  const [clearModalOpen, setClearModalOpen] = useState(false);
  // Rename modal
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameFieldId, setRenameFieldId] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState("");

  // Column type override popover state
  const [typeDropdownFieldId, setTypeDropdownFieldId] = useState<string | null>(null);

  // If no dataset in memory
  if (!profile || rows.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <TableProperties className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            No Active Dataset to Profile
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Upload a spreadsheet or select one of our business templates to preview rows and inspect column statistics.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="/app/new">
            <Button className="gap-2">Upload Spreadsheet</Button>
          </Link>
          <Link href="/app/templates">
            <Button variant="outline">Browse Templates</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter and sort rows
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const filteredRows = useMemo(() => {
    let result = rows;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((val) =>
          String(val ?? "").toLowerCase().includes(q)
        )
      );
    }
    if (sortField) {
      result = [...result].sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        const strA = String(valA);
        const strB = String(valB);
        return sortDirection === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }
    return result;
  }, [rows, searchQuery, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const displayedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (fieldKey: string) => {
    if (sortField === fieldKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(fieldKey);
      setSortDirection("asc");
    }
  };

  const getTypeIcon = (type: DataType) => {
    switch (type) {
      case "number":
      case "integer":
        return <Hash className="w-3.5 h-3.5 text-blue-500" />;
      case "date":
        return <Calendar className="w-3.5 h-3.5 text-emerald-500" />;
      case "boolean":
        return <ToggleLeft className="w-3.5 h-3.5 text-purple-500" />;
      case "identifier":
        return <Key className="w-3.5 h-3.5 text-amber-500" />;
      case "categorical":
        return <Layers className="w-3.5 h-3.5 text-indigo-500" />;
      default:
        return <Type className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {profile.metadata.name}
            </h1>
            <Badge variant="accent">
              {profile.metadata.rowCount.toLocaleString()} rows
            </Badge>
            <Badge variant="secondary">
              {profile.fields.length} columns
            </Badge>
            {profile.metadata.sheetName && (
              <Badge variant="outline" className="gap-1">
                <span>Sheet: {profile.metadata.sheetName}</span>
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Imported {new Date(profile.metadata.importedAt).toLocaleTimeString()} • Health Score: {profile.qualityScore}/100
          </p>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setClearModalOpen(true)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear Data
          </Button>

          <Link href="/app/report">
            <Button size="sm" className="gap-2 shadow-sm shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
              <span>Generate Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Reversible Data Cleaning Toolbar (PRD Section 7.3) */}
      <Card className="p-3 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">
            Cleaning Tools:
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={applyTrimWhitespace}
            className="text-xs h-8"
          >
            Trim Spaces
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={applyNormalizeBlanks}
            className="text-xs h-8"
          >
            Normalize Blanks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={applyRemoveDuplicates}
            className="text-xs h-8"
          >
            Remove Duplicates
          </Button>
        </div>

        {/* Undo, Redo, and History */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!canUndo}
            onClick={undo}
            className="h-8 gap-1 text-xs"
            title="Undo last cleaning operation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!canRedo}
            onClick={redo}
            className="h-8 gap-1 text-xs"
            title="Redo cleaning operation"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Redo</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setHistoryModalOpen(true)}
            className="h-8 gap-1 text-xs font-medium"
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Log ({transformations.length})</span>
          </Button>
        </div>
      </Card>

      {/* Quality Warnings Banner */}
      {profile.warnings.length > 0 && (
        <div className="space-y-2">
          {profile.warnings.map((w) => (
            <div
              key={w.id}
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                w.severity === "critical"
                  ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300"
                  : w.severity === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300"
                  : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300"
              }`}
            >
              {w.severity === "critical" || w.severity === "warning" ? (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-semibold">{w.title}: </span>
                <span>{w.description}</span>
                {w.recommendedAction && (
                  <span className="font-medium ml-1 underline">{w.recommendedAction}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs Switcher: Table View vs Data Dictionary */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("table")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "table"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Table Preview
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "profile"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Data Dictionary & Profiler ({profile.fields.length} Columns)
          </button>
        </div>

        {activeTab === "table" && (
          <div className="flex items-center gap-2 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search rows..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: Table Preview */}
      {activeTab === "table" && (
        <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase font-semibold z-10 border-b border-slate-200 dark:border-slate-700 select-none">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-slate-400 text-center font-mono">
                    #
                  </th>
                  {profile.fields.map((field) => (
                    <th
                      key={field.id}
                      className="py-2.5 px-3 whitespace-nowrap group hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleSort(field.name)}
                          className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          {getTypeIcon(field.userType)}
                          <span>{field.name}</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                        </button>

                        {/* Column menu trigger */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setTypeDropdownFieldId(
                                typeDropdownFieldId === field.id ? null : field.id
                              )
                            }
                            className="p-1 rounded hover:bg-slate-300/50 dark:hover:bg-slate-600 text-slate-400 hover:text-slate-700"
                            title="Change column type or rename"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {/* Quick Dropdown for Type Override */}
                          {typeDropdownFieldId === field.id && (
                            <div className="absolute right-0 top-6 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-30 space-y-1">
                              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Change Type
                              </p>
                              {(
                                [
                                  "number",
                                  "integer",
                                  "date",
                                  "categorical",
                                  "text",
                                  "boolean",
                                  "identifier",
                                ] as DataType[]
                              ).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => {
                                    applyOverrideType(field.id, t);
                                    setTypeDropdownFieldId(null);
                                  }}
                                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs transition-colors ${
                                    field.userType === t
                                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold"
                                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  }`}
                                >
                                  <span className="capitalize">{t}</span>
                                  {field.userType === t && <Check className="w-3 h-3" />}
                                </button>
                              ))}

                              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                              <button
                                onClick={() => {
                                  setRenameFieldId(field.id);
                                  setNewFieldName(field.name);
                                  setRenameModalOpen(true);
                                  setTypeDropdownFieldId(null);
                                }}
                                className="w-full text-left px-2 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                              >
                                Rename Column...
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Drop column "${field.name}" from dataset?`)) {
                                    applyDropColumn(field.id);
                                    setTypeDropdownFieldId(null);
                                  }
                                }}
                                className="w-full text-left px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                              >
                                Drop Column
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900 font-mono text-[11px]">
                {displayedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-2 px-3 text-slate-400 text-center font-mono select-none">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    {profile.fields.map((field) => {
                      const val = row[field.name] ?? row[field.originalName];
                      const isNull = val === null || val === undefined;
                      const isEmpty = typeof val === "string" && val.trim() === "";

                      return (
                        <td key={field.id} className="py-2 px-3 whitespace-nowrap">
                          {isNull ? (
                            <span className="text-slate-300 dark:text-slate-600 italic">
                              null
                            </span>
                          ) : isEmpty ? (
                            <span className="text-slate-300 dark:text-slate-600 italic">
                              [empty]
                            </span>
                          ) : (
                            <span className="text-slate-800 dark:text-slate-200">
                              {String(val)}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filteredRows.length)} of{" "}
              {filteredRows.length.toLocaleString()} rows
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-7 text-xs"
              >
                Previous
              </Button>
              <span className="text-slate-500 font-mono">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="h-7 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* TAB 2: Data Dictionary & Profiler */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.fields.map((field) => (
            <Card key={field.id} className="p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {getTypeIcon(field.userType)}
                      <span>{field.name}</span>
                    </h4>
                    {field.originalName !== field.name && (
                      <p className="text-[10px] text-slate-400 font-mono">
                        Header: {field.originalName}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="capitalize text-[10px]">
                    {field.userType}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Missing:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {field.missingPercentage.toFixed(1)}% ({field.nullCount + field.emptyStringCount})
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">Distinct:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {field.distinctCount.toLocaleString()}
                    </p>
                  </div>
                  {field.min !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Min:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {field.min}
                      </p>
                    </div>
                  )}
                  {field.max !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Max:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {field.max}
                      </p>
                    </div>
                  )}
                  {field.mean !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Mean:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {field.mean}
                      </p>
                    </div>
                  )}
                  {field.median !== undefined && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Median:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {field.median}
                      </p>
                    </div>
                  )}
                  {field.minDate && (
                    <div className="col-span-2">
                      <span className="text-slate-400 text-[10px] uppercase">Date Range:</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {field.minDate} to {field.maxDate}
                      </p>
                    </div>
                  )}
                </div>

                {/* Top Values for Categorical */}
                {field.topValues && field.topValues.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Top Values
                    </p>
                    <div className="space-y-1">
                      {field.topValues.map((tv) => (
                        <div
                          key={tv.value}
                          className="flex items-center justify-between text-xs font-mono"
                        >
                          <span className="truncate max-w-[150px] text-slate-700 dark:text-slate-300">
                            {tv.value}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {tv.count} ({tv.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Type Override Action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Role: <strong className="capitalize">{field.role}</strong>
                </span>
                <Select
                  value={field.userType}
                  onChange={(e) => applyOverrideType(field.id, e.target.value as DataType)}
                  className="h-7 text-xs w-28"
                  aria-label="Change column data type"
                >
                  <option value="number">Number</option>
                  <option value="integer">Integer</option>
                  <option value="date">Date</option>
                  <option value="categorical">Category</option>
                  <option value="text">Text</option>
                  <option value="boolean">Boolean</option>
                  <option value="identifier">Identifier</option>
                </Select>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Audit Log / History Modal (PRD Section 7.3) */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Transformation Audit Log"
        description="Event-sourced history of all cleaning steps applied to this dataset."
        maxWidth="md"
      >
        <div className="space-y-4">
          {transformations.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center italic">
              No cleaning operations have been applied yet. Original raw snapshot active.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {transformations.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex items-start gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {step.description}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setHistoryModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear Dataset from Memory?"
        description="This will permanently remove the working dataset and original snapshot from this session."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            All unsaved formulas and dashboard configurations will be wiped. You can re-upload your file at any time.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setClearModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                clearDataset();
                setClearModalOpen(false);
                router.push("/app");
              }}
            >
              Confirm Clear
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title="Rename Column"
        description="Enter a new display name for this column."
        maxWidth="sm"
      >
        <div className="space-y-4">
          <Input
            label="Column Name"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="e.g. Total Revenue"
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRenameModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!newFieldName.trim()}
              onClick={() => {
                if (renameFieldId && newFieldName.trim()) {
                  applyRenameColumn(renameFieldId, newFieldName);
                  setRenameModalOpen(false);
                }
              }}
            >
              Save Name
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
