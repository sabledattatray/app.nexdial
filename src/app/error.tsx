"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { BRAND } from "@/lib/constants/brand";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error locally in development only (no telemetry of file data)
    if (process.env.NODE_ENV === "development") {
      console.error("OpenMIS Application Error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/60 mx-auto border border-rose-100 dark:border-rose-900/40">
          <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            An Unexpected Error Occurred
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The workspace encountered an unexpected issue while rendering. Your local data remains safe on your device.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} className="w-full sm:w-auto gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href="/app" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" />
              Workspace Home
            </Button>
          </Link>
        </div>

        <div className="rounded-lg bg-slate-100 dark:bg-slate-900 p-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Need help? You can report issues on </span>
          <a
            href={BRAND.links.issues}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 dark:text-indigo-400 font-medium underline"
          >
            GitHub Issues
          </a>
          <span> without attaching sensitive data.</span>
        </div>
      </div>
    </div>
  );
}
