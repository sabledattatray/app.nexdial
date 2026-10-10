import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Calculator,
  Sparkles,
} from "lucide-react";
import { EDUCATIONAL_GUIDES } from "@/lib/guides/guide-data";
import { JsonLd } from "@/components/seo/JsonLd";

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(EDUCATIONAL_GUIDES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = EDUCATIONAL_GUIDES[slug];

  if (!guide) {
    return {
      title: "Guide Not Found | OpenMIS",
    };
  }

  return {
    title: `${guide.title} | OpenMIS Guide`,
    description: guide.description,
    alternates: {
      canonical: `https://openmis.dev/guides/${guide.slug}`,
    },
    openGraph: {
      title: `${guide.title} | OpenMIS Guide`,
      description: guide.description,
      type: "article",
      publishedTime: "2026-10-10T00:00:00.000Z",
      authors: [guide.author],
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = EDUCATIONAL_GUIDES[slug];

  if (!guide) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.description,
    author: {
      "@type": "Organization",
      name: guide.author,
    },
    publisher: {
      "@type": "Organization",
      name: "OpenMIS",
      logo: {
        "@type": "ImageObject",
        url: "https://openmis.dev/favicon.ico",
      },
    },
    datePublished: "2026-10-10",
    mainEntityOfPage: `https://openmis.dev/guides/${guide.slug}`,
  };

  const relatedGuides = guide.relatedSlugs
    .map((s) => EDUCATIONAL_GUIDES[s])
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <JsonLd data={jsonLd} />
      <MarketingHeader />

      <main className="flex-1">
        {/* Article Header */}
        <header className="border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to All Guides
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-xs">
                {guide.category}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {guide.readingTimeMinutes} min read
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{guide.publishDate}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {guide.title}
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {guide.subtitle}
            </p>
          </div>
        </header>

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Summary Box */}
          <div className="mb-12 rounded-xl border border-indigo-200/70 bg-indigo-50/50 dark:border-indigo-900/60 dark:bg-indigo-950/20 p-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Key Executive Takeaways
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {guide.summaryPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Sections */}
          <article className="prose prose-slate dark:prose-invert max-w-none space-y-12">
            {guide.sections.map((sec, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  {sec.heading}
                </h2>

                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {p}
                  </p>
                ))}

                {/* Callout if present */}
                {sec.callout && (
                  <div
                    className={`rounded-lg p-5 border text-sm my-6 space-y-1.5 ${
                      sec.callout.type === "warning"
                        ? "bg-amber-50/70 border-amber-200 text-amber-950 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-200"
                        : sec.callout.type === "formula"
                        ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 dark:bg-indigo-950/30 dark:border-indigo-900/60 dark:text-indigo-200"
                        : "bg-emerald-50/70 border-emerald-200 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-900/60 dark:text-emerald-200"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-2">
                      {sec.callout.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                      {sec.callout.type === "formula" && <Calculator className="w-4 h-4 text-indigo-600" />}
                      {sec.callout.type === "tip" && <Lightbulb className="w-4 h-4 text-emerald-600" />}
                      <span>{sec.callout.title}</span>
                    </div>
                    <p className="leading-relaxed text-xs sm:text-sm">{sec.callout.body}</p>
                  </div>
                )}

                {/* Code or Formula Sample */}
                {sec.codeOrExample && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 my-4 bg-slate-900 text-slate-100 font-mono text-xs p-4">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 font-sans font-bold">
                      {sec.codeOrExample.label}
                    </div>
                    <pre className="overflow-x-auto whitespace-pre">
                      <code>{sec.codeOrExample.content}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </article>

          {/* Interactive CTA Banner */}
          <div className="mt-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white shadow-xl shadow-indigo-500/10 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold">
              Test This Workflow in OpenMIS
            </h3>
            <p className="text-indigo-100 text-sm sm:text-base max-w-xl">
              Upload your spreadsheet now. Automatic profiling and reversible data cleaning run directly in your browser with ₹0 cost and zero cloud telemetry.
            </p>
            <div className="pt-2">
              <Link href="/app/new">
                <Button size="lg" variant="secondary" className="gap-2 font-semibold text-slate-900">
                  <Sparkles className="w-4 h-4" />
                  Upload Spreadsheet to Test
                </Button>
              </Link>
            </div>
          </div>

          {/* Related Guides */}
          {relatedGuides.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Related Educational Guides
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedGuides.map((rel) => (
                  <Card key={rel.slug} className="p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                      <Link href={`/guides/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {rel.description}
                    </p>
                    <div className="mt-3">
                      <Link
                        href={`/guides/${rel.slug}`}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 inline-flex items-center gap-1 hover:underline"
                      >
                        Read article <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
