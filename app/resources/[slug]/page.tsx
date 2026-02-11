import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getResourceArticle, listResourceArticles } from "@/lib/resources/articles";
import type { Metadata } from "next";
import { absUrl } from "@/lib/seo/url";
import { Markdownish } from "../Markdownish";

export function generateStaticParams() {
  return listResourceArticles().map((a) => ({ slug: a.slug }));
}

function formatDate(date: string) {
  try {
    return new Date(date + "T00:00:00Z").toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return date;
  }
}

function relatedCategoryFromArticle(a: { category: string; tags: string[]; slug: string }): string | null {
  const tags = new Set(a.tags.map((t) => t.toLowerCase()));
  const cat = a.category.toLowerCase();

  if (tags.has("payroll") || tags.has("compliance") || cat.includes("checklist")) return "payroll";
  if (tags.has("ats") || tags.has("hiring")) return "ats";
  if (tags.has("budget") || cat.includes("budget")) return "hrms";
  if (tags.has("implementation")) return "hrms";
  if (tags.has("ai")) return "hrms";
  if (tags.has("hrms")) return "hrms";

  // Fallback heuristics by slug keywords
  if (a.slug.includes("payroll")) return "payroll";
  if (a.slug.includes("ats")) return "ats";
  if (a.slug.includes("hrms")) return "hrms";

  return null;
}

async function getRelatedTools(article: { category: string; tags: string[]; slug: string }) {
  const cat = relatedCategoryFromArticle(article);
  if (!cat) return [] as Array<{ slug: string; name: string; vendor_name: string; short_description: string }>;

  const mod = (await import("@/data/tools_seed.json")) as { default: unknown };
  const tools = (mod.default as Array<any>) // eslint-disable-line @typescript-eslint/no-explicit-any
    .filter((t) => Array.isArray(t.categories) && t.categories.includes(cat))
    .slice(0, 6)
    .map((t) => ({
      slug: String(t.slug),
      name: String(t.name ?? t.slug),
      vendor_name: String(t.vendor_name ?? t.vendor_name ?? ""),
      short_description: String(t.short_description ?? ""),
    }));

  return tools;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);

  const title = article ? `${article.title} | HRSignal Resources` : `Resource | HRSignal`;
  const description = article?.summary ?? "Buyer guides and playbooks for Indian SME HR teams.";
  const url = absUrl(`/resources/${slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getResourceArticle(slug);

  if (!article) notFound();

  const relatedTools = await getRelatedTools(article);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-[#94A3B8]">
              <span>{formatDate(article.date)}</span>
              <span className="text-[#334155]">•</span>
              <span>{article.category}</span>
              <span className="text-[#334155]">•</span>
              <span>{article.readingTime}</span>
              <span className="text-[#334155]">•</span>
              <span>{article.author}</span>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-[#F9FAFB]">{article.title}</div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#CBD5E1]">{article.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-xs font-medium text-[#CBD5E1]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <ButtonLink href="/resources" variant="secondary" size="sm">
              ← All resources
            </ButtonLink>
            <ButtonLink href="/recommend" variant="primary" size="sm">
              Get recommendations
            </ButtonLink>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <main className="lg:col-span-8">
            <Card>
              <Markdownish content={article.content} />
            </Card>

            {relatedTools.length ? (
              <div className="mt-6 rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-[var(--shadow-sm)]">
                <div className="text-sm font-semibold text-[#F9FAFB]">Related tools</div>
                <p className="mt-1 text-sm text-[#CBD5E1]">
                  A few directory picks commonly evaluated alongside this topic.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {relatedTools.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/tools/${t.slug}`}
                      className="rounded-xl border border-[#1F2937] bg-[#0F172A] p-4 transition-all duration-200 hover:border-[#334155] hover:bg-[#111827]"
                    >
                      <div className="text-sm font-semibold text-[#F9FAFB]">{t.name}</div>
                      <div className="mt-1 text-xs font-medium text-[#94A3B8]">by {t.vendor_name}</div>
                      {t.short_description ? (
                        <div className="mt-2 text-xs leading-relaxed text-[#CBD5E1]">{t.short_description}</div>
                      ) : null}
                      <div className="mt-3 text-xs font-semibold text-indigo-300">View tool →</div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </main>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 shadow-[var(--shadow-sm)]">
              <div className="text-sm font-semibold text-[#F9FAFB]">More resources</div>
              <div className="mt-3 space-y-3">
                {listResourceArticles()
                  .filter((a) => a.slug !== article.slug)
                  .slice(0, 4)
                  .map((a) => (
                    <div key={a.slug} className="rounded-xl border border-[#1F2937] bg-[#0F172A] p-4">
                      <div className="text-xs font-medium text-[#94A3B8]">{formatDate(a.date)}</div>
                      <Link
                        href={`/resources/${a.slug}`}
                        className="mt-2 block text-sm font-semibold text-[#F9FAFB] hover:underline"
                      >
                        {a.title}
                      </Link>
                      <div className="mt-1 text-xs leading-relaxed text-[#CBD5E1]">{a.summary}</div>
                    </div>
                  ))}
              </div>

              <div className="mt-5">
                <Link className="text-sm font-medium text-indigo-300 hover:underline" href="/resources">
                  Browse all →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
