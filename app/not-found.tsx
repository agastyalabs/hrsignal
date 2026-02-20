import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />
      <main className="py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl rounded-[var(--radius-card)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-8 text-center shadow-soft sm:p-12">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-blue)]">404</div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">Page not found</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--text-muted)] sm:text-base">
              This page may have moved. You can continue with the HRSignal discovery flow from tools, vendors, or get a
              shortlist directly.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <ButtonLink href="/tools" variant="secondary" size="md" className="w-full justify-center sm:w-auto">
                Browse tools
              </ButtonLink>
              <ButtonLink href="/vendors" variant="secondary" size="md" className="w-full justify-center sm:w-auto">
                Browse vendors
              </ButtonLink>
              <ButtonLink href="/recommend" size="md" className="w-full justify-center sm:w-auto">
                Get my shortlist
              </ButtonLink>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
