# Privacy Model & Data Boundary Specification — OpenMIS

> **Version:** 1.0.0  
> **Status:** Active  
> **Date:** October 10, 2026  

---

## 1. Zero-Telemetry Policy

OpenMIS strictly enforces a **zero-telemetry** privacy boundary for user spreadsheet data:
1. **Zero File Ingestion Endpoints:** OpenMIS operates without backend APIs for file ingestion or storage.
2. **Zero Telemetry of Field or Cell Values:** No row contents, column headers, filenames, or report configurations are transmitted to remote monitoring or analytics services.
3. **No Mandatory Third-Party Scripts:** The application core contains no tracking pixels, ad networks, or external telemetry libraries.

---

## 2. Browser Execution Boundary

```
[ User Device / Operating System ]
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Web Browser Process (Chrome, Edge, Firefox, Safari)     │
│                                                        │
│  ┌───────────────────────┐   ┌───────────────────────┐ │
│  │ React UI Main Thread  │   │ parser.worker.ts      │ │
│  │ - ECharts Canvas      │   │ - PapaParse           │ │
│  │ - Widget Inspector    │   │ - SheetJS CE          │ │
│  └───────────┬───────────┘   └───────────┬───────────┘ │
│              │                           │             │
│              ▼                           ▼             │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Browser RAM (Heap Memory)                         │ │
│  │ - rawSnapshot                                     │ │
│  │ - workingDataset                                  │ │
│  └───────────────────────────┬───────────────────────┘ │
│                              │                         │
│                              ▼                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Origin-Isolated Storage: IndexedDB (openmis-db)   │ │
│  └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 3. Data Deletion & Session Cleanup

OpenMIS provides an explicit **"Clear Data"** action within the workspace. When triggered:
1. Active Web Workers are terminated.
2. In-memory dataset stores (`rawSnapshot`, `workingDataset`, `transformations`) are garbage collected.
3. Local IndexedDB database records are deleted.
4. The application state transitions back to a clean upload state.
