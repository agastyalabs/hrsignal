import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listResourceArticles } from "@/lib/resources/articles";

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

export const metadata = {
  title: "Resources — HR Software Buyer Guides (India) | HR Signal",
  description: "Buyer guides, checklists, and playbooks for Indian SME HR teams.",
  alternates: { canonical: "https://hrsignal.vercel.app/resources" },
};

export default function ResourcesPage() {
  const articles = listResourceArticles();
  const featured = articles.find((a) => a.featured);
  const rest = featured ? articles.filter((a) => a.slug !== featured.slug) : articles;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.slice(0, 50).map((a, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: a.title,
      url: `https://hrsignal.vercel.app/resources/${a.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <h1 className="sr-only">Resources</h1>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Resources"
            subtitle="Buyer guides, checklists and playbooks for Indian SME HR teams."
          />
          <ButtonLink href="/recommend" variant="primary" size="md">
            Get recommendations
          </ButtonLink>
        </div>

        {featured ? (
          <Card className="mt-6 overflow-hidden">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex-1 p-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-xs font-semibold text-[#CBD5E1]">
                  Featured
                  <span className="h-1 w-1 rounded-full bg-[#334155]" />
                  {featured.category}
                  <span className="h-1 w-1 rounded-full bg-[#334155]" />
                  {featured.readingTime}
                </div>

                <div className="mt-3 text-2xl font-semibold tracking-tight text-[#F9FAFB]">
                  <Link href={`/resources/${featured.slug}`} className="hover:underline">
                    {featured.title}
                  </Link>
                </div>

                <div className="mt-2 text-sm font-medium text-[#94A3B8]">
                  {featured.author} • Published {formatDate(featured.date)}
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">{featured.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {featured.tags.slice(0, 6).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-xs font-medium text-[#CBD5E1]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <ButtonLink href={`/resources/${featured.slug}`} variant="primary" size="md">
                    Read featured →
                  </ButtonLink>
                  <ButtonLink href="/recommend" variant="secondary" size="md">
                    Get my shortlist
                  </ButtonLink>
                </div>
              </div>

              <div className="border-t border-[#1F2937] bg-[#0F172A] p-6 md:w-[360px] md:border-l md:border-t-0">
                <div className="text-sm font-semibold text-[#F9FAFB]">Popular topics</div>
                <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                  Quick starting points—use these to shape your shortlist questions.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["HRMS", "Payroll", "Implementation", "ATS", "Budget", "AI"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#1F2937] bg-[#111827] px-3 py-1 text-xs font-medium text-[#CBD5E1]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {rest.map((a) => (
            <Card key={a.slug} className="h-full">
              <div className="flex h-full flex-col">
                <div>
                  <div className="text-sm font-medium text-[#94A3B8]">{formatDate(a.date)}</div>
                  <div className="mt-1 text-xs font-medium text-[#94A3B8]">{a.author}</div>
                  <div className="mt-2 text-lg font-semibold text-[#F9FAFB]">
                    <Link href={`/resources/${a.slug}`} className="hover:underline">
                      {a.title}
                    </Link>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">{a.summary}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-xs font-medium text-[#CBD5E1]">
                      {a.category}
                    </span>
                    <span className="text-xs font-medium text-[#94A3B8]">{a.readingTime}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {a.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-xs font-medium text-[#CBD5E1]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <ButtonLink href={`/resources/${a.slug}`} variant="secondary" size="sm">
                    Read →
                  </ButtonLink>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-[var(--shadow-sm)]">
          <div className="text-lg font-semibold text-[#F9FAFB]">Want a guided shortlist instead?</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#CBD5E1]">
            Answer a short questionnaire and get 3–5 tools with explainable match reasons.
          </p>
          <Link
            href="/recommend"
            className="mt-4 inline-flex h-11 items-center rounded-lg bg-[#8B5CF6] px-4 text-sm font-medium text-[#0B1220] transition-all duration-200 hover:bg-[#7C3AED]"
          >
            Get recommendations
          </Link>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
