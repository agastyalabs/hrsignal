import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
          HRSignal
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link className="rounded-md px-2 py-1 text-zinc-700 hover:bg-zinc-50" href="/tools">
            Tools
          </Link>
          <Link className="rounded-md px-2 py-1 text-zinc-700 hover:bg-zinc-50" href="/vendors">
            Vendors
          </Link>
          <ButtonLink href="/stack-builder" variant="primary" size="sm">
            Get recommendations
          </ButtonLink>
        </nav>
      </Container>
    </header>
  );
}
