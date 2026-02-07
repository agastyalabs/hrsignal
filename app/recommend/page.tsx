import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default function RecommendPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-xl">
            <Card className="shadow-sm">
              <h1 className="text-2xl font-semibold tracking-tight text-[#F9FAFB]">Get recommendations</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#CBD5E1]">
                Tell us a bit about your team and we’ll share a shortlist of tools that fit.
              </p>

              {searchParams?.error ? (
                <div className="mt-4 rounded-lg border border-[#1F2937] bg-[#0F172A] px-4 py-3 text-sm text-[#CBD5E1]">
                  Please check your details and try again.
                </div>
              ) : null}

              <form className="mt-5 space-y-4" action="/recommend/submit" method="post">
                <div>
                  <label className="text-sm font-medium text-[#CBD5E1]">Company name</label>
                  <input className="input mt-1" name="companyName" required placeholder="Acme Pvt Ltd" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#CBD5E1]">Work email</label>
                  <input className="input mt-1" type="email" name="buyerEmail" required placeholder="you@company.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#CBD5E1]">Role (optional)</label>
                  <input className="input mt-1" name="buyerRole" placeholder="Founder / HR / Ops" />
                </div>

                <button className="h-11 w-full rounded-lg bg-[#8B5CF6] px-4 text-sm font-medium text-[#0B1220] hover:bg-[#7C3AED]">
                  Continue
                </button>

                <p className="text-center text-xs leading-relaxed text-[#94A3B8]">
                  Privacy-first: we don’t share your details without consent.
                </p>
              </form>
            </Card>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
