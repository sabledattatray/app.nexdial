import { describe, it, expect } from "vitest";
import { inferFieldType } from "@/domain/dataset/inference";

describe("Field Type Inference Engine", () => {
  it("strictly classifies ID, SKU, Postal, and Phone columns as identifiers, NOT measures", () => {
    const idResult = inferFieldType("customer_id", [101, 102, 103, 104]);
    expect(idResult.type).toBe("identifier");
    expect(idResult.role).toBe("identifier");

    const skuResult = inferFieldType("SKU_Code", ["SKU-01", "SKU-02", "SKU-03"]);
    expect(skuResult.type).toBe("identifier");
    expect(skuResult.role).toBe("identifier");

    const zipResult = inferFieldType("Postal_Code", ["411001", "411002", "411003"]);
    expect(zipResult.type).toBe("identifier");
    expect(zipResult.role).toBe("identifier");

    const phoneResult = inferFieldType("Phone_Number", ["9876543210", "9876543211"]);
    expect(phoneResult.type).toBe("identifier");
    expect(phoneResult.role).toBe("identifier");
  });

  it("identifies continuous numeric measures correctly with currencies and commas", () => {
    const revenueResult = inferFieldType("Revenue", ["$12,450.50", "$8,200.00", "$4,150.00"]);
    expect(revenueResult.type).toBe("number");
    expect(revenueResult.role).toBe("measure");

    const unitsResult = inferFieldType("Units_Sold", [8, 14, 22, 12, 10]);
    expect(unitsResult.type).toBe("integer");
    expect(unitsResult.role).toBe("measure");
  });

  it("identifies dates correctly", () => {
    const dateResult = inferFieldType("Order_Date", ["2026-01-05", "2026-01-08", "2026-01-12"]);
    expect(dateResult.type).toBe("date");
    expect(dateResult.role).toBe("time_dimension");
  });

  it("identifies booleans correctly", () => {
    const boolResult = inferFieldType("Is_Active", ["yes", "no", "yes", "yes"]);
    expect(boolResult.type).toBe("boolean");
    expect(boolResult.role).toBe("dimension");
  });

  it("identifies low cardinality strings as categorical", () => {
    const catResult = inferFieldType("Region", ["North", "South", "East", "West", "North"]);
    expect(catResult.type).toBe("categorical");
    expect(catResult.role).toBe("dimension");
  });
});
