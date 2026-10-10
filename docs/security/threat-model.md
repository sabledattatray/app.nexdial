# Threat Model & Vulnerability Mitigations — OpenMIS

> **Version:** 1.0.0  
> **Status:** Active  
> **Date:** October 10, 2026  

---

## 1. Threat Vectors & Defense Matrix

| Threat Vector | Severity | Attack Mechanism | OpenMIS Defense Implementation |
|---|---|---|---|
| **CSV Formula Injection (DDE)** | High | Untrusted cell values starting with `=`, `+`, `-`, `@`, `\t`, `\r` execute commands when opened in desktop Excel. | `formula-sanitizer.ts`: Multi-pass inspection prepends single quote (`'`) to all formula strings on export while preserving legitimate numeric values. |
| **Cross-Site Scripting (XSS)** | High | Injected HTML/script tags in cell strings or uploaded JSON report schemas. | Strict React 19 JSX virtual DOM encoding; absolute zero use of `dangerouslySetInnerHTML` for spreadsheet data; zero `eval()` or `new Function()`. |
| **Denial of Service (DoS / OOM)** | Medium | Multi-gigabyte file uploads causing browser crash or tab freezing. | Strict file size ceiling of 50MB; 250,000 row hard limit with user warnings; Web Worker isolation prevents main thread freeze. |
| **Schema Poisoning** | Medium | Malformed JSON report definitions imported to corrupt state. | Strict Zod validation via `ReportDefinitionSchema.safeParse()`. Unrecognized or invalid payloads are rejected with descriptive errors. |
| **Data Exfiltration** | High | Unauthorized third-party network transmissions of private financial data. | 100% client-side architecture; zero backend endpoints ingesting file rows; zero third-party telemetry of cell or table data. |

---

## 2. Dynamic Data Exchange (DDE) Sanitizer Verification

The sanitizer enforces the following transformations:

```typescript
// Dangerous Formula -> Sanitized Output
"=cmd|'/C calc'!A0"        -> "'=cmd|'/C calc'!A0"
"+HYPERLINK(...)"          -> "'+HYPERLINK(...)"
"-SUM(A1:A10)"             -> "'-SUM(A1:A10)"
"@SUM(B1:B10)"             -> "'@SUM(B1:B10)"
"\t=calc"                  -> "'\t=calc"
"\r=calc"                  -> "'\r=calc"

// Legitimate Numbers -> Preserved Intact
-42                        -> -42 (Valid number)
+100                       -> 100 (Valid number)
-1250.75                   -> -1250.75 (Valid number)
```
