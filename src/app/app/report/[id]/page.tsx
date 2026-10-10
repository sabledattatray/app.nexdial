import React, { Suspense } from "react";
import ReportDashboardPage from "../page";

export default function ReportDynamicPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-slate-500 animate-pulse">
          Loading report dashboard...
        </div>
      }
    >
      <ReportDashboardPage />
    </Suspense>
  );
}
