import { describe, it, expect } from "vitest";
import { MIS_TEMPLATES } from "@/lib/templates/template-registry";
import fs from "fs";
import path from "path";

describe("MIS Templates Registry (Phase 9 Expansion - 22+ Templates)", () => {
  it("contains at least 20 production templates (22 registered)", () => {
    expect(MIS_TEMPLATES.length).toBeGreaterThanOrEqual(20);
    expect(MIS_TEMPLATES.length).toBe(22);
  });

  it("ensures all templates have unique IDs, valid layouts, and themes", () => {
    const ids = new Set<string>();
    const validLayouts = ["boardroom", "trend_focus", "split", "kpi_heavy", "matrix", "compact"];
    const validThemes = ["indigo", "emerald", "blue", "violet", "amber", "rose", "cyan", "slate"];

    for (const t of MIS_TEMPLATES) {
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);

      expect(t.name.trim().length).toBeGreaterThan(0);
      expect(t.description.trim().length).toBeGreaterThan(0);
      expect(validLayouts).toContain(t.layoutStyle);
      expect(validThemes).toContain(t.colorTheme);
      expect(t.widgets.length).toBeGreaterThanOrEqual(3);
      expect(t.requiredColumns.length).toBeGreaterThan(0);
      expect(t.metrics.length).toBeGreaterThan(0);
    }
  });

  it("verifies that all template CSV sample files physically exist on disk", () => {
    const sampleDir = path.resolve(process.cwd(), "public/sample-data");

    for (const t of MIS_TEMPLATES) {
      const filePath = path.join(sampleDir, t.filename);
      expect(fs.existsSync(filePath), `Missing sample data file: ${t.filename}`).toBe(true);

      const content = fs.readFileSync(filePath, "utf-8");
      expect(content.trim().length).toBeGreaterThan(0);
      // Check that header matches required columns
      const firstLine = content.split("\n")[0];
      for (const col of t.requiredColumns) {
        expect(firstLine).toContain(col);
      }
    }
  });
});
