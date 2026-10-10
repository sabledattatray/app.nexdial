import React, { Suspense } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DatasetProvider } from "@/context/DatasetContext";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DatasetProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <AppHeader />
        <div className="flex flex-1">
          <Suspense fallback={<aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 hidden md:flex shrink-0" />}>
            <AppSidebar />
          </Suspense>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full">
            <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading workspace...</div>}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </DatasetProvider>
  );
}
