/**
 * Centralized Brand & Application Constants
 *
 * Per PRD Section 1: Working title "OpenMIS" is centralized here
 * so that name, branding, tagline, and repository metadata can be
 * updated easily without scattered hard-coded strings.
 */

export const BRAND = {
  name: "OpenMIS",
  appName: "Nexdial OpenMIS",
  orgName: "Nexdial",
  domain: "app.nexdial.io",
  url: "https://app.nexdial.io",
  legalNotice: "OpenMIS is an open-source, community-driven project by Nexdial.",
  tagline: "Free, Privacy-First MIS & Excel Dashboard Builder",
  description:
    "Turn spreadsheets into interactive business dashboards in minutes. 100% browser-side processing, zero accounts required, and zero telemetry of your spreadsheet data.",
  version: "1.0.0-alpha",
  year: 2026,
  twitterHandle: "@nexdial",
  budgetNotice: "Strict ₹0 operating cost — completely free and open source.",
  privacyPromise:
    "Your data never leaves your device. All calculations, parsing, and chart rendering run locally in your browser.",
  links: {
    github: "https://github.com/openmis/openmis",
    issues: "https://github.com/openmis/openmis/issues",
    license: "/license",
    privacy: "/privacy",
    terms: "/terms",
  },
  limits: {
    maxFileSizeMb: 50,
    maxRecommendedRows: 100000,
    maxHardRowLimit: 250000,
  },
} as const;
