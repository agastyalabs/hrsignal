import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getResourceArticle, listResourceArticles } from "@/lib/resources/articles";
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

export default async function ResourceArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getResourceArticle(slug);

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-[#0B1220]">
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
            <Card className="shadow-sm">
              <Markdownish content={article.content} />
            </Card>
          </main>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 shadow-sm">
              <div className="text-sm font-semibold text-[#F9FAFB]">More resources</div>
              <div className="mt-3 space-y-3">
                {listResourceArticles()
                  .filter((a) => a.slug !== article.slug)
                  .slice(0, 4)
                  .map((a) => (
                    <div key={a.slug} className="rounded-xl border border-[#1F2937] bg-[#0F172A] p-4">
                      <div className="text-xs font-medium text-[#94A3B8]">{formatDate(a.date)}</div>
                      <Link href={`/resources/${a.slug}`} className="mt-2 block text-sm font-semibold text-[#F9FAFB] hover:underline">
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
