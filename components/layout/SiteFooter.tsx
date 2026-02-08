import Image from "next/image";
import Link from "next/link";

import { BRAND } from "@/config/brand";
import { Container } from "@/components/layout/Container";
import { CompareTray } from "@/components/compare/CompareTray";

export function SiteFooter() {
  return (
    <>
      <CompareTray />
      <footer className="border-t border-[#1F2937] bg-[#0B1220]">
        <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src={BRAND.logo} alt={BRAND.name} width={150} height={28} className="h-6 w-auto" />
              <div className="text-base font-semibold text-[#F9FAFB]">{BRAND.name}</div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
              India-first HR software discovery for SMEs — compare tools, get explainable recommendations, and request demos.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#1F2937] bg-[#111827] px-3 py-1 text-xs font-medium text-[#CBD5E1]">
                Privacy-first
              </span>
              <span className="rounded-full border border-[#1F2937] bg-[#0F172A] px-3 py-1 text-xs font-medium text-[#CBD5E1]">
                India-first SME fit
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#F9FAFB]">Product</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/tools">
                  Tools
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/vendors">
                  Vendors
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/categories">
                  Categories
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/resources">
                  Resources
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/recommend">
                  Get recommendations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#F9FAFB]">Resources</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/resources/best-hrms-india-sme-2026">
                  Best HRMS (India, 2026)
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/resources/payroll-compliance-checklist-india-2026">
                  Payroll compliance checklist
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/resources">
                  Browse all resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#F9FAFB]">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/terms">
                  Terms
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-[#94A3B8]">
              Privacy-first: we don’t share your details without consent.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#1F2937] pt-6 text-xs text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} {BRAND.name}</div>
          <div>
            Questions? Email{" "}
            <a className="text-[#CBD5E1] underline decoration-[#1F2937]" href="mailto:hello@hrsignal.in">
              hello@hrsignal.in
            </a>
          </div>
        </div>
      </Container>
      </footer>
    </>
  );
}
