# Data Flow Architecture — OpenMIS

> **Version:** 1.0.0  
> **Date:** October 10, 2026  

---

## 1. Lifecycle of a Spreadsheet Session

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Analyst
    participant UI as React 19 UI Thread
    participant Worker as parser.worker.ts
    participant Profiler as Type & Profiling Engine
    participant Store as Session Store (Zustand)
    participant ECharts as Apache ECharts Engine
    participant IDB as IndexedDB (openmis-db)

    User->>UI: Selects file (drag-drop or file picker)
    UI->>Worker: postMessage(fileBuffer, config)
    Worker->>Worker: Parse with SheetJS CE / PapaParse
    Worker-->>UI: postMessage(parsedRows, columns)
    UI->>Profiler: Run profileDataset(rows)
    Profiler-->>Store: Store rawSnapshot, columnProfiles, workingDataset
    Store-->>UI: Render Data Profiler & Quality Metrics
    
    opt User Applies Clean Transformation
        User->>UI: Click "Trim Whitespace" / "Remove Duplicates"
        UI->>Store: applyOperation(operation)
        Store->>Store: Re-compute workingDataset from rawSnapshot
        Store-->>UI: Updated table preview & row counts
    end

    Store->>UI: Generate Auto-Dashboard Recommendation
    UI->>ECharts: Mount ECharts with safeResize hook
    
    opt User Customizes Report
        User->>UI: Edit Widget in Inspector Modal
        UI->>Store: updateWidget(widgetId, updates)
        Store->>IDB: autoSaveSession(sessionData)
    end
```

---

## 2. In-Memory Dual Dataset Representation

OpenMIS prevents data loss by maintaining a dual dataset model in the client state:
- `rawSnapshot`: The immutable snapshot of parsed rows directly from the uploaded file or template.
- `transformations`: An ordered array of `TransformationOperation` objects:
  - `TRIM_WHITESPACE`
  - `REMOVE_DUPLICATES`
  - `FILTER_ROWS`
  - `DROP_COLUMNS`
  - `RENAME_COLUMN`
  - `CHANGE_COLUMN_TYPE`
- `workingDataset`: Derived deterministically by applying `transformations` sequentially to `rawSnapshot`.
- **Undo / Redo:** Undoing simply pops from the transformation stack and re-evaluates the pipeline in memory.
