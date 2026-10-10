# Contributing to OpenMIS

Thank you for your interest in contributing to OpenMIS! OpenMIS is an open-source, community-driven project built to provide a free, privacy-first alternative for spreadsheet intelligence and MIS dashboard reporting.

---

## 1. Principles & Ground Rules

1. **Strict ₹0 Operating Budget:** No required dependencies or integrations may require paid API keys, paid subscriptions, or proprietary cloud infrastructure.
2. **Client-Side Data Privacy:** Any core data ingestion, parsing, profiling, and analytics features must execute locally inside the browser sandbox. Never transmit user spreadsheet rows or columns to remote endpoints.
3. **Deterministic Mathematics:** All metrics and insights must be backed by transparent, deterministic formulas. No AI hallucinations or unverified approximations.
4. **Permissive Licensing:** Any added npm dependencies must be licensed under MIT, Apache 2.0, BSD, or ISC. Copyleft (GPL/AGPL) and proprietary licenses are prohibited.

---

## 2. Development Setup

OpenMIS is built on Next.js 15 App Router, TypeScript strict mode, Tailwind CSS, Apache ECharts, and Vitest.

```bash
# Clone repository
git clone https://github.com/openmis/openmis.git
cd openmis

# Install dependencies (strictly with package-lock)
npm install

# Run local development server
npm run dev

# Run Vitest unit tests
npm test

# Run TypeScript type check
npx tsc --noEmit

# Run production build
npm run build
```

---

## 3. Coding Standards & Conventions

- **TypeScript:** Strict type checking is enforced. Avoid `any` types; define explicit interfaces or Zod schemas.
- **React 19 / Next.js 15:** 
  - Do not call `setState` inside `useEffect` for derived or initial state. Use pure computation or pass `key` to reset components.
  - Do not call non-pure functions like `Date.now()` during component render.
  - Keep interactive components marked with `"use client"` where state hooks are required.
- **Accessibility:** All chart widgets must provide a screen-reader accessible data table toggle (`Switch to Data Table`). Maintain ARIA landmarks and keyboard accessibility.
- **Testing:** New metrics, parsers, or cleaning transformations must include comprehensive Vitest test coverage in `src/__tests__/`.

---

## 4. Pull Request Workflow

1. Fork the repository and create a feature branch (`git checkout -b feature/my-enhancement`).
2. Implement your changes following our code standards.
3. Run the full verification suite:
   ```bash
   npm test
   npx tsc --noEmit
   npm run lint
   npm run build
   ```
4. Commit your changes with clear conventional commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
5. Open a Pull Request on GitHub. Never include real corporate or personal confidential spreadsheet data in test fixtures.
