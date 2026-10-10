# Changelog

All notable changes to OpenMIS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-10

### Added
- **Core Platform Foundation:** Next.js 15 App Router scaffold, design tokens, light/dark mode, accessible primitives (`Button`, `Card`, `Badge`, `Modal`, `Tabs`, `Table`, `Input`, `Select`, `Tooltip`).
- **Client-Side Ingestion & Profiler:** Web Worker parsing for CSV and XLSX files using PapaParse and SheetJS CE, automated type inference, missing value rate analysis, and cardinality detection.
- **Reversible Cleaning Engine:** Operations stack supporting whitespace trimming, row deduplication, threshold filtering, and column drops with full undo/redo history.
- **Deterministic Analytics Engine:** Core mathematical aggregations (`SUM`, `AVERAGE`, `COUNT`, `DISTINCT_COUNT`, `MIN`, `MAX`, `MEDIAN`), derived percentage growth, and IQR outlier detection with `safeDivide` zero-denominator protection.
- **ECharts Visualization Canvas:** Custom React 19 hook (`useECharts.ts`) with `ResizeObserver`, theme sync, responsive grid, and accessible "Switch to Data Table" toggle on every widget.
- **Visual Report Editor & Persistence:** Interactive Widget Inspector modal, global/widget filter pills, versioned `ReportDefinitionSchema v1.0.0` validated via Zod, and local persistence in IndexedDB (`openmis-db`).
- **Export Sanitization (Anti-DDE):** Multi-pass formula injection sanitizer prefixing dangerous spreadsheet characters (`=`, `+`, `-`, `@`, `\t`, `\r`) with single quotes (`'`) on CSV/XLSX export.
- **7 Production Business Templates:** Sales, Finance, Inventory, HR, Operations, Marketing, and Project status templates with synthetic datasets.
- **SEO & Marketing Ecosystem:** 8 dedicated landing pages, 4 educational guides, dynamic XML sitemap, robots.txt, and complete transparency documentation suite.
