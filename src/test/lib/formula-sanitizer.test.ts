import { describe, it, expect } from "vitest";
import {
  sanitizeCellForExport,
  sanitizeRowForExport,
  sanitizeRowsForExport,
} from "@/lib/security/formula-sanitizer";
import { RowData } from "@/domain/dataset/types";

describe("Spreadsheet Formula Injection Guard (PRD Section 11 & 14)", () => {
  it("escapes cells starting with '=' with a single quote", () => {
    expect(sanitizeCellForExport("=cmd|' /C calc'!A0")).toBe("'=cmd|' /C calc'!A0");
    expect(sanitizeCellForExport("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
  });

  it("escapes cells starting with '@' with a single quote", () => {
    expect(sanitizeCellForExport("@SUM(A1:A10)")).toBe("'@SUM(A1:A10)");
  });

  it("escapes cells starting with tab or carriage return", () => {
    expect(sanitizeCellForExport("\tcmd")).toBe("'\tcmd");
    expect(sanitizeCellForExport("\rcmd")).toBe("'\rcmd");
  });

  it("escapes non-numeric strings starting with '+' or '-'", () => {
    expect(sanitizeCellForExport("+cmd|' /C calc'")).toBe("'+cmd|' /C calc'");
    expect(sanitizeCellForExport("-cmd|' /C calc'")).toBe("'-cmd|' /C calc'");
  });

  it("preserves legitimate negative and positive numbers without escaping", () => {
    expect(sanitizeCellForExport(-42)).toBe(-42);
    expect(sanitizeCellForExport("-42")).toBe("-42");
    expect(sanitizeCellForExport("-3.14159")).toBe("-3.14159");
    expect(sanitizeCellForExport("+100")).toBe("+100");
  });

  it("preserves standard safe text, numbers, and nulls", () => {
    expect(sanitizeCellForExport("Regular Text")).toBe("Regular Text");
    expect(sanitizeCellForExport("Acme Corporation")).toBe("Acme Corporation");
    expect(sanitizeCellForExport(12345)).toBe(12345);
    expect(sanitizeCellForExport(true)).toBe(true);
    expect(sanitizeCellForExport(null)).toBe("");
    expect(sanitizeCellForExport(undefined)).toBe("");
  });

  it("sanitizes full rows and arrays of rows accurately", () => {
    const singleRow: RowData = { name: "Bob", code: "=cmd|..." };
    const sanitizedSingle = sanitizeRowForExport(singleRow);
    expect(sanitizedSingle.name).toBe("Bob");
    expect(sanitizedSingle.code).toBe("'=cmd|...");

    const rawRows: RowData[] = [
      { id: 1, name: "Alice", formula: "=2+2", delta: -10 },
      { id: 2, name: "@Attacker", formula: "+cmd|...", delta: "+15" },
    ];

    const sanitized = sanitizeRowsForExport(rawRows);

    expect(sanitized[0].name).toBe("Alice");
    expect(sanitized[0].formula).toBe("'=2+2");
    expect(sanitized[0].delta).toBe(-10);

    expect(sanitized[1].name).toBe("'@Attacker");
    expect(sanitized[1].formula).toBe("'+cmd|...");
    expect(sanitized[1].delta).toBe("+15");
  });
});
