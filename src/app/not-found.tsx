import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { BRAND } from "@/lib/constants/brand";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 mx-auto border border-indigo-100 dark:border-indigo-900/40">
          <FileQuestion className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page you requested could not be located. It may have been moved, or you may have entered an outdated report link.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/app" className="w-full sm:w-auto">
            <Button className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Workspace
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2">
              <Home className="w-4 h-4" />
              Home Page
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500">
          {BRAND.name} • {BRAND.tagline}
        </p>
      </div>
    </div>
  );
}
