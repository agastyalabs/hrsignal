import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="radius-card border border-slate-200 bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Guides</h1>
          <p className="mt-2 text-sm text-slate-600">Buyer-first guides and checklists for India HR/payroll decisions.</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <GuideCard title="Resources" desc="Evaluation scripts, glossaries, and practical templates." href="/resources" />
            <GuideCard title="Compliance" desc="PF/ESI/PT/TDS guides + demo validation checklists." href="/compliance" />
            <GuideCard title="Methodology" desc="How HRSignal scoring and verification works." href="/methodology" />
            <GuideCard title="Payroll risk scanner" desc="Quick risk tier + targeted validation questions." href="/payroll-risk-scanner" />
            <GuideCard title="Payroll risk checklist" desc="Printable checklist to carry into demos." href="/india-payroll-risk-checklist" />
            <GuideCard title="HRMS fit score" desc="Structured fit snapshot for HRMS buyers." href="/hrms-fit-score" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function GuideCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="radius-card border border-slate-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-float"
    >
      <div className="text-base font-extrabold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
      <div className="mt-4 text-sm font-semibold text-[var(--link)] hover:text-[var(--link-hover)]">Open →</div>
    </Link>
  );
}
