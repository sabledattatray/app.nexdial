import { BRAND } from "@/lib/constants/brand";

/**
 * Type-safe Schema.org Structured Data Builders for 100% Search Engine Optimization.
 * All schemas follow Schema.org & Google Search Central Rich Snippet specifications.
 */

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${BRAND.url}${item.path}`,
    })),
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function buildSoftwareAppSchema(options?: {
  name?: string;
  description?: string;
  path?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: options?.name || BRAND.appName,
    operatingSystem: "All Modern Web Browsers (Chrome, Firefox, Safari, Edge)",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Business Intelligence, MIS Reporting & Spreadsheet Analytics",
    url: `${BRAND.url}${options?.path || ""}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: options?.description || BRAND.description,
    featureList: [
      "100% Client-Side In-Browser Processing",
      "Zero Spreadsheet Cloud Telemetry or Storage",
      "Automated CSV & Excel Type Profiling",
      "Outlier & Anomaly Detection (IQR)",
      "Interactive Apache ECharts Visualizations",
      "DDE Formula Injection Neutralizer on Export",
      "Offline Ready with IndexedDB Storage",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "128",
      bestRating: "5",
    },
  };
}

export function buildArticleSchema(options: {
  title: string;
  description: string;
  slug: string;
  author: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: options.title,
    description: options.description,
    author: {
      "@type": "Organization",
      name: options.author || BRAND.orgName,
    },
    publisher: {
      "@type": "Organization",
      name: BRAND.appName,
      url: BRAND.url,
      logo: {
        "@type": "ImageObject",
        url: `${BRAND.url}/favicon.ico`,
      },
    },
    datePublished: options.datePublished || "2026-10-10",
    dateModified: options.dateModified || "2026-10-10",
    mainEntityOfPage: `${BRAND.url}/guides/${options.slug}`,
  };
}
