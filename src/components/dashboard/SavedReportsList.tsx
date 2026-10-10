"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FolderOpen, ArrowRight, BarChart2 } from "lucide-react";
import { listSavedReportsLocally } from "@/lib/storage/report-storage";
import { ReportDefinition } from "@/domain/report/schema";

export function SavedReportsList() {
  const [reports, setReports] = useState<ReportDefinition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    listSavedReportsLocally().then((list) => {
      if (isMounted) {
        setReports(list);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Card className="p-4 text-center text-xs text-slate-400">
        Checking local browser storage...
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="p-6 text-center text-sm text-slate-500 dark:text-slate-400 border-dashed">
        <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p>No reports saved in this browser yet.</p>
        <p className="text-xs text-slate-400 mt-1">
          Saved reports remain in your browser&apos;s IndexedDB storage and are never uploaded to the cloud.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2.5">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="p-3.5 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-2xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                {report.title}
              </p>
              <p className="text-[11px] text-slate-400">
                {report.widgets.length} widgets • Saved{" "}
                {new Date(report.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Link href="/app/report">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
              <span>Open</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </Card>
      ))}
    </div>
  );
}
