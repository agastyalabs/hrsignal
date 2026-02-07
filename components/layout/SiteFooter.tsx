import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CompareTray } from "@/components/compare/CompareTray";

export function SiteFooter() {
  return (
    <>
      <CompareTray />
      <footer className="border-t border-gray-200 bg-white">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/logos/hrsignal-mark.svg" alt="HRSignal" width={18} height={18} />
              <div className="text-base font-semibold text-gray-900">HRSignal</div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              India-first HR software discovery for SMEs — compare tools, get explainable recommendations, and request demos.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                Privacy-first
              </span>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                India-first SME fit
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Product</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/tools">
                  Tools
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/vendors">
                  Vendors
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/categories">
                  Categories
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/resources">
                  Resources
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/recommend">
                  Get recommendations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Resources</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/resources/hrms-selection-india-sme">
                  HRMS buyer guide
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/resources/payroll-compliance-checklist">
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
            <div className="text-sm font-semibold text-gray-900">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link className="text-gray-600 hover:text-gray-900" href="/terms">
                  Terms
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-gray-500">
              Privacy-first: we don’t share your details without consent.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} HRSignal</div>
          <div>
            Questions? Email{" "}
            <a className="text-gray-700 underline decoration-gray-300" href="mailto:hello@hrsignal.in">
              hello@hrsignal.in
            </a>
          </div>
        </div>
      </Container>
      </footer>
    </>
  );
}
