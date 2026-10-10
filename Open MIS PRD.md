PROJECT PRD — FREE, PRIVACY-FIRST MIS & EXCEL DASHBOARD BUILDER Version:
1.0 Date: 10 October 2026 Purpose: Master product requirements and
implementation brief for Google Antigravity Working title: OpenMIS
(temporary; perform name/trademark/domain checks before public branding)
Budget constraint: ₹0 out-of-pocket for development and initial
prototype. No paid APIs, subscriptions, licenses, or infrastructure are
allowed as required dependencies. Product type: Production-minded,
open-source-first web application Primary audience: Excel users, MIS
executives, small businesses, students, freelancers, and analysts
IMPORTANT: This document is the specification. Do not treat every
future/advanced feature as a requirement for the first release. Build in
stages, keep the core working, and verify each stage before moving
forward.

======================================================================
0. EXECUTIVE SUMMARY
======================================================================

Build a polished, browser-first business intelligence and MIS reporting
web app that lets a user upload an Excel/CSV file, automatically
understand the data, generate a useful dashboard with
KPIs/charts/tables/insights, and customize the result without needing to
learn Power BI.

The product should be useful even without registration, a paid API key,
a cloud database, or a backend account. For supported files, prefer
client-side processing so data stays on the user’s device. The first
release must work with no AI provider configured. Insight generation
must be deterministic and based on actual calculated data; do not invent
causal explanations or numbers.

Long-term direction: evolve from a simple Excel-to-dashboard tool into a
privacy-first MIS reporting platform with reusable report templates, a
visual dashboard editor, calculated metrics, saved projects, data
refresh, and carefully secured optional database connections. Do not
claim feature parity with Power BI at launch. Compete on simplicity,
speed, privacy, useful defaults, and a great Excel-user experience.

The project must be genuinely implemented, not a static mockup. Every
visible primary action must work. Do not leave dead buttons, fake charts
presented as real analytics, hard-coded dashboard values after data
upload, or fake integrations.

====================================================================== 1.
PRODUCT VISION AND POSITIONING
======================================================================

Vision: “Turn a spreadsheet into a useful, customizable business report
in minutes — without a compulsory account, paid AI, or sending supported
data to a server.”

Core promise: 1. Upload a supported CSV/XLSX file. 2. Preview and
validate the dataset. 3. Automatically detect fields, data types, likely
dates, dimensions, and measures. 4. Generate a dashboard with relevant
KPIs, charts, tables, and factual insights. 5. Customize, filter,
rearrange, save, and export the report. 6. Keep the core workflow free
and usable without AI.

Positioning: - Primary: free, browser-first MIS report and Excel
dashboard generator. - Secondary: simple analytics tool for small
businesses and beginners. - Not a claim: “the complete replacement for
every Power BI feature.” - Differentiators: no mandatory login for local
workflow; privacy-first processing; MIS-oriented templates; automatic
but editable dashboards; clear calculations; accessible interface;
exportable reports; no required AI API key.

Branding: - Working title “OpenMIS” is temporary. Before release, verify
brand uniqueness, domain availability, trademarks, and
package/repository naming. Do not assume this name is available. - Build
a coherent visual identity that can be renamed through centralized brand
constants. - Avoid copying the visual identity, logo, wording, or
distinctive interface of Power BI or any competitor.

Product principles: - User value before feature count. -
Free/open-source-first dependencies. - Privacy by design. - Honest
claims and visible limitations. - Reliable calculations over impressive
but unreliable AI output. - Responsive, accessible, fast, and
maintainable. - No user lock-in: exports and report definitions should
be portable. - No fake “AI” labels for ordinary calculations. - Never
send user data to a third party without clear disclosure and explicit
opt-in.

======================================================================
2. TARGET USERS AND JOBS TO BE DONE
======================================================================

Persona A — MIS Executive: Needs recurring daily/weekly/monthly reports
from spreadsheets, KPI summaries, filters, variance analysis, and
exports. Success: a usable first dashboard in under a few minutes for a
supported, modest-sized dataset.

Persona B — Small Business Owner: Needs sales, expenses, inventory,
customer, and order summaries without hiring a data analyst. Success:
understands the main numbers and can download/share a report.

Persona C — Freelancer/Consultant: Needs repeatable report creation for
client datasets, professional presentation, and exportable results.
Success: can customize and reuse report layouts without rebuilding each
report.

Persona D — Student/Beginner: Needs to explore data, understand fields,
create charts, and learn analytics concepts. Success: receives
understandable chart suggestions and transparent formulas.

Persona E — Technical Analyst: Needs data profiling, SQL/database
connections in a later phase, and more control over aggregations and
measures. Success: advanced features do not make the basic workflow
intimidating.

Out of scope for initial release: - A full enterprise semantic model
comparable to mature commercial BI products. - Unlimited file size or
unlimited free hosted computation. - A hosted multi-tenant database
connector that can connect to arbitrary private IPs. - Paid AI as a
required workflow. - Financial, medical, legal, or other high-stakes
decision-making recommendations. - Automatic causal claims from
correlations. - Mobile-native applications. - A promise of 100% free
hosting forever.

======================================================================
3. SUCCESS METRICS
======================================================================

Instrument privacy-respecting, opt-in or aggregate metrics only. Do not
collect spreadsheet contents, column names, cell values, filenames, or
database credentials for analytics.

Product metrics to measure locally during testing and optionally via
privacy-conscious analytics after explicit configuration: - Time from
upload to first usable dashboard. - Percentage of supported files parsed
successfully. - Percentage of generated charts that render
successfully. - Percentage of users who modify at least one chart. -
Export success rate. - Error rate and recoverability. - Accessibility
audit results. - Core Web Vitals and route performance. - Search
impressions/clicks for relevant pages after launch. - Return usage only
if analytics are enabled transparently and lawfully.

Initial acceptance targets (targets, not guarantees): - A first
dashboard for a modest CSV/XLSX dataset in a few minutes or less on a
typical modern laptop. - No uncaught errors in primary upload-to-export
flow. - Every KPI displays its formula or a clear definition. - Every
generated insight can be traced to computed evidence. - No secrets or
uploaded file content appear in application logs. - No required paid
service to use the local file workflow. - Core pages usable on mobile
and desktop. - All primary workflows have automated tests.

======================================================================
4. USER JOURNEYS
======================================================================

Journey 1 — Instant dashboard: Landing page → “Create free dashboard” →
choose CSV/XLSX → upload → file validation → sheet selection if needed →
preview → data profile → generate dashboard → adjust filters/charts →
save locally/export.

Journey 2 — Fix data: Upload → system flags missing/duplicate/invalid
values → user reviews warnings → user chooses safe cleaning actions or
leaves original unchanged → preview cleaned data → generate report.
Never silently overwrite the source file.

Journey 3 — Customize report: Open dashboard → add chart/KPI/table →
choose fields → choose aggregation → adjust title, colors, sorting,
labels, filters → drag/resize widgets → undo/redo → save report
definition → reopen.

Journey 4 — Export: Dashboard → select PDF/print, image, CSV or XLSX
export as supported → preview → export → clear success/failure feedback.
Exports must use actual current data and filters.

Journey 5 — Return later: For the initial no-account experience, reopen
a locally saved report or import a downloaded report-definition file.
Clearly explain that browser storage may be cleared and does not sync
between devices. Cloud accounts are optional future scope, not required.

Journey 6 — Database connection (later, gated): Choose supported
database → read security and privacy explanation → enter connection
details in a secure server-side flow or use a safe local connection
option → verify connection → select allowed schemas/tables or enter a
read-only query → preview only permitted rows → create dashboard →
disconnect/revoke credentials. Do not implement arbitrary network access
in the browser or allow public server endpoints to connect to
user-supplied hosts without SSRF controls.

======================================================================
5. INFORMATION ARCHITECTURE AND PAGES
======================================================================

Public marketing pages: 1. Home. 2. Features. 3. How it works. 4. Use
cases / templates. 5. Privacy and security. 6. FAQ. 7. About / project
principles. 8. Blog / guides. 9. Contact / feedback. 10. Changelog /
roadmap. 11. Terms of use. 12. Privacy policy. 13. Open-source/license
page. 14. 404 page. 15. Status/known limitations page if useful.

Application routes (suggested; refine based on App Router): - /app —
workspace or welcome state. - /app/new — create report. - /app/import —
file import. - /app/data/[datasetId] — data preview/profile. -
/app/report/[reportId] — dashboard/report editor. - /app/templates —
templates. - /app/settings — local preferences. - /app/help — in-product
guidance.

SEO routes: - /excel-to-dashboard - /csv-dashboard-generator -
/free-mis-report-generator - /sales-dashboard-from-excel -
/inventory-dashboard-template - /hr-mis-dashboard -
/finance-mis-dashboard - /guides/[slug] Do not publish empty or
near-duplicate SEO pages. Each indexable page must offer unique useful
information, a working example, screenshots or a demo, limitations, and
a clear action. Avoid doorway pages, keyword stuffing, fabricated
claims, fake testimonials, and fabricated usage statistics.

Navigation should separate “Learn” and “Create.” The main CTA must lead
to the real working upload workflow, not a waitlist or fake demo.

======================================================================
6. DESIGN AND UX REQUIREMENTS
======================================================================

Design goal: Professional, trustworthy, calm, premium-looking analytics
tool. Avoid generic AI landing-page appearance. The interface should
feel like a real product with consistent spacing, typography, grid,
iconography, loading states, empty states, and helpful microcopy.

Visual direction: - Light-first analytics workspace with a
well-considered dark theme option. - Neutral backgrounds, readable text,
restrained accent color, clear chart palette. - Consistent design tokens
for spacing, colors, radius, typography, borders, shadows, z-index, and
breakpoints. - Use CSS variables/design tokens, not scattered hard-coded
values. - Use a modern font with a sensible system fallback; do not rely
on external font loading for basic usability. - Icons from a consistent
icon library such as Lucide. - Avoid excessive gradients, glassmorphism,
animations, and oversized marketing sections. - Use chart colors that
remain distinguishable and provide non-color cues. - Respect
prefers-reduced-motion. - Include skeleton/loading states, empty states,
error states, success feedback, and confirmation dialogs where
appropriate.

Responsive behavior: - Mobile: single-column dashboard cards, accessible
filter drawer, compact toolbar, touch-friendly controls. - Tablet:
two-column grid where practical. - Desktop: multi-column report canvas
with inspector/configuration panel. - Wide screens: sensible maximum
content width; avoid stretching tables/charts to unusable proportions. -
Do not make critical controls hover-only.

Accessibility: - Target WCAG 2.2 AA where feasible. - Keyboard
navigation for dialogs, menus, upload, filters, editor controls, and
drag/drop alternatives. - Visible focus rings. - Correct heading order
and landmarks. - Accessible names for icon-only buttons. - Form labels
and clear validation. - Chart summaries/table alternatives for screen
readers. - Sufficient contrast and no meaning conveyed by color alone. -
Focus management in modals and error handling. - Test with automated
accessibility tooling and manual keyboard navigation.

Required UI states: - First-time empty workspace. - Dragging a file over
the upload zone. - Upload progress where measurable. - Unsupported
file. - Oversized file. - Corrupt file. - Password-protected workbook. -
No valid rows. - Empty column names. - Duplicate column names. - Mixed
data types. - Missing values. - Formula cells with cached values
absent. - Workbook with multiple sheets. - Data too large for browser
memory. - Chart cannot be generated. - Export failure. - Storage quota
reached. - Offline mode or network failure for optional features. -
Unsupported browser. - Unsaved changes warning.

======================================================================
7. CORE FEATURE SPECIFICATION
======================================================================

7.1 File import: - Accept CSV and XLSX initially. Consider XLS only if a
safe, well-supported implementation is available; otherwise explain
unsupported formats. - Drag/drop and file picker. - Validate MIME type
and extension; do not trust either alone. - Configurable maximum file
size, row count, column count, and cell limits based on performance
tests. Show the limit before upload. - Parse locally in a Web Worker
where practical to avoid blocking the UI. - Support UTF-8 and reasonable
CSV delimiter detection; let the user override delimiter, encoding where
supported, decimal separator, date format, and header row. - XLSX: list
worksheets, preview them, select one or more if multi-sheet support is
stable. - Detect duplicate/blank column names and provide deterministic
safe names without destroying displayed original labels. - Show import
summary: rows, columns, sheet, detected data types, parsing warnings. -
Never upload file data silently. - Clear the in-memory dataset on
explicit “Clear data” and offer a clear confirmation. - Do not execute
spreadsheet formulas or macros. XLSX import must not run macros. - Treat
formula cells carefully; display available cached values and warn if
values are missing or unsupported. - CSV/XLSX exports must neutralize
spreadsheet formula injection for text values beginning with dangerous
formula characters, with a documented policy.

7.2 Data preview: - Virtualized table for large-but-supported row
counts. - Column headers, type indicators, search, sorting, pagination
or virtualization. - Show sample rows and total row count. - Data
dictionary/profile panel. - Missing-value counts and percentages. -
Unique-value counts for categorical fields. - Min/max/mean/median where
appropriate and computationally feasible. - Date range for date
columns. - Numeric distribution summary; avoid heavy calculations that
freeze the UI. - Distinguish null, empty string, zero, invalid values,
and not-applicable values. - User can change inferred column type with
validation and undo. - Never modify the source dataset without an
explicit operation.

7.3 Data cleaning: - Offer safe optional operations: trim whitespace,
normalize blank strings, convert numeric/date fields, remove exact
duplicate rows, remove selected columns, rename columns, filter rows,
replace values. - Each operation should be previewable, reversible, and
recorded in a transformation history. - Preserve original import
snapshot in memory until the user clears the dataset or closes the
workspace. - Clearly show before/after row counts and warnings. - Do not
infer business rules silently. - Support undo/redo for editing
operations where feasible. - Avoid promising full Power Query-style
transformation in MVP.

7.4 Automatic field inference: - Infer number, integer, boolean,
date/datetime, categorical text, free text, and identifier-like
columns. - Use confidence levels and allow user override. - Avoid
treating customer IDs, phone numbers, postal codes, account IDs, and SKU
codes as measures just because they contain digits. - Avoid aggregating
identifiers. - Detect likely measures and dimensions but label as
suggestions. - Detect likely date columns with conservative parsing. -
Store field metadata separately from original values.

7.5 Automatic dashboard generation: - Produce a dashboard based on data
shape and field profile, not a fixed hard-coded example. - Generate a
concise summary header with dataset name, row count, column count, and
data freshness/source information. - Suggest a small set of KPIs only
when their formulas make sense. - Recommend charts according to data
types and cardinality: * Time series: line/area charts for date +
numeric measure. * Category comparison: bar/column chart for category +
numeric measure. * Distribution: histogram/box plot only when suitable
and supported. * Composition: pie/donut only for a small number of
categories; otherwise bar chart. * Relationship: scatter plot for two
numeric measures. * Detailed records: table. * Single measure:
KPI/statistic plus distribution or trend if meaningful. - Do not create
meaningless charts simply to fill space. - Include a “Why this chart?”
explanation. - Avoid chart clutter and overly long labels. - Apply
sensible default sorting and top-N behavior with a visible indication
that data is limited to top N. - Provide a data-table fallback for every
chart. - Handle zero, negative, null, and extreme values correctly. -
Show units/currency only when known or explicitly set; do not guess
currency. - Use consistent formatting for numbers, dates, percentages,
and currency. - Do not imply that a chart proves causation.

7.6 KPI engine: - Supported aggregations: count rows, distinct count,
sum, average, min, max, median where feasible, count missing. - KPI
formulas should be typed/validated expressions, not arbitrary eval(). -
Add derived measures in stages: percentage change, difference to target,
margin, ratio, running total, year-over-year/month-over-month where
valid dates exist. - Require the user to select or confirm
numerator/denominator for ambiguous business formulas. - Handle division
by zero and insufficient comparison periods. - Display formula and
filters applied in a details panel. - Every KPI must be reproducible
from data and filters.

7.7 Insights engine: - MVP must be deterministic and local; no paid AI
API. - Possible insights: highest/lowest category, biggest absolute
change, percentage change with denominator safeguards, trend direction
with sufficient data points, missing-value warnings, outlier flags using
documented statistical methods, concentration in top categories,
unexpected null growth, duplicate-row count. - Every insight includes
the metric, period/group, computed value, comparison basis, and caveat
when relevant. - Distinguish “observed” from “possible explanation.” -
Do not invent why a trend occurred. - Avoid misleading claims from small
samples; display sample size and suppress weak insights. - Provide “How
was this calculated?” details. - Do not give high-stakes medical, legal,
credit, employment, or investment advice based on uploaded data. -
Optional future AI: disabled by default; explicit opt-in, clear
third-party data disclosure, provider/API key instructions, budget/rate
limits, and redact sensitive fields where possible. Never require AI for
the product to work.

7.8 Chart/report editor: - Add chart, KPI card, table, text block,
divider, filter control, and optional image/logo widget. - Move and
resize dashboard widgets with a grid layout. Provide keyboard-accessible
alternatives to drag-and-drop. - Chart type selection and field
mapping. - Choose dimensions, measures, aggregation, sort, limit,
colors, legend, labels, axes, title, subtitle, number format, and date
granularity where supported. - Chart-level filters and dashboard-level
filters. - Add/rename/delete/reorder pages or tabs only after the core
editor is stable. - Undo/redo; unsaved changes indicator; autosave
locally with explicit status. - Duplicate widget; reset chart
configuration. - Responsive layout preview. - Avoid silently changing a
chart type when data fields change; explain incompatibility and offer a
suggested replacement. - Save a versioned JSON report definition
independent of the raw data. - Validate imported report definitions
against a schema and reject unsafe/unknown structures. - Never execute
code contained in a report-definition file.

7.9 Filters and cross-filtering: - Date range, categorical multi-select,
numeric range, text search, and top-N filters where relevant. - Filter
state should update all related visuals consistently. - Clear individual
filters and clear all. - Show active filter chips and counts. - Define
filter scope: dashboard-level versus widget-level. - Ensure filters do
not mutate source data. - Handle empty result sets gracefully. - Avoid
cross-filtering behavior that surprises users; document it and allow
disablement.

7.10 Saving and portability: - MVP works without user accounts. - Save
report configuration and small datasets locally where browser quota
permits; always offer export/download. - Browser storage is not
guaranteed permanent; communicate that clearing site data can delete
local saves. - Use IndexedDB rather than localStorage for larger
structured data. Keep localStorage for small preferences only. - Provide
downloadable report-definition JSON and import/reopen workflow. - Define
whether report definition includes data. Default should avoid embedding
potentially sensitive source data unless user explicitly chooses it. - A
report definition without its dataset must clearly explain that the user
needs to reattach the data. - Use schema versions and migrations. -
Cloud sync and user accounts are post-MVP and only if a genuinely
sustainable free deployment can be established. - No fake cloud save
button in MVP.

7.11 Exports: - Export filtered rows to CSV. - Export current dataset to
XLSX if stable and supported. - Export dashboard to PDF using a
print-friendly view or reliable open-source browser/PDF approach. -
PNG/image export only if reliable and chart rendering can be captured
without breaking fonts/labels. - Include report title, generation
timestamp, selected filters, and data source description when
appropriate. - Respect current filter state. - Provide clear error
handling for browser limitations and large exports. - Exports must not
contain hidden secrets, internal debug metadata, or unwanted raw data. -
Test multi-page and long-table print layouts.

7.12 Templates: Initial templates: - Sales MIS. - Finance/expense
summary. - Inventory and stock. - HR/headcount/attendance. - Operations
and SLA. - Marketing campaign performance. - Project/task status.
Templates must be mappings of suggested columns/metrics, not assumptions
about every dataset. Show required/optional fields and let the user map
their own columns. Include synthetic sample datasets and sample report
definitions. Label all sample data as fictional.

7.13 Database connectors (later phase): Do not make direct arbitrary
database connectivity a launch blocker. Begin with local files. Design a
provider interface for future connectors. Potential providers:
PostgreSQL, MySQL, SQL Server, SQLite file import, and read-only
warehouse connectors if technically and legally appropriate. Security
requirements: - Never expose credentials in client bundles, URLs, logs,
analytics, or report JSON. - Do not store connection secrets in browser
storage. - Use read-only credentials and least privilege. - Enforce TLS
where supported. - Allowlist supported hosts/ports where possible. -
Prevent SSRF: block loopback, link-local, private network, cloud
metadata, and unsafe IP ranges for public server-side connections;
validate DNS and redirects; protect against DNS rebinding; apply
outbound network policy. - Do not allow arbitrary SQL by default. If
custom SQL is added, use a read-only transaction, statement timeout, row
limit, query allowlisting/validation, and database permissions. -
Restrict schemas/tables/columns. - Paginate/stream results and enforce
row/byte/time limits. - Rate limit connection tests and queries. - Never
use a public API endpoint that accepts arbitrary host/connection
strings. - Provide disconnect/revoke/delete controls and a credential
retention policy. - Add audit events without sensitive values. -
Document connector-specific limitations. - Database connectors must be
reviewed with a security checklist before release. - If secure
server-side connectors cannot be hosted at zero cost, do not falsely
promise them. Keep them optional and local/self-hosted or postpone them.

======================================================================
8. RECOMMENDED TECHNICAL STACK
======================================================================

Use current stable versions at implementation time. Before installing,
verify official docs, active maintenance, license, browser
compatibility, and known vulnerabilities. Do not blindly pin outdated
versions from this PRD.

Core: - Next.js App Router. - React. - TypeScript in strict mode. -
Node.js LTS compatible with selected Next.js version. - npm or pnpm;
choose one and use it consistently with a committed lockfile. - Tailwind
CSS or another maintainable styling system. - shadcn/ui only as copied,
reviewed components; do not assume it is a hosted service. - Lucide
icons. - Zod for input/schema validation. - React Hook Form where
complex forms justify it.

Data: - Papa Parse for CSV parsing. - SheetJS Community Edition only
after confirming the exact package, current license, distribution terms,
and supported XLSX features. Do not confuse Community Edition with paid
SheetJS offerings. - ExcelJS as an alternative for workbook
creation/reading where appropriate; verify browser bundle size and
feature support. - DuckDB-Wasm for analytical SQL in-browser if bundle
size, compatibility, and memory behavior are acceptable. - Web Workers
for heavy parsing/computation. - A typed internal data model that does
not depend on one parser library.

Charts and editor: - Apache ECharts for broad chart variety and
interactions, or Recharts if simpler React composition better fits the
implementation. Evaluate and choose one primary chart library; do not
install multiple overlapping libraries without a documented reason. -
dnd-kit for accessible drag/drop controls. - A maintained grid-layout
library only if it supports current React/Next versions and keyboard
alternatives. Verify license and maintenance before adoption. - TanStack
Table for data table behavior if useful. - A virtualization library for
large tables if needed.

Storage: - IndexedDB through a small, maintained wrapper if needed. -
Browser storage adapter interface so persistence can be swapped later. -
No database required for local-only MVP. - PostgreSQL and an ORM may be
introduced only when cloud accounts or server-side connectors are
implemented.

Testing: - Vitest for unit tests. - React Testing Library for component
tests. - Playwright for end-to-end workflows. - axe-core or equivalent
accessibility checks. - ESLint and Prettier. - TypeScript strict
checks. - Dependency vulnerability checks using available free
tooling. - Lighthouse and Core Web Vitals checks. - Use synthetic,
non-sensitive fixtures.

Optional services: - Vercel Hobby or another free-tier host, only after
reviewing current terms, limits, commercial-use restrictions, bandwidth,
functions, build limits, and inactivity policies. - GitHub repository
and GitHub Actions free allowance, subject to current limits. - No
mandatory external analytics. - No mandatory email provider. - No
mandatory paid AI provider. - No paid database requirement. - Do not add
a payment gateway in the free MVP.

License: - Choose a project license intentionally (for example, MIT or
Apache-2.0) after reviewing third-party dependencies and project goals.
Do not claim a dependency is permissively licensed without verifying
it. - Include third-party notices and license attributions as
required. - Keep dependency inventory and a basic SBOM if feasible.

======================================================================
9. ARCHITECTURE
======================================================================

Use a modular architecture with strict boundaries:

A. Presentation layer: - Pages, layouts, components, accessible dialogs,
forms, dashboard canvas, chart configuration inspector. - No business
calculations embedded directly inside UI components.

B. Application/use-case layer: - Import workflow, profile dataset,
generate dashboard, apply transformation, create widget, save report,
export report. - Typed inputs and outputs. - Explicit
loading/error/success states.

C. Domain layer: - Dataset, field metadata, data types, measures,
dimensions, filters, chart specification, KPI specification, insight,
report definition, transformation operation. - Pure functions where
possible. - Versioned schema definitions. - Deterministic
aggregation/formatting logic.

D. Data adapters: - CSV parser adapter. - XLSX parser adapter. - Browser
storage adapter. - Export adapters. - Future database provider
interface. - Do not couple chart components directly to parser-specific
formats.

E. Workers: - CSV/XLSX parsing and expensive profiling where
practical. - Progress and cancellation support. - Avoid blocking the
main thread. - Worker failures must produce recoverable errors.

F. Optional server layer: - Only for server-required functionality. - No
user-file upload endpoint in the default local-only path. - API routes
must validate every input, enforce size limits, rate limits,
authentication if applicable, and safe error responses. - Keep server
secrets server-only. - Never prefix secrets with NEXT_PUBLIC_.

Suggested conceptual directory structure (adapt after repository
inspection):

src/ app/ (marketing)/ app/ api/ # only for justified server endpoints
guides/ components/ ui/ layout/ upload/ data-preview/ dashboard/ charts/
editor/ filters/ export/ features/ import/ profiling/ cleaning/
auto-dashboard/ insights/ report-editor/ persistence/ export/ templates/
domain/ dataset/ metrics/ charts/ report/ filters/ insights/ lib/
validation/ formatting/ security/ errors/ feature-flags/ workers/ types/
test/ content/ styles/

public/ images/ icons/ sample-data/ sample-reports/

docs/ architecture/ security/ decisions/ release/

This is a suggested structure, not a mandate to create every folder
immediately. Prefer cohesive modules over overengineering.

Architecture Decision Records (ADRs): - Record decisions on chart
library, parser library, client-side processing, storage,
report-definition format, export method, hosting, and licensing. - Each
ADR should include context, options, decision, consequences, and date.

======================================================================
10. DATA MODEL AND REPORT SCHEMA
======================================================================

Define TypeScript types and runtime schemas for: - DatasetMetadata: id,
displayName, rowCount, columnCount, importedAt, sourceKind, sheetName if
applicable, profile version, size estimate. Do not include raw contents
in telemetry. - FieldMetadata: stable field id, display name, original
name, inferred type, user-selected type, confidence, role suggestion,
null count, distinct count, format settings. - MeasureDefinition: id,
name, expression type, input fields, aggregation, number format,
validation status. - FilterDefinition: id, field id, operator,
value/value range, scope, enabled state. - ChartWidget: id, type, title,
dimension fields, measure fields, aggregation, filters, sorting, top-N,
formatting, position, size, visibility. - KPIWidget: id, title, measure,
comparison configuration, formatting, position. - TableWidget: id,
selected columns, sorting, filters, pagination settings. - TextWidget:
id, text content, allowed formatting, position. - ReportDefinition:
schemaVersion, report id, title, description, widget list, page/layout
metadata, global filters, theme, formatting defaults, template metadata,
timestamps. - TransformationOperation: type, parameters, timestamp,
reversible data or inverse operation where practical. - Insight: id,
type, evidence, method, confidence/limitations, dataset version, filter
context. - ExportOptions: format, filters, filename, include raw data,
include metadata. Use Zod or equivalent runtime validation when
importing user-controlled report JSON. No eval(), Function constructor,
dynamic code execution, or arbitrary HTML rendering from imported
content. Sanitize rich text if rich text is permitted.

Stable identifiers: - Do not rely on column array position as
identity. - Preserve field IDs across column rename operations. - Schema
migrations must be tested against prior sample report versions.

======================================================================
11. PERFORMANCE AND RESOURCE MANAGEMENT
======================================================================

The application must be designed for browser constraints: - Define
tested dataset sizes and supported file limits based on real
measurements, not marketing guesses. - Start with modest defaults,
e.g. a configurable limit in the tens of megabytes, then benchmark. Do
not promise support for arbitrary large files. - Estimate memory use
before expensive operations where possible. - Stream or chunk CSV
parsing where feasible. - Use workers for parsing and heavy profiling. -
Use virtualized rows for large previews. - Avoid rendering thousands of
chart points without sampling/aggregation. - Downsample large time
series for visualization while preserving exact calculations in the
underlying dataset. - Cancel stale async tasks when a new file is
selected. - Revoke object URLs when no longer needed. - Release worker
resources and large buffers on clear/unmount. - Avoid duplicate
in-memory copies of the whole dataset. - Use lazy loading for heavy
chart/editor modules. - Avoid unnecessary dependencies and oversized
client bundles. - Show progress and cancellation for long-running
work. - Provide a recoverable “dataset too large for this device”
message and practical options. - Do not silently truncate data. If
sampling is used for a chart, disclose it. - Performance testing must
include lower-powered devices and mobile constraints.

======================================================================
12. SECURITY AND PRIVACY
======================================================================

Security is a product feature, not an afterthought.

Local data handling: - Default file analysis stays in the browser. - No
file contents in analytics, error monitoring, console logs, or server
logs. - No external AI transmission without explicit opt-in and clear
explanation. - Privacy page must accurately describe actual network
behavior. - Provide “Clear current data” and “Clear local saved reports”
controls. - Do not claim “100% private” without auditing actual
behavior.

Web security: - Apply an appropriate Content Security Policy where
compatible with the chosen libraries. - Use secure headers, safe
rendering, and input validation. - Prevent XSS, unsafe HTML injection,
open redirects, and unsafe URL handling. - Do not store secrets in
client-side bundles. - Use environment variables only on the server for
secrets; never expose secret values through public-prefixed variables. -
Keep .env files out of Git. - Avoid logging user data and credentials. -
Use dependency auditing and update procedures. - Use rate limiting on
public endpoints. - Protect against CSRF where cookie-authenticated
state-changing endpoints exist. - Set appropriate cookie flags if
authentication is introduced. - Define CORS narrowly; do not use
permissive wildcard credentials. - Provide safe error messages without
stack traces or secrets in production.

Database future feature: - Follow the connector requirements in section
7.13. - Conduct threat modeling before enabling hosted connections. - A
user-supplied hostname must never be allowed to turn the application
server into an unrestricted network proxy. - Do not ship this feature
until SSRF, credential storage, query limits, authorization, and
isolation have been reviewed and tested.

Privacy compliance: - Publish a real privacy policy based on implemented
behavior. - Do not invent a company address, legal identity, contact
details, certifications, or compliance claims. - Include a contact/issue
reporting mechanism that works or clearly identify it as a repository
issue route. - If user accounts/analytics are added, review applicable
laws and consent obligations before launch. - Keep sample data fictional
and avoid using real personal information in test fixtures.

======================================================================
13. SEO AND ORGANIC GROWTH STRATEGY
======================================================================

Goal: earn relevant organic traffic by helping users complete real
spreadsheet/reporting tasks. Ranking is not guaranteed. The product must
have genuine value before SEO expansion.

Technical SEO: - Server-render marketing and guide pages where
appropriate. - Unique page titles and meta descriptions. - Canonical
URLs. - Correct robots.txt and XML sitemap. - Meaningful URL
structure. - Open Graph and social sharing metadata. - Descriptive image
alt text. - Internal links between related guides and the working
tool. - Breadcrumbs on guides where useful. - Correct status codes,
redirects, and 404s. - Avoid indexing private workspace routes,
temporary report IDs, or user data. - No sensitive report information in
URLs. - Avoid duplicate indexable query-parameter URLs. - Test mobile
rendering and Core Web Vitals. - Use structured data only when content
genuinely qualifies; validate it and never mark up fake reviews, fake
ratings, or untrue product claims. - Do not rely on structured data as a
ranking guarantee.

Initial useful landing pages: 1. Free Excel-to-dashboard generator. 2.
CSV dashboard generator. 3. MIS report generator. 4. Sales dashboard
from Excel. 5. Inventory dashboard from spreadsheet. 6. HR MIS
dashboard. 7. Expense/finance dashboard. Each page must include: -
Specific user problem. - Interactive tool CTA. - Original explanation
and screenshots. - A working or clearly labelled sample. - Example data
with download link where helpful. - How calculations work. - Limitations
and privacy behavior. - FAQ with honest answers. - Links to relevant
guides. - No unsupported “best,” “fastest,” “unlimited,” “most
accurate,” or competitor superiority claims.

Content strategy: - Create helpful guides around actual tasks: clean
Excel data, choose chart types, calculate sales growth, build inventory
KPIs, make monthly MIS reports, avoid common spreadsheet errors,
interpret missing values, and export dashboards. - Include sample data
and reproducible steps. - Show screenshots from the actual product, not
misleading mockups. - Keep articles updated when product behavior
changes. - Do not mass-generate thin AI articles. - Do not scrape or
copy competitor content. - Do not create fake backlinks, fake
testimonials, fake users, or fabricated traffic numbers. - Add a
changelog and public roadmap to build trust. - Consider launching on
relevant communities only where self-promotion is allowed and
participation is genuine. - Add a feedback link and a simple way to
report bugs. - Use Google Search Console after the site is live; review
real query/page performance and improve pages based on evidence. - Do
not promise a ranking timeline or traffic outcome.

SEO acceptance: - All indexable pages have unique titles/descriptions
and canonical policy. - Sitemap includes only intended public pages. -
Private routes are noindex or otherwise excluded from indexing as
appropriate. - No broken internal links. - No placeholder copy or lorem
ipsum. - Structured data validates if used. - Every landing page has
useful unique content and a working CTA.

======================================================================
14. ANALYTICS AND FEEDBACK
======================================================================

MVP should not require analytics. Provide: - In-app “Send feedback” that
opens a configurable repository issue URL or email/contact route, with a
warning not to include private data. - Error reporting in development
with useful context but no dataset contents. - Optional
privacy-respecting analytics later, disabled unless configured and
disclosed. - Do not collect file names, field names, cell contents,
report titles, SQL queries, database hosts, or credentials in
telemetry. - Provide a public issue template and bug report guide. - Add
a “report a bug” action in the app. - Include a feedback survey after
successful export only if it is non-intrusive and does not block the
workflow.

======================================================================
15. FREE-TO-OPERATE PLAN AND COST CONTROLS
======================================================================

Hard constraint: The core app must run locally without paid services and
must not require a credit card or paid API key.

Development: - Use local Node.js, package manager, Git, and browser. -
Store code on a free GitHub repository. - Use open-source dependencies
with verified licenses. - Use synthetic fixtures. - Do not subscribe to
paid AI coding APIs on the user’s behalf. - Do not purchase a domain for
the initial test. - Never activate a paid plan or add billing details
without the user’s explicit approval.

Hosting: - Prototype can run locally with npm/pnpm dev. - Public demo
may use a free-tier host only after reviewing its current terms, limits,
commercial restrictions, and resource quotas. - Do not assume a
provider’s free plan is permanent. - Avoid server functions for features
that can safely run client-side. - Avoid mandatory cloud database,
object storage, cron, email, and AI APIs. - Provide static/client-first
deployment path if the final architecture supports it. - If a future
feature requires paid infrastructure, label it optional and disabled by
default.

Cost guardrails: - No paid API required for dashboard generation. - No
paid AI required for insights. - No paid chart library. - No paid
authentication required for MVP. - No paid database required for local
workflow. - No automatic usage-based services without explicit
approval. - Document expected costs before enabling any optional paid
integration. - Never claim zero operating cost for unlimited production
usage. - Include a COSTS.md with free-tier assumptions and date checked.

======================================================================
16. TESTING STRATEGY
======================================================================

Unit tests: - CSV delimiter/header parsing behavior. - Data type
inference including ambiguous IDs and dates. - Aggregations and null
handling. - KPI formulas and division-by-zero. - Date period
comparisons. - Filter semantics. - Insight calculation and evidence. -
Chart recommendation logic. - Report schema validation and migrations. -
CSV/XLSX export and formula-injection mitigation. - Number/date/currency
formatting. - Transformation undo/redo.

Component tests: - Upload states and error messages. - Column type
override. - Chart field configuration. - Filter controls. - Report
editor actions. - Save/import report definition. - Keyboard interaction
and focus behavior. - Empty and error states.

End-to-end tests: 1. Open home page. 2. Start new dashboard without
login. 3. Upload valid sample CSV. 4. Preview and profile data. 5.
Generate dashboard. 6. Verify KPI values against known fixture results.
7. Change a chart field/type. 8. Apply and clear filters. 9.
Add/remove/reorder a widget. 10. Save report locally. 11. Reload and
reopen report. 12. Export CSV and print/PDF workflow. 13. Test invalid
file and oversized file. 14. Test a workbook with multiple sheets if
supported. 15. Clear all local data. 16. Verify there are no external
requests containing dataset values.

Security tests: - Malformed report JSON. - Oversized input. - XSS
payloads in column names, cell text, titles, and report definitions. -
Formula injection in exports. - Unsafe URLs in user-controlled
content. - Dependency audit. - Secrets scan. - If database connectors
are implemented, dedicated SSRF, SQL permissions, credential,
rate-limit, and isolation tests.

Accessibility: - Automated axe tests on key pages. - Keyboard-only
upload-to-export journey. - Screen reader names and descriptions. -
Focus management and contrast checks.

Performance: - Test datasets at several sizes. - Measure parse time,
dashboard generation, chart render, export time, memory pressure, and
bundle size. - Test on a lower-powered laptop/mobile device. - Check for
UI freezing, memory leaks, and stale worker jobs.

Release gate: No release if core workflow fails, a secret is committed,
calculations are incorrect, uploaded data is unintentionally
transmitted, or a critical accessibility/security defect remains
unresolved.

======================================================================
17. IMPLEMENTATION ROADMAP
======================================================================

Antigravity must work incrementally. Do not generate the entire product
in one unverified code dump.

PHASE 0 — DISCOVERY AND PLAN - Inspect the repository before changing
files. - If the repository already has code, preserve useful work and
identify existing stack. - Ask only essential clarifying questions. -
Produce an implementation plan, architecture decisions, risks, and file
map. - Confirm exact versions, licenses, and current deployment
options. - Do not modify files until the plan is reviewed if using
Antigravity’s planning workflow.

PHASE 1 — FOUNDATION - Initialize/repair Next.js App Router + TypeScript
strict mode. - Add linting, formatting, tests, env example, .gitignore,
README, license decision, and basic CI. - Establish design tokens,
shared UI components, responsive layout, navigation, marketing shell,
app shell, error boundaries, and not-found page. - Build real empty
states, not fake data dashboards. - Run typecheck, lint, and tests.

PHASE 2 — LOCAL FILE IMPORT - Implement CSV/XLSX import and
validation. - Add worker-based parsing where appropriate. - Add sheet
selection and configurable CSV parsing. - Build data preview, type
inference, profile, and clear-data action. - Add fixture-based tests and
large-file handling. - Confirm the local file path makes no network
request containing user data.

PHASE 3 — DATA ENGINE - Implement typed dataset model. - Add aggregation
functions and filters. - Add chart recommendation rules. - Add
deterministic insights with evidence. - Test known values and edge
cases.

PHASE 4 — AUTOMATIC DASHBOARD - Generate meaningful KPIs/charts/tables
from real uploaded data. - Build responsive dashboard canvas. - Add
loading, error, empty, and no-chart states. - Add chart details and
accessible table alternatives. - Never use hard-coded sample data in a
real imported report.

PHASE 5 — REPORT CUSTOMIZATION - Add widget editor, field mapping, chart
type selection, sorting, formatting, filters, drag/resize,
duplicate/delete, undo/redo where practical. - Add local save,
report-definition import/export, schema validation, and migration
strategy. - Test keyboard alternatives and unsaved state.

PHASE 6 — EXPORT AND TEMPLATES - Add filtered CSV export, XLSX export if
reliable, and print/PDF support. - Add MIS templates and clearly
fictional sample datasets. - Validate exported figures against the
dashboard. - Add privacy/cost disclosures.

PHASE 7 — MARKETING AND SEO - Write original landing pages and guides. -
Add metadata, canonical URLs, sitemap, robots policy, structured data
only when appropriate, and internal links. - Add actual screenshots and
working CTAs. - No placeholder testimonials or fabricated metrics.

PHASE 8 — HARDENING - Full automated test suite. - Accessibility
audit. - Performance tests. - Security review. - Dependency/license
audit. - Production build. - Verify privacy claims against network
activity. - Fix all critical/high issues before release.

PHASE 9 — OPTIONAL FUTURE FEATURES Only after the MVP is stable: - User
accounts and cloud report sync. - Secure database connectors. -
Scheduled refresh. - Optional user-provided AI provider integration. -
Sharing/permissions. - Advanced calculations and multi-dataset
relationships. Each optional feature requires a separate design, threat
model, cost assessment, and tests. Do not let future scope delay a
reliable MVP.

======================================================================
18. DEFINITION OF DONE
======================================================================

A feature is not done because it looks good. It is done when: - The
workflow functions with real data. - Types and validation are present. -
Loading, empty, success, and failure states exist. -
Keyboard/accessibility behavior has been checked. - Tests cover normal
and edge cases. - Errors are recoverable and understandable. - No
secrets or user data leak into logs. - No hidden paid dependency
exists. - Documentation explains behavior and limitations. - Production
build passes. - No broken links or dead controls remain. - Relevant
screenshots/documentation are updated. - Known limitations are
documented honestly.

MVP acceptance checklist: [ ] User can open the app without creating an
account. [ ] User can upload supported CSV and XLSX files. [ ] Multiple
worksheet selection works if advertised. [ ] Data preview shows correct
rows and types. [ ] Profiling identifies missing values and common data
quality issues. [ ] User can generate a dashboard from uploaded data. [
] KPI values match independent expected calculations. [ ] Charts use the
real dataset. [ ] User can change chart fields and visualization type. [
] User can apply and clear filters. [ ] User can add/remove/reorder
dashboard widgets. [ ] User can save and reopen a report locally. [ ]
User can export data and a printable dashboard. [ ] Insights are
deterministic, evidence-based, and explainable. [ ] User can clear
loaded data and local saved reports. [ ] No AI key, paid API, or paid
database is required. [ ] No file content is transmitted during the
local workflow. [ ] Mobile and desktop layouts work. [ ] Accessibility
and keyboard tests pass for the main journey. [ ] Typecheck, lint, unit
tests, E2E tests, and production build pass. [ ] SEO pages are original,
useful, and not filled with placeholders. [ ] Privacy, terms, license,
and limitations are accurate. [ ] Deployment is documented with current
free-tier limitations. [ ] No critical/high security issue is
unresolved.

======================================================================
19. DOCUMENTATION DELIVERABLES
======================================================================

Create and maintain: - README.md — product overview, screenshots, setup,
scripts, current status, limitations. - CONTRIBUTING.md — setup, code
standards, tests, pull request workflow. - SECURITY.md — vulnerability
reporting and security boundaries. - LICENSE — chosen project license
after confirming intent. - THIRD_PARTY_NOTICES.md — dependency
attributions and licenses. - COSTS.md — zero-budget assumptions and
free-tier limits checked date. - docs/architecture/overview.md. -
docs/architecture/data-flow.md. - docs/architecture/report-schema.md. -
docs/security/privacy-model.md. - docs/security/threat-model.md,
especially before database connectors. - docs/decisions/ADR-*.md. -
docs/testing/test-plan.md. - docs/release/release-checklist.md. -
CHANGELOG.md. - Public roadmap with shipped/in-progress/planned labels.

Do not claim SOC 2, ISO certification, GDPR compliance, HIPAA
compliance, enterprise-grade security, or any certification without
appropriate legal/technical basis and actual evidence.

======================================================================
20. REQUIRED ANTIGRAVITY BEHAVIOR
======================================================================

Act as a senior product engineer, UI/UX designer, data engineer,
security reviewer, accessibility specialist, and technical writer
working together.

Before implementation: 1. Inspect the entire existing repository and
identify whether it is empty, partially implemented, or an existing app.
2. Summarize the current state and list important existing files. 3.
Identify requirements that conflict, technical risks, licensing risks,
and free-tier risks. 4. Create a staged implementation plan with tasks,
dependencies, acceptance checks, and a clear MVP boundary. 5. Verify
current official documentation and package compatibility rather than
inventing APIs. 6. Choose dependencies deliberately and document why
each one is needed. 7. Keep the first implementation focused on a
reliable local-first MVP. 8. Do not ask the user to purchase anything.
9. Do not add billing details, create paid services, or activate paid
subscriptions. 10. Do not start with a static-only mockup. The real data
workflow is the core product.

During implementation: - Work in small, reviewable phases. - After each
phase, run the relevant tests, lint, typecheck, and build. - Report
exactly what changed, what was tested, and any remaining issues. - If a
command fails, investigate and fix it rather than hiding the failure. -
Do not claim a test passed unless it was run and its result is known. -
Do not replace real functionality with hard-coded mock data. - Do not
leave primary controls inert. - Do not introduce dependencies without
checking maintenance, compatibility, and license. - Do not invent
external API endpoints. - Do not send data to third parties without
explicit product design, user disclosure, and opt-in. - Preserve working
features and avoid unrelated refactors. - Use clear TypeScript types;
avoid any unless narrowly justified and documented. - Do not use eval,
new Function, or unsafe dynamic execution. - Do not suppress lint/type
errors merely to make the build pass. - Do not use environment variables
prefixed NEXT_PUBLIC_ for secrets. - Do not commit real credentials or
user data. - Do not add cloud accounts or database connectors before a
security/cost review. - Use accessible components and responsive
design. - Use actual screenshots from the built product after the
relevant functionality exists. - Maintain documentation and changelog as
features ship.

At the end of each phase, report: A. Completed. B. Files added/modified.
C. Tests/commands run and actual results. D. Known limitations. E.
Security/privacy considerations. F. Next recommended phase. G. Any cost
or license concerns.

If an architectural decision is uncertain, explain the options and
choose the simplest safe solution for the MVP. Do not silently make a
decision that creates recurring cost.

======================================================================
21. MASTER PROMPT TO START ANTIGRAVITY
======================================================================

Paste the following as the first project instruction after placing this
PRD in the repository:

“You are working on a production-minded, free, privacy-first MIS and
Excel dashboard builder. Read the complete PRD in PRD_OPENMIS.txt before
coding. First inspect the repository and current environment. Do not
overwrite existing work without understanding it.

Use a planning-first workflow. If supported, start with /plan. Return a
concise repository assessment, architecture proposal, dependency/license
assessment, cost-risk assessment, MVP boundary, file map, phased
implementation plan, and acceptance checklist. Do not begin full
implementation until the plan is reviewed.

The strict budget is ₹0 out-of-pocket. No paid APIs, paid AI, paid
libraries, paid subscriptions, mandatory credit card, or usage-billed
services. The MVP must run locally and must not require a user account.
Prefer browser-side processing for uploaded CSV/XLSX files,
deterministic local insights, open-source charts, local report
persistence, and exportable report definitions. Do not promise unlimited
free hosting.

The core workflow must be real: import file → validate and preview →
profile fields → generate dashboard from actual data → customize
charts/KPIs/filters/layout → save locally → export. No hard-coded charts
or fake results in the imported-data workflow. If a feature is not
implemented, label it as planned or disable it clearly.

Use Next.js App Router, React, TypeScript strict mode, a maintainable
design system, schema validation, a single well-justified primary chart
library, suitable file parsing libraries after license review,
unit/component/E2E tests, accessibility checks, and production build
verification. Verify current official documentation and package
versions. Keep secrets server-only and out of Git. Never transmit file
data or credentials without explicit, informed user consent.

Build incrementally in the PRD phases. After each phase run typecheck,
lint, tests, and production build as appropriate. Report real results
and remaining limitations. Do not fake successful commands, create dead
buttons, suppress errors, or claim unimplemented security/privacy
properties. Do not add database connectors, cloud sync, authentication,
AI APIs, or other high-risk optional features before the local-first MVP
is stable.

Start with Phase 0 only: inspect, plan, identify risks, and propose the
first implementation slice. Do not generate the entire application in
one unreviewed code dump.”

======================================================================
22. OFFICIAL DOCUMENTATION TO CONSULT
======================================================================

Use these as starting points and re-check them at implementation time: -
Google Antigravity rules: https://www.antigravity.google/docs/rules/ -
Google Antigravity planning: https://www.antigravity.google/docs/plan/ -
Next.js environment variables:
https://nextjs.org/docs/app/guides/environment-variables - Next.js
self-hosting: https://nextjs.org/docs/app/guides/self-hosting - Google
Search Central SEO Starter Guide:
https://developers.google.com/search/docs/fundamentals/seo-starter-guide -
Google Search Central helpful, reliable, people-first content:
https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Before using any third-party library, inspect its official
repository/documentation, license file, maintenance status, security
advisories, browser compatibility, bundle size, and current recommended
usage.

======================================================================
23. FINAL PRODUCT STANDARD
======================================================================

The goal is not to produce the largest possible feature list. The goal
is to ship a genuinely useful, fast, accessible, trustworthy, and
maintainable product that a real Excel user can use successfully.

Prioritize: 1. Reliable CSV/XLSX import. 2. Correct data profiling. 3.
Useful automatic dashboards. 4. Transparent KPIs and deterministic
insights. 5. Customizable reports. 6. Reliable export. 7. Privacy and
security. 8. Excellent onboarding and documentation. 9. Original,
helpful SEO content. 10. Sustainable zero-cost development and
deployment choices.

Do not sacrifice calculation correctness, user privacy, accessibility,
or maintainability to make the interface appear more advanced.

END OF PRD
