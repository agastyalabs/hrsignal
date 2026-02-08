import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function RecommendSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ run?: string }>;
}) {
  const { run } = await searchParams;

  const runId = typeof run === "string" ? run : null;

  const data = runId
    ? await prisma.recommendationRun.findUnique({
        where: { id: runId },
        include: {
          submission: true,
        },
      })
    : null;

  const submission = data?.submission;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-[#F9FAFB]">
              Thanks — your HRSignal shortlist is being prepared
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              We’re matching your needs to the best-fit tools and generating clear “why this fits” reasons.
            </p>

            <div className="mt-6 grid gap-4">
              <Card className="border border-[#1F2937] bg-[#111827] p-5 shadow-sm">
                <div className="text-sm font-semibold text-[#F9FAFB]">Summary</div>
                {submission ? (
                  <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-[#94A3B8]">Company</dt>
                      <dd className="mt-0.5 font-medium text-[#F9FAFB]">{submission.companyName}</dd>
                    </div>
                    <div>
                      <dt className="text-[#94A3B8]">Size band</dt>
                      <dd className="mt-0.5 font-medium text-[#F9FAFB]">{submission.sizeBand}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-[#94A3B8]">Needs</dt>
                      <dd className="mt-0.5 font-medium text-[#F9FAFB]">
                        {(submission.categoriesNeeded as string[])?.join(", ") || "—"}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="mt-3 text-sm text-[#CBD5E1]">Shortlist created. Use the actions below to keep exploring.</div>
                )}
              </Card>

              {runId ? (
                <Card className="border border-[#1F2937] bg-[#0F172A] p-5 shadow-sm">
                  <div className="text-sm font-semibold text-[#F9FAFB]">Next</div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <ButtonLink href={`/results/${runId}`} variant="primary">
                      View my shortlist
                    </ButtonLink>
                    <ButtonLink href="/tools" variant="secondary">
                      Browse tools
                    </ButtonLink>
                    <ButtonLink href="/compare" variant="secondary">
                      Compare tools
                    </ButtonLink>
                    <ButtonLink href="/resources" variant="secondary">
                      Read HR guides
                    </ButtonLink>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">
                    Tip: Use Compare on 2+ tools to see differences side-by-side.
                  </p>
                </Card>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/tools">
                    Browse tools →
                  </Link>
                  <Link className="text-sm font-medium text-[#8B5CF6] hover:text-[#7C3AED]" href="/resources">
                    Read HR guides →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
