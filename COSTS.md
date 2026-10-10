# OpenMIS: Zero-Budget Architecture & Operational Cost Controls (COSTS.md)

> **Document Status:** Verified & Active  
> **Last Checked:** October 10, 2026  
> **Target Out-of-Pocket Budget:** ₹0 (Zero rupees)  
> **Commercial Dependencies:** None  
> **Mandatory Paid APIs:** None  

---

## 1. Zero-Cost Architectural Commitment

OpenMIS is explicitly architected to operate with **₹0 out-of-pocket expenses** for both development and user operation:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Zero-Budget Cost Controls                       │
├────────────────────────────────────────────────────────────────────────┤
│  Layer                  Mechanism                   Cost Status       │
│  ────────────────────────────────────────────────────────────────────  │
│  File Ingestion         Browser Web Worker (Local)  ₹0 / month        │
│  Data Profiling         Pure TypeScript in Browser  ₹0 / month        │
│  KPI Calculations       Deterministic Math Engine   ₹0 / month        │
│  Insights Engine        IQR & Statistical Rules     ₹0 (No Paid AI)   │
│  Chart Rendering        Apache ECharts (Client SVG) ₹0 / month        │
│  Report Storage         IndexedDB (User Device)     ₹0 / month        │
│  Hosting (Static)       Vercel / Cloudflare / Netlify Free Tier       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dependency License & Cost Audit

Every package used in OpenMIS has been inspected for strict permissive open-source licensing:

| Dependency | License | Commercial Cost | Verification Link |
|---|---|---|---|
| **Next.js** | MIT | ₹0 | https://github.com/vercel/next.js |
| **React** | MIT | ₹0 | https://github.com/facebook/react |
| **Tailwind CSS** | MIT | ₹0 | https://github.com/tailwindlabs/tailwindcss |
| **Apache ECharts** | Apache-2.0 | ₹0 | https://github.com/apache/echarts |
| **PapaParse** | MIT | ₹0 | https://github.com/mholt/PapaParse |
| **SheetJS (xlsx)** | Apache-2.0 (CE) | ₹0 | Verified Community Edition |
| **Zod** | MIT | ₹0 | https://github.com/colinhacks/zod |
| **idb** | MIT | ₹0 | https://github.com/jakearchibald/idb |
| **Lucide Icons** | ISC / MIT | ₹0 | https://github.com/lucide-icons/lucide |
| **Vitest** | MIT | ₹0 | https://github.com/vitest-dev/vitest |

---

## 3. Hosting & Deployment Cost Parameters

1. **Local Usage:**
   - Always 100% free with `npm run dev` or local build.
2. **Public Production Hosting (Free Tier Compatible):**
   - **Vercel Hobby Tier:** ₹0/month (100GB bandwidth, static builds).
   - **Cloudflare Pages:** ₹0/month (unlimited bandwidth on static export).
   - **GitHub Pages:** ₹0/month (static export hosting).
3. **Guardrail Against Future Costs:**
   - No paid AI services (OpenAI, Anthropic, Gemini) are required for core reporting.
   - No cloud database (Postgres, MongoDB, Supabase) is required for local report storage.
   - Any future database connectors (Phase 9) will be strictly optional and self-hosted or user-provided.
