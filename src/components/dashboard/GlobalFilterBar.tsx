"use client";

import React, { useState, useMemo } from "react";
import { FieldMetadata, RowData } from "@/domain/dataset/types";
import { ReportFilter } from "@/domain/report/schema";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Filter,
  Plus,
  X,
  Trash2,
  Calendar,
  Layers,
  Hash,
} from "lucide-react";

interface GlobalFilterBarProps {
  fields: FieldMetadata[];
  rows: RowData[];
  filteredCount: number;
  totalCount: number;
  filters: ReportFilter[];
  onAddFilter: (filter: ReportFilter) => void;
  onRemoveFilter: (filterId: string) => void;
  onClearFilters: () => void;
}

export function GlobalFilterBar({
  fields,
  rows,
  filteredCount,
  totalCount,
  filters,
  onAddFilter,
  onRemoveFilter,
  onClearFilters,
}: GlobalFilterBarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");

  // Categorical multi-select state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Date range state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  // Numeric range state
  const [minVal, setMinVal] = useState<string>("");
  const [maxVal, setMaxVal] = useState<string>("");

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId),
    [fields, selectedFieldId]
  );

  // Distinct values for selected categorical field
  const distinctValues = useMemo(() => {
    if (!selectedField) return [];
    const set = new Set<string>();
    for (const r of rows) {
      const val = r[selectedField.name];
      if (val !== null && val !== undefined && val !== "") {
        set.add(String(val).trim());
      }
    }
    return Array.from(set).sort();
  }, [selectedField, rows]);

  const handleOpenAddModal = () => {
    const firstField = fields[0]?.id || "";
    setSelectedFieldId(firstField);
    setSelectedCategories([]);
    setStartDate("");
    setEndDate("");
    setMinVal("");
    setMaxVal("");
    setModalOpen(true);
  };

  const handleFieldChange = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setSelectedCategories([]);
    setStartDate("");
    setEndDate("");
    setMinVal("");
    setMaxVal("");
  };

  const handleApplyFilter = () => {
    if (!selectedField) return;

    if (selectedField.role === "dimension" || selectedField.userType === "categorical") {
      if (selectedCategories.length === 0) return;
      onAddFilter({
        id: `filter_${selectedField.id}_${Date.now()}`,
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        type: "categorical",
        operator: "in",
        values: selectedCategories,
      });
    } else if (selectedField.role === "time_dimension" || selectedField.userType === "date") {
      if (!startDate && !endDate) return;
      onAddFilter({
        id: `filter_${selectedField.id}_${Date.now()}`,
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        type: "date_range",
        operator: "between",
        values: [startDate, endDate],
      });
    } else {
      if (!minVal && !maxVal) return;
      onAddFilter({
        id: `filter_${selectedField.id}_${Date.now()}`,
        fieldId: selectedField.id,
        fieldName: selectedField.name,
        type: "numeric_range",
        operator: "between",
        values: [minVal ? Number(minVal) : -Infinity, maxVal ? Number(maxVal) : Infinity],
      });
    }

    setModalOpen(false);
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 p-3 sm:p-4 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Active Filters
          </span>
          {filters.length > 0 && (
            <Badge variant="accent" className="text-[10px] px-1.5 py-0.2">
              {filters.length}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {filteredCount === totalCount ? (
              <span>All {totalCount.toLocaleString()} rows</span>
            ) : (
              <span>
                <strong>{filteredCount.toLocaleString()}</strong> of{" "}
                {totalCount.toLocaleString()} rows (
                {Math.round((filteredCount / totalCount) * 100)}%)
              </span>
            )}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenAddModal}
            className="h-8 gap-1 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Filter</span>
          </Button>

          {filters.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearFilters}
              className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      {filters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {filters.map((f) => (
            <div
              key={f.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
            >
              {f.type === "categorical" && <Layers className="w-3 h-3 text-indigo-500" />}
              {f.type === "date_range" && <Calendar className="w-3 h-3 text-emerald-500" />}
              {f.type === "numeric_range" && <Hash className="w-3 h-3 text-blue-500" />}

              <span>
                <strong>{f.fieldName}:</strong>{" "}
                {f.type === "categorical"
                  ? `${f.values.length} selected`
                  : f.type === "date_range"
                  ? `${f.values[0] || "Start"} to ${f.values[1] || "End"}`
                  : `${f.values[0] ?? "Min"} – ${f.values[1] ?? "Max"}`}
              </span>

              <button
                onClick={() => onRemoveFilter(f.id)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded"
                title="Remove filter"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic pt-1">
          No filters applied. Dashboard is analyzing the full dataset.
        </p>
      )}

      {/* Add Filter Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Dashboard Filter"
        description="Filter all KPI metrics and charts across this dataset in real-time"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Column:
            </label>
            <Select
              value={selectedFieldId}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="w-full text-xs"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.userType} • {f.role})
                </option>
              ))}
            </Select>
          </div>

          {/* Categorical Value Picker */}
          {selectedField &&
            (selectedField.role === "dimension" ||
              selectedField.userType === "categorical") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    Allowed Values ({distinctValues.length} available):
                  </label>
                  <div className="flex items-center gap-2 text-[11px] text-indigo-600 dark:text-indigo-400">
                    <button
                      type="button"
                      onClick={() => setSelectedCategories(distinctValues)}
                      className="hover:underline"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategories([])}
                      className="hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg p-2 space-y-1 bg-slate-50 dark:bg-slate-900/50">
                  {distinctValues.map((val) => {
                    const isChecked = selectedCategories.includes(val);
                    return (
                      <label
                        key={val}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(val)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-800 dark:text-slate-200 truncate">
                          {val}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Date Range Picker */}
          {selectedField &&
            (selectedField.role === "time_dimension" ||
              selectedField.userType === "date") && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Date:
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Date:
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            )}

          {/* Numeric Range Picker */}
          {selectedField &&
            (selectedField.role === "measure" ||
              selectedField.userType === "number" ||
              selectedField.userType === "integer") && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Minimum Value:
                  </label>
                  <Input
                    type="number"
                    placeholder={selectedField.min !== undefined ? String(selectedField.min) : "Min"}
                    value={minVal}
                    onChange={(e) => setMinVal(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maximum Value:
                  </label>
                  <Input
                    type="number"
                    placeholder={selectedField.max !== undefined ? String(selectedField.max) : "Max"}
                    value={maxVal}
                    onChange={(e) => setMaxVal(e.target.value)}
                    className="w-full text-xs"
                  />
                </div>
              </div>
            )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleApplyFilter}>
              Apply Filter
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
