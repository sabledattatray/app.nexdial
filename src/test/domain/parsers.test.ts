import { describe, it, expect } from "vitest";
import { parseCsvString } from "@/lib/parsers/csv-parser";
import { validateSpreadsheetFile } from "@/lib/parsers/file-validator";

describe("Spreadsheet Parsers & Validators", () => {
  it("parses CSV with auto-detected comma delimiter", async () => {
    const csvData = `Date,Revenue,Region\n2026-01-01,1500,North\n2026-01-02,2300,South`;
    const res = await parseCsvString(csvData);

    expect(res.headers).toEqual(["Date", "Revenue", "Region"]);
    expect(res.rows.length).toBe(2);
    expect(res.rows[0].Revenue).toBe(1500);
    expect(res.detectedDelimiter).toBe(",");
  });

  it("parses CSV with semicolon delimiter", async () => {
    const csvData = `Product;Price;Category\nDesk;200;Office\nChair;100;Office`;
    const res = await parseCsvString(csvData);

    expect(res.headers).toEqual(["Product", "Price", "Category"]);
    expect(res.rows.length).toBe(2);
    expect(res.detectedDelimiter).toBe(";");
  });

  it("validates file size limit and format", () => {
    const validCsv = new File(["col1,col2\n1,2"], "test.csv", { type: "text/csv" });
    const resValid = validateSpreadsheetFile(validCsv);
    expect(resValid.isValid).toBe(true);
    expect(resValid.format).toBe("csv");

    const invalidXls = new File(["binary"], "test.xls", { type: "application/vnd.ms-excel" });
    const resInvalid = validateSpreadsheetFile(invalidXls);
    expect(resInvalid.isValid).toBe(false);
    expect(resInvalid.error).toContain("Legacy binary Excel (.xls)");
  });
});
