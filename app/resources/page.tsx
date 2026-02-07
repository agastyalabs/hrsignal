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

export default function ResourcesPage() {
  const articles = listResourceArticles();

  return (
    <div className="min-h-screen bg-[#0B1220]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            title="Resources"
            subtitle="Buyer guides, checklists and playbooks for Indian SME HR teams."
          />
          <ButtonLink href="/recommend" variant="primary" size="md">
            Get recommendations
          </ButtonLink>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {articles.map((a) => (
            <Card key={a.slug} className="shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#334155] hover:shadow-md motion-reduce:transition-none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[#94A3B8]">{formatDate(a.date)}</div>
                  <div className="mt-2 text-lg font-semibold text-[#F9FAFB]">
                    <Link href={`/resources/${a.slug}`} className="hover:underline">
                      {a.title}
                    </Link>
                  </div>
                </div>
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

              <div className="mt-5">
                <ButtonLink href={`/resources/${a.slug}`} variant="secondary" size="sm">
                  Read →
                </ButtonLink>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-[#1F2937] bg-[#111827] p-6 shadow-sm">
          <div className="text-lg font-semibold text-[#F9FAFB]">Want a guided shortlist instead?</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#CBD5E1]">
            Answer a short questionnaire and get 3–5 tools with explainable match reasons.
          </p>
          <Link
            href="/recommend"
            className="mt-4 inline-flex h-11 items-center rounded-lg bg-[#8B5CF6] px-4 text-sm font-medium text-[#0B1220] hover:bg-[#7C3AED]"
          >
            Get recommendations
          </Link>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
