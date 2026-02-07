import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <SectionHeading
          title="Resources"
          subtitle="Buyer guides and checklists (early access). We’ll expand this into a full library."
        />

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="shadow-sm">
            <div className="text-base font-semibold text-zinc-900">How to pick HRMS for an Indian SME</div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              A fast framework: size band, onboarding flows, document management, and compliance basics.
            </p>
            <div className="mt-4 text-sm font-medium text-indigo-700">Coming soon</div>
          </Card>

          <Card className="shadow-sm">
            <div className="text-base font-semibold text-zinc-900">Payroll + compliance checklist</div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              PF/ESI/PT/TDS readiness, approvals, bank integrations, and month-end accuracy checks.
            </p>
            <div className="mt-4 text-sm font-medium text-indigo-700">Coming soon</div>
          </Card>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-zinc-900">Want a guided shortlist instead?</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
            Answer a short questionnaire and get 3–5 tools with explainable match reasons.
          </p>
          <Link
            href="/recommend"
            className="mt-4 inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Get recommendations
          </Link>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
