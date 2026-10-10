import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://openmis.dev";
  const now = new Date();

  const publicRoutes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/features", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/how-it-works", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/templates", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/excel-to-dashboard", changeFrequency: "weekly" as const, priority: 0.95 },
    { path: "/csv-dashboard-generator", changeFrequency: "weekly" as const, priority: 0.95 },
    { path: "/free-mis-report-generator", changeFrequency: "weekly" as const, priority: 0.95 },
    { path: "/sales-dashboard-from-excel", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/inventory-dashboard-template", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/hr-mis-dashboard", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/finance-mis-dashboard", changeFrequency: "weekly" as const, priority: 0.85 },
    { path: "/guides", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/guides/clean-excel-data", changeFrequency: "monthly" as const, priority: 0.75 },
    { path: "/guides/choose-chart-types", changeFrequency: "monthly" as const, priority: 0.75 },
    { path: "/guides/sales-kpis-and-growth", changeFrequency: "monthly" as const, priority: 0.75 },
    { path: "/guides/prevent-spreadsheet-errors", changeFrequency: "monthly" as const, priority: 0.75 },
    { path: "/privacy", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/security", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.6 },
    { path: "/changelog", changeFrequency: "weekly" as const, priority: 0.6 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.4 },
    { path: "/license", changeFrequency: "yearly" as const, priority: 0.4 },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
