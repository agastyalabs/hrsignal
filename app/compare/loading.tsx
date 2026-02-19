import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

// Note: Do NOT render SiteHeader/SiteFooter here.
// The page itself owns global chrome; loading UI should only render the inner skeleton.
export default function Loading() {
  return (
    <main className="py-10 sm:py-14">
      <Container>
        <div className="h-8 w-48 animate-pulse rounded bg-[rgba(148,163,184,0.22)]" />
        <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-[rgba(148,163,184,0.18)]" />

        <Card className="mt-6 shadow-none">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-[rgba(2,6,23,0.35)]" />
            ))}
          </div>
        </Card>
      </Container>
    </main>
  );
}
