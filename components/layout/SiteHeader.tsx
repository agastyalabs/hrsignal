import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight text-zinc-900">
          HRSignal
        </Link>

        {/* Header search (UI-only for now; forwards to /tools query) */}
        <form action="/tools" className="hidden w-full max-w-md items-center gap-2 lg:flex">
          <input
            className="h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            name="q"
            placeholder="Search tools (e.g., payroll, attendance, Keka…)"
            aria-label="Search tools"
          />
          <button className="h-10 rounded-lg bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800">
            Search
          </button>
        </form>

        <nav className="flex shrink-0 items-center gap-1 text-sm">
          <Link className="rounded-md px-2 py-1 text-zinc-700 hover:bg-zinc-50" href="/tools">
            Tools
          </Link>
          <Link className="rounded-md px-2 py-1 text-zinc-700 hover:bg-zinc-50" href="/vendors">
            Vendors
          </Link>
          <Link className="rounded-md px-2 py-1 text-zinc-700 hover:bg-zinc-50" href="/categories">
            Categories
          </Link>
          <Link className="rounded-md px-2 py-1 text-zinc-700 hover:bg-zinc-50" href="/resources">
            Resources
          </Link>
          <div className="ml-2">
            <ButtonLink href="/recommend" variant="primary" size="sm">
              Get recommendations
            </ButtonLink>
          </div>
        </nav>
      </Container>
    </header>
  );
}
