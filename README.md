# OpenMIS — Free, Privacy-First MIS & Excel Dashboard Builder

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Budget](https://img.shields.io/badge/Budget-%E2%82%B90%20Zero%20Cost-emerald.svg)](COSTS.md)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-indigo.svg)](SECURITY.md)

OpenMIS turns spreadsheet files (`.csv`, `.xlsx`) into interactive business intelligence dashboards and executive reports in minutes—without mandatory account registration, paid AI subscriptions, or transmitting your data over the cloud.

---

## 🚀 Key Highlights

- **🔒 100% Privacy by Design:** All parsing, field profiling, formula evaluation, and chart rendering happen client-side in your browser via Web Workers. Zero file rows or headers leave your device.
- **📊 Deterministic Analytics:** Factual, mathematically verifiable metrics (Sum, Average, Min, Max, Count, Variance, MoM, YoY). No hallucinated explanations or numbers.
- **📑 7 Business MIS Templates:** Ready-to-use templates for Sales, Finance & Expenses, Inventory, HR Headcount, Operations/SLA, Marketing, and Project Tasks.
- **🛡️ Secure Exports:** Clean CSV, XLSX, and print-ready PDF reports with automated formula injection (`=`, `+`, `@`) sanitization.
- **⚡ ₹0 Operating Cost:** 100% open-source permissive licensing (MIT, Apache-2.0). No paid APIs or databases required.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+ App Router](https://nextjs.org/) + [React 19](https://react.dev/)
- **Language:** TypeScript in strict mode
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with CSS variables
- **Visualizations:** [Apache ECharts](https://echarts.apache.org/) via native React 19 hook
- **File Parsing:** [PapaParse](https://www.papaparse.com/) (CSV) + SheetJS Community Edition (`xlsx`)
- **Storage:** Browser IndexedDB via [`idb`](https://github.com/jakearchibald/idb)
- **Validation:** [Zod](https://zod.dev/)
- **Testing:** [Vitest](https://vitest.dev/) + React Testing Library

---

## 📦 Getting Started

### Prerequisites
- Node.js `20.x` or later (tested on Node 24 LTS)
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

### Running Tests
```bash
# Run unit and domain tests
npm test

# Run build verification
npm run build
```

---

## 📄 License & Cost Disclosures

- **License:** [MIT License](LICENSE)
- **Cost Policy:** [COSTS.md](COSTS.md)
- **Security Policy:** [SECURITY.md](SECURITY.md)
