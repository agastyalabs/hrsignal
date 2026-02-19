import Image from "next/image";
import Link from "next/link";

import { BRAND } from "@/config/brand";
import { Container } from "@/components/layout/Container";
import { CompareTray } from "@/components/compare/CompareTray";

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="text-[rgba(15,23,42,0.72)] transition-colors duration-200 hover:text-[var(--primary-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.35)]"
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
      <footer className="border-t border-slate-200/70 bg-[var(--surface-grey)]">
        <Container className="max-w-7xl py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 */}
            <div>
              <div className="flex items-center gap-2">
                <Image src={BRAND.logo} alt={BRAND.name} width={150} height={28} className="h-6 w-auto" />
                <div className="text-base font-semibold text-[var(--text-main)]">{BRAND.name}</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(15,23,42,0.64)]">
                India-first HR software discovery for SMEs — compare tools, get explainable recommendations, and request demos without vendor spam.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[rgba(15,23,42,0.62)]">
                  Privacy-first
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-[rgba(15,23,42,0.62)]">
                  Explainable shortlists
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="text-sm font-semibold tracking-tight text-[var(--text-main)]">Product</div>
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
                  <FooterLink href="/recommend" label="Get my shortlist" />
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <div className="text-sm font-semibold tracking-tight text-[var(--text-main)]">Resources</div>
              <div className="mt-3 space-y-4 text-sm">
                <div>
                  <div className="text-xs font-semibold tracking-wide text-[rgba(15,23,42,0.58)]">Buyer guides</div>
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
                  <div className="text-xs font-semibold tracking-wide text-[rgba(15,23,42,0.58)]">Compliance guides</div>
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
                  <div className="text-xs font-semibold tracking-wide text-[rgba(15,23,42,0.58)]">Checklists & tools</div>
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
              <div className="text-sm font-semibold tracking-tight text-[var(--text-main)]">Company & legal</div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <FooterLink href="/privacy" label="Privacy" />
                </li>
                <li>
                  <FooterLink href="/terms" label="Terms" />
                </li>
              </ul>
              <div className="mt-5 text-sm text-[rgba(15,23,42,0.64)]">
                Contact:{" "}
                <a
                  className="font-semibold text-[var(--primary-blue)] underline decoration-[rgba(37,99,235,0.28)] underline-offset-4 hover:text-[var(--primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.35)]"
                  href="mailto:hello@hrsignal.in"
                >
                  hello@hrsignal.in
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-slate-200/70 pt-7 text-xs text-[rgba(15,23,42,0.56)] sm:flex-row sm:items-center sm:justify-between">
            <div>© {BRAND.name}</div>
            <div>We don’t share your details without consent.</div>
          </div>
        </Container>
      </footer>
    </>
  );
}
