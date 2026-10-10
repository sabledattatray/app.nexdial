import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/constants/brand";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${BRAND.appName} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.appName}`,
  },
  description: BRAND.description,
  keywords: [
    "Excel to dashboard",
    "CSV dashboard generator",
    "MIS report generator",
    "free business intelligence",
    "privacy-first analytics",
    "client-side dashboard",
    "open source BI",
    "Nexdial OpenMIS",
    "interactive Excel dashboard",
    "offline BI tool",
    "data profiling spreadsheet",
    "ECharts Excel dashboard",
    "sales MIS dashboard",
    "inventory MIS report",
    "HR dashboard Excel",
    "finance MIS dashboard",
    "zero cloud spreadsheet analytics",
  ],
  authors: [{ name: "Nexdial", url: BRAND.url }],
  creator: BRAND.appName,
  publisher: BRAND.orgName,
  applicationName: BRAND.appName,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BRAND.url,
    siteName: BRAND.appName,
    title: `${BRAND.appName} — ${BRAND.tagline}`,
    description: BRAND.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.appName} — ${BRAND.tagline}`,
    description: BRAND.description,
    creator: BRAND.twitterHandle,
    site: BRAND.twitterHandle,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
};

const rootStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.appName,
    alternateName: [BRAND.name, "Nexdial BI", "Open MIS"],
    url: BRAND.url,
    description: BRAND.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BRAND.url}/guides?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.orgName,
    url: BRAND.url,
    logo: `${BRAND.url}/favicon.ico`,
    sameAs: [BRAND.links.github],
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: BRAND.appName,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Business Intelligence, MIS Reporting & Excel Analytics",
    operatingSystem: "All Modern Web Browsers (Chrome, Firefox, Safari, Edge)",
    url: BRAND.url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: BRAND.description,
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
  },
];

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white"
      >
        <JsonLd data={rootStructuredData} />
        {children}
      </body>
    </html>
  );
}
