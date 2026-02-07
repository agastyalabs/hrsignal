import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { CompareTray } from "@/components/compare/CompareTray";

export function SiteFooter() {
  return (
    <>
      <CompareTray />
      <footer className="border-t border-zinc-200 bg-white">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-base font-semibold text-zinc-900">HRSignal</div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              India-first HR software discovery for SMEs — compare tools, get explainable recommendations, and request demos.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                Privacy-first
              </span>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                India-first SME fit
              </span>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Product</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/tools">
                  Tools
                </Link>
              </li>
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/vendors">
                  Vendors
                </Link>
              </li>
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/categories">
                  Categories
                </Link>
              </li>
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/recommend">
                  Get recommendations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Resources</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/resources">
                  Buyer guides
                </Link>
              </li>
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/resources">
                  Checklists
                </Link>
              </li>
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/resources">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-zinc-900">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link className="text-zinc-600 hover:text-zinc-900" href="/terms">
                  Terms
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-5 text-zinc-500">
              Privacy-first: we don’t share your details without consent.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} HRSignal</div>
          <div>
            Questions? Email{" "}
            <a className="text-zinc-700 underline" href="mailto:hello@hrsignal.in">
              hello@hrsignal.in
            </a>
          </div>
        </div>
      </Container>
      </footer>
    </>
  );
}
