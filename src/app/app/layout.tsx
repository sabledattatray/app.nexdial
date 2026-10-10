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
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 print:bg-white print:text-slate-900 print:min-h-0 print:block">
        <div className="print:hidden">
          <AppHeader />
        </div>
        <div className="flex flex-1 min-w-0 print:block print:w-full">
          <div className="print:hidden shrink-0">
            <Suspense fallback={<aside className="w-64 border-r border-slate-200 bg-white dark:border-slate-800 hidden md:flex shrink-0 print:hidden" />}>
              <AppSidebar />
            </Suspense>
          </div>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden min-w-0 max-w-7xl w-full print:p-0 print:m-0 print:max-w-none print:w-full print:overflow-visible">
            <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading workspace...</div>}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </DatasetProvider>
  );
}
