import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";

import { RecommendTabs } from "./RecommendTabs";

export const dynamic = "force-dynamic";

export default function RecommendPage() {
  return (
    <div className="min-h-screen bg-[#0B0E23]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-[#F9FAFB]">Get recommendations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#CBD5E1]">
              Answer a few questions. HRSignal recommends 3–5 best‑fit tools with clear match reasons.
            </p>

            <div className="mt-6">
              <RecommendTabs />
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
