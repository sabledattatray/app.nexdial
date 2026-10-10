import React, { Suspense } from "react";
import DataProfilingPage from "../page";

export default function DatasetDynamicPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading dataset profiling...</div>}>
      <DataProfilingPage />
    </Suspense>
  );
}
