"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Trash2,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";

export default function SettingsPage() {
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearAllStorage = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all locally saved reports and memory? This action cannot be undone."
      )
    ) {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        // Clear IndexedDB databases if accessible
        if (window.indexedDB && window.indexedDB.databases) {
          window.indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) window.indexedDB.deleteDatabase(db.name);
            });
          });
        }
      }
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Workspace Settings & Storage
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your browser storage, preferences, and privacy controls.
            </p>
          </div>
          <Badge variant="outline" className="gap-1">
            <HardDrive className="w-3 h-3" />
            <span>Local Browser Storage</span>
          </Badge>
        </div>
      </div>

      {clearedNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>All local reports and session data have been successfully cleared.</span>
        </div>
      )}

      {/* Storage Information */}
      <Card className="p-6 space-y-6">
        <CardHeader className="p-0">
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Browser Data Retention</span>
          </CardTitle>
          <CardDescription>
            OpenMIS does not maintain server-side accounts. All reports, custom formulas, and preferences are stored exclusively on your current device via IndexedDB and LocalStorage.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Important Browser Notice (PRD Section 7.10):
            </p>
            <p>
              Clearing your browser cache or site cookies will delete your locally saved reports. Always export your report definitions (`.json`) or export your final summaries to CSV/PDF before wiping your browser history.
            </p>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Wipe All Local Storage</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Removes all cached datasets, report layouts, and preferences from this device.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={handleClearAllStorage}
              className="gap-2 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Local Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Pledge */}
      <Card className="p-6 bg-slate-900 text-white dark:bg-slate-900/90 border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Zero-Telemetry Policy</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          OpenMIS never collects file contents, column names, cell values, or generated charts. All analytical operations run purely in client-side Web Workers.
        </p>
      </Card>
    </div>
  );
}
