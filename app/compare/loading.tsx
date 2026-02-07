import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="py-10 sm:py-14">
        <Container>
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
          <div className="mt-3 h-4 w-96 animate-pulse rounded bg-zinc-200" />

          <Card className="mt-6 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-zinc-100" />
              ))}
            </div>
          </Card>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
