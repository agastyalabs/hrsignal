import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SEOArticleTemplate } from "@/components/seo/SEOArticleTemplate";

export const metadata: Metadata = {
  title: "Best Payroll Software for Small Business in India (2026) | HR Signal",
  description:
    "A practical guide to choosing payroll software for small businesses in India — with compliance checklist, evaluation criteria, and India-ready shortlist CTA.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <SEOArticleTemplate
        title="Best Payroll Software for Small Business in India (2026)"
        intro={
          <>
            If you’re running payroll for a 20–200 employee Indian company, the risk usually isn’t calculations — it’s statutory scope,
            multi-state edge cases, and month-end control. This guide gives you a buyer-first checklist and a deterministic way to shortlist.
          </>
        }
        primaryCTA={{ label: "Get my shortlist", href: "/recommend" }}
        secondaryCTA={{ label: "Read methodology", href: "/methodology" }}
        sections={[
          {
            heading: "What ‘good’ payroll software looks like for Indian SMEs",
            content: (
              <>
                <p>
                  For small businesses, the best payroll software is the one that reliably produces compliant outputs with minimal month-end
                  effort — and has evidence you can verify in a demo.
                </p>
                <ul className="space-y-2">
                  <li>• Handles PF/ESI/PT/TDS correctly for your applicability (and shows the registers/challans/export path).</li>
                  <li>• Supports arrears, reversals, cutoffs, and attendance-to-payroll reconciliation without manual Excel patches.</li>
                  <li>• Has clear audit trails: approvals, maker-checker, edit history, and role-based access.</li>
                  <li>• Integrates with the tools you actually use (attendance/biometric, accounting/GL, HRMS if separate).</li>
                </ul>
              </>
            ),
          },
          {
            heading: "Key evaluation questions (ask these in every demo)",
            content: (
              <>
                <ul className="space-y-2">
                  <li>• Show PF/ESI/PT setup for 2 states you operate in (and how exceptions are handled).</li>
                  <li>• Run a month-end scenario: arrears + bonus + LOP + reversal — then export registers.</li>
                  <li>• What is the approval workflow? Can we see the audit trail for edits?</li>
                  <li>• What breaks during implementation (data migration, salary structures, attendance policies)?</li>
                </ul>
                <p>
                  If you want a deeper checklist, use the <Link className="font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100" href="/payroll-risk-scanner">India Payroll Risk Scanner</Link> and carry the risk tier
                  into your shortlist.
                </p>
              </>
            ),
          },
          {
            heading: "Pricing transparency: what to validate",
            content: (
              <>
                <p>
                  Indian SME payroll pricing can hide in setup fees, per-employee slabs, add-ons (TDS filing, contractor payouts), and support
                  tiers. A ‘good’ vendor should make pricing discoverable and repeatable.
                </p>
                <ul className="space-y-2">
                  <li>• Verify: public pricing page or clearly documented plan notes.</li>
                  <li>• Validate: implementation timelines, migration scope, and support SLA.</li>
                  <li>• Validate: statutory update cadence and responsibility split (vendor vs customer).</li>
                </ul>
              </>
            ),
          },
          {
            heading: "How HRSignal helps you shortlist (deterministic, not paid)",
            content: (
              <>
                <p>
                  HRSignal uses an evidence-first, deterministic scoring model to surface what’s verified vs what needs validation. There’s no
                  paid ranking.
                </p>
                <ul className="space-y-2">
                  <li>• HRSignal Readiness Score™ (0–100) blends compliance signals, evidence depth, integration visibility, and freshness.</li>
                  <li>• “Verification depth” highlights missing info so you can validate fast instead of guessing.</li>
                  <li>• You can export a decision report for internal review.</li>
                </ul>
              </>
            ),
          },
        ]}
        faq={[
          {
            question: "What payroll software is best for a small business in India?",
            answer: (
              <>
                The best option is the one that matches your statutory scope (PF/ESI/PT/TDS), your state footprint, and your operational
                complexity (attendance + cutoffs + arrears). Use a shortlist approach: compare 2–3 vendors, run a real month-end scenario in the
                demo, and verify evidence links.
              </>
            ),
          },
          {
            question: "How do I avoid compliance surprises after buying payroll software?",
            answer: (
              <>
                Treat missing data as “validate”. Ask for registers/challans outputs, approval/audit trails, and how they handle edge cases like
                reversals and multi-state mappings. HRSignal surfaces verification freshness and evidence depth to reduce blind spots.
              </>
            ),
          },
          {
            question: "Can I export a decision report for internal approvals?",
            answer: (
              <>
                Yes — HRSignal includes a printable report view for your shortlisted vendors. Start with a deterministic shortlist on
                <Link className="font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100" href="/recommend"> /recommend</Link>.
              </>
            ),
          },
        ]}
      />

      <SiteFooter />
    </div>
  );
}
