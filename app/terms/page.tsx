import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <SectionHeading
          title="Terms"
          subtitle="Basic usage terms for HRSignal v1 (non-legal summary)."
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <main className="lg:col-span-8">
            <Card className="shadow-sm">
              <div className="prose prose-invert max-w-none px-6 py-6">
                <p>
                  HRSignal provides software discovery content and a recommendation experience. This is an early-stage
                  product.
                </p>

                <h2>No guarantees</h2>
                <p>
                  We aim for accurate information, but vendors change pricing and features frequently. Always validate in
                  demos and contracts.
                </p>

                <h2>Your responsibility</h2>
                <ul>
                  <li>You are responsible for decisions made using the site’s information.</li>
                  <li>Do not submit sensitive personal information you do not need to share.</li>
                </ul>

                <h2>Contact</h2>
                <p>
                  Questions? Email <a href="mailto:hello@hrsignal.in">hello@hrsignal.in</a>.
                </p>

                <p>
                  <Link href="/" className="text-indigo-300 hover:underline">
                    Back to home
                  </Link>{" "}
                  •{" "}
                  <Link href="/recommend" className="text-indigo-300 hover:underline">
                    Get recommendations
                  </Link>
                </p>
              </div>
            </Card>
          </main>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 text-sm text-[#CBD5E1] shadow-sm">
              These terms are intentionally minimal for launch. We can replace with a full legal document when needed.
            </div>
          </aside>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
