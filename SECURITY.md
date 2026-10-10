# Security Policy — OpenMIS

> **Version:** 1.0  
> **Last Updated:** October 10, 2026  

---

## 1. Security & Privacy Architecture

OpenMIS is built on a **privacy-by-design, local-first** security model:
1. **Client-Side Data Boundary:** All uploaded CSV and XLSX files are parsed and evaluated inside your local browser. No spreadsheet row or column data is sent to our servers.
2. **Formula Injection (CSV DDE) Sanitization:** Any cell text beginning with dangerous spreadsheet formula characters (`=`, `+`, `-`, `@`, `\t`, `\r`) is automatically neutralized with a leading single quote (`'`) upon CSV/XLSX export.
3. **No Dynamic Execution:** Report definitions imported into OpenMIS are strictly validated against a versioned Zod schema. OpenMIS strictly prohibits `eval()`, `new Function()`, or dynamic HTML script execution.
4. **Zero Telemetry of User Spreadsheets:** Application logs and error handlers are strictly configured never to record file contents, column names, cell values, or filenames.

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability in OpenMIS:
- Please report it responsibly by opening a private security advisory on GitHub or contacting the maintainers.
- Please do not disclose vulnerabilities publicly until a fix has been verified.
- When filing a vulnerability report, **never include real corporate or personal confidential spreadsheet data**. Use synthetic mock fixtures.
