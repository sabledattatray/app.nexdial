import { describe, it, expect } from "vitest";
import {
  trimWhitespace,
  normalizeBlanks,
  removeDuplicateRows,
  dropColumn,
  renameColumn,
  overrideColumnType,
} from "@/domain/cleaning/transformations";
import { FieldMetadata } from "@/domain/dataset/types";

describe("Data Cleaning Transformations", () => {
  const dummyFields: FieldMetadata[] = [
    {
      id: "f1",
      name: "Product",
      originalName: "Product",
      inferredType: "text",
      userType: "text",
      confidence: 1,
      role: "dimension",
      sampleValues: [],
      nullCount: 0,
      emptyStringCount: 0,
      missingPercentage: 0,
      distinctCount: 2,
    },
    {
      id: "f2",
      name: "Amount",
      originalName: "Amount",
      inferredType: "number",
      userType: "number",
      confidence: 1,
      role: "measure",
      sampleValues: [],
      nullCount: 0,
      emptyStringCount: 0,
      missingPercentage: 0,
      distinctCount: 2,
    },
  ];

  it("trims whitespace from string values without altering numbers", () => {
    const rows = [
      { Product: "  Chair  ", Amount: 50 },
      { Product: "Table ", Amount: 120 },
    ];
    const res = trimWhitespace(rows, dummyFields);
    expect(res.updatedRows[0].Product).toBe("Chair");
    expect(res.updatedRows[1].Product).toBe("Table");
    expect(res.updatedRows[0].Amount).toBe(50);
  });

  it("normalizes blank strings to null", () => {
    const rows = [
      { Product: "   ", Amount: 50 },
      { Product: "", Amount: 120 },
    ];
    const res = normalizeBlanks(rows, dummyFields);
    expect(res.updatedRows[0].Product).toBeNull();
    expect(res.updatedRows[1].Product).toBeNull();
  });

  it("removes exact duplicate rows and tracks row counts", () => {
    const rows = [
      { Product: "Chair", Amount: 50 },
      { Product: "Table", Amount: 120 },
      { Product: "Chair", Amount: 50 },
    ];
    const res = removeDuplicateRows(rows, dummyFields);
    expect(res.updatedRows.length).toBe(2);
    expect(res.step.beforeRowCount).toBe(3);
    expect(res.step.afterRowCount).toBe(2);
  });

  it("drops columns and updates metadata", () => {
    const rows = [{ Product: "Chair", Amount: 50 }];
    const res = dropColumn(rows, dummyFields, "f2");
    expect(res.updatedFields.length).toBe(1);
    expect(res.updatedFields[0].id).toBe("f1");
    expect(res.updatedRows[0].Amount).toBeUndefined();
  });

  it("renames columns and updates rows accordingly", () => {
    const rows = [{ Product: "Chair", Amount: 50 }];
    const res = renameColumn(rows, dummyFields, "f1", "ItemName");
    expect(res.updatedFields[0].name).toBe("ItemName");
    expect(res.updatedRows[0].ItemName).toBe("Chair");
    expect(res.updatedRows[0].Product).toBeUndefined();
  });

  it("overrides column type and updates field role", () => {
    const res = overrideColumnType(dummyFields, "f1", "identifier");
    expect(res.updatedFields[0].userType).toBe("identifier");
    expect(res.updatedFields[0].role).toBe("identifier");
  });
});
