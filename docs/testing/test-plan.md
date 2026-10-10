# Test Plan & Verification Strategy — OpenMIS

> **Version:** 1.0.0  
> **Framework:** Vitest + React Testing Library  
> **Date:** October 10, 2026  

---

## 1. Test Suite Architecture

```
src/__tests__/
├── unit/
│   ├── ingestion/
│   │   ├── type-inference.test.ts   # Number, Date, Boolean, Categorical, ID
│   │   ├── data-profiler.test.ts    # Null rate, cardinality, min/max/mean
│   │   └── transformations.test.ts  # Trim, dedupe, filter, undo/redo
│   ├── analytics/
│   │   ├── metrics-engine.test.ts   # SUM, AVG, MIN, MAX, safeDivide
│   │   └── insights-engine.test.ts  # Concentration, IQR outliers, MoM growth
│   └── security/
│       ├── formula-sanitizer.test.ts # DDE injection attack mitigation
│       └── report-schema.test.ts    # Zod validation boundary tests
├── integration/
│   ├── local-storage.test.ts        # IndexedDB session persistence
│   └── template-loader.test.ts      # 7 MIS template dataset loaders
└── accessibility/
    └── widget-table-toggle.test.ts  # Screen-reader table alternative tests
```

---

## 2. Verification Commands

```bash
# Execute full Vitest suite
npm test

# Run TypeScript strict type-check
npx tsc --noEmit

# Run Next.js production build verification
npm run build
```
