import { describe, it, expect } from "vitest";
import { BRAND } from "@/lib/constants/brand";

describe("OpenMIS Baseline Foundation Tests", () => {
  it("should have valid centralized brand constants", () => {
    expect(BRAND.name).toBe("OpenMIS");
    expect(BRAND.domain).toBe("app.nexdial.io");
    expect(BRAND.url).toBe("https://app.nexdial.io");
    expect(BRAND.tagline).toBeDefined();
    expect(BRAND.limits.maxFileSizeMb).toBe(50);
    expect(BRAND.limits.maxRecommendedRows).toBe(100000);
    expect(BRAND.limits.maxHardRowLimit).toBe(250000);
  });

  it("should verify basic math operations without floating point bugs", () => {
    const sum = (arr: number[]) => arr.reduce((acc, v) => acc + v, 0);
    const avg = (arr: number[]) => (arr.length ? sum(arr) / arr.length : 0);

    const data = [10, 20, 30, 40, 50];
    expect(sum(data)).toBe(150);
    expect(avg(data)).toBe(30);
  });

  it("should enforce safe division safeguards", () => {
    const safeDivide = (numerator: number, denominator: number): number | null => {
      if (denominator === 0 || !isFinite(denominator)) return null;
      const res = numerator / denominator;
      return isFinite(res) ? res : null;
    };

    expect(safeDivide(100, 2)).toBe(50);
    expect(safeDivide(100, 0)).toBeNull();
    expect(safeDivide(0, 50)).toBe(0);
  });
});
