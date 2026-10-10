# OpenMIS — Free, Privacy-First MIS & Excel Dashboard Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Budget](https://img.shields.io/badge/Budget-%E2%82%B90%20Zero%20Cost-emerald.svg)](COSTS.md)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-indigo.svg)](SECURITY.md)

OpenMIS turns spreadsheet files (`.csv`, `.xlsx`, `.xls`) into interactive business intelligence dashboards and executive reports in minutes—without mandatory account registration, paid AI subscriptions, or transmitting your data over the cloud.

---

## 🚀 Key Highlights

- **🔒 100% Privacy by Design:** All parsing, field profiling, formula evaluation, and chart rendering happen client-side in your browser via Web Workers. Zero file rows or headers leave your device.
- **📊 Deterministic Analytics:** Factual, mathematically verifiable metrics (Sum, Average, Min, Max, Count, Variance, MoM, YoY). No hallucinated explanations or numbers.
- **📑 7 Business MIS Templates:** Ready-to-use templates for Sales, Finance & Expenses, Inventory, HR Headcount, Operations/SLA, Marketing, and Project Tasks.
- **🛡️ Secure Exports:** Clean CSV, XLSX, and print-ready PDF reports with automated formula injection (`=`, `+`, `@`, `\t`, `\r`) sanitization.
- **⚡ ₹0 Operating Cost:** 100% open-source permissive licensing (MIT, Apache-2.0, ISC). No paid APIs or databases required.
- **♿ Accessible Visualizations:** Every ECharts widget features a 1-click toggle to view a semantic HTML data table.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+ App Router](https://nextjs.org/) + [React 19](https://react.dev/)
- **Language:** TypeScript in strict mode
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with CSS variables
- **Visualizations:** [Apache ECharts](https://echarts.apache.org/) via native React 19 hook
- **File Parsing:** [PapaParse](https://www.papaparse.com/) (CSV) + SheetJS Community Edition (`xlsx`)
- **Storage:** Browser IndexedDB via [`idb`](https://github.com/jakearchibald/idb)
- **Validation:** [Zod](https://zod.dev/) (ReportDefinitionSchema v1.0.0)
- **Testing:** [Vitest](https://vitest.dev/) + React Testing Library

---

## 📦 Getting Started

### Prerequisites
- Node.js `20.x` or later (tested on Node 22/24 LTS)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/openmis/openmis.git
cd openmis

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verification & Testing
```bash
# Run unit and domain tests
npm test

# Run TypeScript typecheck
npx tsc --noEmit

# Run production build
npm run build
```

---

## 📚 Educational Guides & Use Cases

- [How to Clean Dirty Spreadsheet Data](src/app/guides/clean-excel-data)
- [Practical Guide to Choosing Chart Types](src/app/guides/choose-chart-types)
- [Calculating Sales Growth, Margins & Concentration](src/app/guides/sales-kpis-and-growth)
- [Preventing Spreadsheet DDE Formula Injection](src/app/guides/prevent-spreadsheet-errors)
- [Excel to Dashboard Generator](src/app/excel-to-dashboard)
- [CSV Dashboard Generator](src/app/csv-dashboard-generator)
- [Free MIS Report Generator](src/app/free-mis-report-generator)

---

## 📖 Architecture & Security Documentation

- [Architecture Overview](docs/architecture/overview.md)
- [Data Flow & Lifecycle](docs/architecture/data-flow.md)
- [Report Definition Schema v1.0.0](docs/architecture/report-schema.md)
- [Privacy Model](docs/security/privacy-model.md)
- [Threat Model & Mitigations](docs/security/threat-model.md)
- [Test Plan](docs/testing/test-plan.md)
- [Release Gate Checklist](docs/release/release-checklist.md)

---

## ⚖️ Known Limitations

- **Browser Memory Ceiling:** Datasets up to 100,000 rows run smoothly in modern browsers. Datasets beyond 250,000 rows may encounter browser memory limits.
- **Relational Joins:** OpenMIS currently operates on single worksheets or unnested tabular datasets; cross-file relational SQL joins are not supported in v1.0.0.

---

## 📄 License & Transparency

- **License:** [MIT License](LICENSE)
- **Third-Party Notices:** [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
- **Cost Policy:** [COSTS.md](COSTS.md)
- **Security Policy:** [SECURITY.md](SECURITY.md)
- **Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)
- **Changelog:** [CHANGELOG.md](CHANGELOG.md)
