import { describe, it, expect } from "vitest";
import { EDUCATIONAL_GUIDES } from "@/lib/guides/guide-data";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("Phase 7: SEO, Educational Guides & Metadata", () => {
  it("contains all 4 required educational guides with valid content", () => {
    const guides = Object.values(EDUCATIONAL_GUIDES);
    expect(guides.length).toBe(4);

    const requiredSlugs = [
      "clean-excel-data",
      "choose-chart-types",
      "sales-kpis-and-growth",
      "prevent-spreadsheet-errors",
    ];

    for (const slug of requiredSlugs) {
      const guide = EDUCATIONAL_GUIDES[slug];
      expect(guide).toBeDefined();
      expect(guide.slug).toBe(slug);
      expect(guide.title.length).toBeGreaterThan(15);
      expect(guide.subtitle.length).toBeGreaterThan(20);
      expect(guide.description.length).toBeGreaterThan(30);
      expect(guide.readingTimeMinutes).toBeGreaterThan(0);
      expect(guide.summaryPoints.length).toBeGreaterThanOrEqual(3);
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);

      for (const section of guide.sections) {
        expect(section.heading.length).toBeGreaterThan(3);
        expect(section.paragraphs.length).toBeGreaterThan(0);
      }
    }
  });

  it("ensures all related slugs reference real existing guides", () => {
    for (const guide of Object.values(EDUCATIONAL_GUIDES)) {
      for (const relSlug of guide.relatedSlugs) {
        expect(EDUCATIONAL_GUIDES[relSlug]).toBeDefined();
      }
    }
  });

  it("generates a valid sitemap with all public marketing and guide routes", () => {
    const items = sitemap();
    expect(items.length).toBeGreaterThanOrEqual(20);

    const urls = items.map((i) => i.url);

    // Verify key landing pages are present
    expect(urls.some((u) => u.endsWith("/excel-to-dashboard"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/csv-dashboard-generator"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/free-mis-report-generator"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/sales-dashboard-from-excel"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/inventory-dashboard-template"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/hr-mis-dashboard"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/finance-mis-dashboard"))).toBe(true);

    // Verify all 4 guides are present
    expect(urls.some((u) => u.endsWith("/guides/clean-excel-data"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/guides/choose-chart-types"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/guides/sales-kpis-and-growth"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/guides/prevent-spreadsheet-errors"))).toBe(true);

    // Verify privacy and trust pages are present
    expect(urls.some((u) => u.endsWith("/privacy"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/security"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/faq"))).toBe(true);

    // CRITICAL: Ensure private app workspace routes are NOT in the public sitemap
    expect(urls.some((u) => u.includes("/app/"))).toBe(false);

    // Verify valid priority and change frequencies
    for (const item of items) {
      expect(item.priority).toBeGreaterThan(0);
      expect(item.priority).toBeLessThanOrEqual(1.0);
      expect(item.changeFrequency).toBeDefined();
    }
  });

  it("configures robots.txt to disallow indexing of private /app/ workspace routes", () => {
    const r = robots();
    expect(r.rules).toBeDefined();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toContain("/app/");
    expect(r.sitemap).toContain("sitemap.xml");
  });
});
