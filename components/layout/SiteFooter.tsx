import Image from "next/image";
import Link from "next/link";

import { BRAND } from "@/config/brand";
import { Container } from "@/components/layout/Container";
import { CompareTray } from "@/components/compare/CompareTray";

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      href={href}
    >
      {label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <>
      <CompareTray />
      <footer className="border-t border-[var(--border-soft)] bg-[var(--surface-1)]">
        <Container className="py-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 */}
            <div>
              <div className="flex items-center gap-3">
                <Image src="/brand-kit/logo.svg" alt={BRAND.name} width={160} height={32} className="h-8 w-auto" />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                India-first HR software discovery for SMEs — compare tools, get explainable recommendations, and request demos without vendor spam.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                  Privacy-first
                </span>
                <span className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
                  Explainable shortlists
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Product</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <FooterLink href="/tools" label="Tools" />
                </li>
                <li>
                  <FooterLink href="/vendors" label="Vendors" />
                </li>
                <li>
                  <FooterLink href="/categories" label="Categories" />
                </li>
                <li>
                  <FooterLink href="/compare" label="Compare" />
                </li>
                <li>
                  <FooterLink href="/recommend" label="Get a shortlist" />
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Resources</div>
              <div className="mt-3 space-y-4 text-sm">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-[var(--text-muted)]">Buyer guides</div>
                  <ul className="mt-2 space-y-2">
                    <li>
                      <FooterLink href="/resources" label="Browse all resources" />
                    </li>
                    <li>
                      <FooterLink href="/methodology" label="Methodology" />
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-semibold tracking-wide text-[var(--text-muted)]">Compliance guides</div>
                  <ul className="mt-2 space-y-2">
                    <li>
                      <FooterLink href="/compliance/pf-compliance-guide" label="PF Guide" />
                    </li>
                    <li>
                      <FooterLink href="/compliance/esi-complete-guide" label="ESI Guide" />
                    </li>
                    <li>
                      <FooterLink href="/compliance/pt-multi-state-guide" label="PT Multi-State" />
                    </li>
                    <li>
                      <FooterLink href="/compliance/tds-payroll-guide" label="TDS Guide" />
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-semibold tracking-wide text-[var(--text-muted)]">Checklists & tools</div>
                  <ul className="mt-2 space-y-2">
                    <li>
                      <FooterLink href="/india-payroll-risk-checklist" label="India payroll risk checklist" />
                    </li>
                    <li>
                      <FooterLink href="/payroll-risk-scanner" label="Payroll risk scanner" />
                    </li>
                    <li>
                      <FooterLink href="/hrms-fit-score" label="HRMS fit score" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 4 */}
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Company & legal</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <FooterLink href="/privacy" label="Privacy" />
                </li>
                <li>
                  <FooterLink href="/terms" label="Terms" />
                </li>
              </ul>
              <div className="mt-4 text-sm text-[var(--text-muted)]">
                Contact: {" "}
                <a
                  className="font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  href="mailto:hello@hrsignal.in"
                >
                  hello@hrsignal.in
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[var(--border-soft)] pt-6 text-xs text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <div>© {BRAND.name}</div>
            <div>We don’t share your details without consent.</div>
          </div>
        </Container>
      </footer>
    </>
  );
}
