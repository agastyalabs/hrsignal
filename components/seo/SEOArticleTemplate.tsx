import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export type SEOArticleSection = {
  heading: string;
  content: React.ReactNode;
};

export type SEOArticleFaq = {
  question: string;
  answer: React.ReactNode;
};

export type SEOArticleCta = {
  label: string;
  href: string;
};

export function SEOArticleTemplate({
  title,
  intro,
  sections,
  faq,
  primaryCTA,
  secondaryCTA,
}: {
  title: string;
  intro: React.ReactNode;
  sections: SEOArticleSection[];
  faq?: SEOArticleFaq[];
  primaryCTA: SEOArticleCta;
  secondaryCTA?: SEOArticleCta;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <main className="py-10 sm:py-14">
        <Container className="max-w-4xl">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{title}</h1>
            <div className="mt-3 max-w-[75ch] text-sm leading-7 text-[var(--text-muted)]">{intro}</div>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <ButtonLink href={primaryCTA.href} size="lg" className="w-full justify-center sm:w-auto">
                {primaryCTA.label}
              </ButtonLink>
              {secondaryCTA ? (
                <Link
                  href={secondaryCTA.href}
                  className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto"
                >
                  {secondaryCTA.label}
                </Link>
              ) : null}
            </div>
          </header>

          <div className="mt-8 space-y-4">
            {sections.map((s) => (
              <Card key={s.heading} className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 shadow-none">
                <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[var(--text-muted)]">{s.content}</div>
              </Card>
            ))}
          </div>

          {faq?.length ? (
            <div className="mt-8">
              <div className="h-px w-full bg-[var(--border-soft)]" />
              <h2 className="mt-8 text-xl font-semibold tracking-tight text-[var(--text)]">FAQ</h2>
              <div className="mt-4 space-y-3">
                {faq.map((f) => (
                  <Card key={f.question} className="border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 shadow-none">
                    <details>
                      <summary className="cursor-pointer select-none text-sm font-semibold text-[var(--text)]">
                        {f.question}
                      </summary>
                      <div className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{f.answer}</div>
                    </details>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10">
            <div className="h-px w-full bg-[var(--border-soft)]" />
            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
              <div className="text-base font-semibold text-[var(--text)]">Ready to shortlist?</div>
              <div className="mt-1 text-sm leading-7 text-[var(--text-muted)]">
                Answer a few questions and get a deterministic India-ready shortlist with verification signals and validation checkpoints.
              </div>
              <div className="mt-4">
                <ButtonLink href={primaryCTA.href} size="md" className="w-full justify-center sm:w-auto">
                  {primaryCTA.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
