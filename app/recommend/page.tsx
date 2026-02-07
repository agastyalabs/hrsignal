import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

import RecommendClient from "./recommend-client";

export const dynamic = "force-dynamic";

export default function RecommendPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-start">
            {/* Server-rendered first step (works without JS) */}
            <div className="lg:col-span-5">
              <Card className="shadow-sm">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Get recommendations</h1>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Start here. If JavaScript is available, you’ll get a guided multi-step form.
                </p>

                {searchParams?.error ? (
                  <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    Please check your details and try again.
                  </div>
                ) : null}

                <form className="mt-5 space-y-4" action="/recommend/submit" method="post">
                  <div>
                    <label className="text-sm font-medium text-zinc-800">Company name</label>
                    <input className="input mt-1" name="companyName" required placeholder="Acme Pvt Ltd" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-800">Work email</label>
                    <input className="input mt-1" type="email" name="buyerEmail" required placeholder="you@company.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-zinc-800">Role (optional)</label>
                    <input className="input mt-1" name="buyerRole" placeholder="Founder / HR / Ops" />
                  </div>
                  <button className="h-10 w-full rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700">
                    Continue
                  </button>
                  <p className="text-center text-xs leading-5 text-zinc-500">
                    Privacy-first: we don’t share your details without consent.
                  </p>
                </form>
              </Card>
            </div>

            {/* Client enhancement */}
            <div className="lg:col-span-7">
              <RecommendClient />
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
