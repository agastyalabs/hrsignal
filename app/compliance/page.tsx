import Link from "next/link";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

import { COMPLIANCE_GUIDES } from "@/lib/compliance/guides";

export const metadata: Metadata = {
  title: "Compliance Guides | HRSignal",
  description: "PF, ESI, PT multi-state, and TDS guides for India payroll buyers — with demo validation checklists.",
  alternates: { canonical: "/compliance" },
};

export const dynamic = "force-static";

export default function ComplianceIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="text-xs font-semibold tracking-[0.12em] text-[var(--text-muted)]">RESOURCES</div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">Compliance Guides</h1>
            <p className="mt-3 text-[18px] leading-8 text-[var(--text-muted)]">
              Practical guides for Indian payroll buyers — focused on month-end controls and what to validate in vendor demos.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {COMPLIANCE_GUIDES.map((g) => (
                <Link
                  key={g.slug}
                  href={`/compliance/${g.slug}`}
                  className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-[var(--radius-lg)]"
                >
                  <Card className="h-full p-6 group-hover:bg-[var(--surface-2)]">
                    <div className="text-base font-semibold text-[var(--text)]">{g.title}</div>
                    <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{g.description}</div>
                    <div className="mt-4 text-sm font-semibold text-violet-200 group-hover:text-violet-100">Read →</div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
