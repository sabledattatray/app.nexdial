import { describe, it, expect } from "vitest";
import { profileDataset } from "@/domain/dataset/profiler";

describe("Data Profiler Engine", () => {
  it("computes accurate numeric stats (min, max, mean, median) and separates null from empty strings", () => {
    const rawHeaders = ["Item", "Price", "Category"];
    const rows = [
      { Item: "Desk", Price: 200, Category: "Furniture" },
      { Item: "Chair", Price: 100, Category: "Furniture" },
      { Item: "Lamp", Price: 50, Category: "Lighting" },
      { Item: "Monitor", Price: 400, Category: "Electronics" },
      { Item: "EmptyItem", Price: null, Category: "" },
      { Item: "Desk", Price: 200, Category: "Furniture" }, // Duplicate row
    ];

    const profile = profileDataset(rows, rawHeaders, {
      id: "test-dataset",
      name: "test.csv",
      sourceFormat: "csv",
      sizeBytes: 1024,
      importedAt: new Date().toISOString(),
    });

    expect(profile.metadata.rowCount).toBe(6);
    expect(profile.metadata.columnCount).toBe(3);
    expect(profile.duplicateRowsCount).toBe(1);

    const priceField = profile.fields.find((f) => f.name === "Price");
    expect(priceField).toBeDefined();
    expect(priceField?.nullCount).toBe(1);
    expect(priceField?.emptyStringCount).toBe(0);
    expect(priceField?.min).toBe(50);
    expect(priceField?.max).toBe(400);
    // (50 + 100 + 200 + 200 + 400) / 5 = 190
    expect(priceField?.mean).toBe(190);
    // sorted: [50, 100, 200, 200, 400], median = 200
    expect(priceField?.median).toBe(200);

    const categoryField = profile.fields.find((f) => f.name === "Category");
    expect(categoryField?.emptyStringCount).toBe(1);
    expect(categoryField?.topValues?.[0].value).toBe("Furniture");
    expect(categoryField?.topValues?.[0].count).toBe(3);
  });
});
