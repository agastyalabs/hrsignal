import Link from "next/link";
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/hrsignal-mark.svg" alt="HRSignal" className="h-5 w-5" />
              <div className="text-base font-semibold text-[#F9FAFB]">HRSignal</div>
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
                <Link className="text-gray-600 hover:text-gray-900" href="/resources">
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
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/resources/hrms-selection-india-sme">
                  HRMS buyer guide
                </Link>
              </li>
              <li>
                <Link className="text-[#CBD5E1] hover:text-[#F9FAFB]" href="/resources/payroll-compliance-checklist">
                  Payroll checklist
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/resources">
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
          <div>© {new Date().getFullYear()} HRSignal</div>
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
