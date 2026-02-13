import Link from "next/link";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />

      <Section className="pt-10 sm:pt-14">
        <h1 className="sr-only">Privacy</h1>
        <SectionHeading
          title="Privacy"
          subtitle="A simple, plain-English privacy summary for HRSignal v1."
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <main className="lg:col-span-8">
            <Card className="shadow-sm">
              <div className="prose prose-invert max-w-none px-6 py-6">
                <p>
                  HRSignal is a discovery and recommendation experience for HR software. We aim to be privacy-first.
                </p>

                <h2>What we collect</h2>
                <ul>
                  <li>Information you submit in forms (for example: name, email, company, requirements).</li>
                  <li>Basic product usage analytics needed to run the site (error logs, performance).</li>
                </ul>

                <h2>How we use it</h2>
                <ul>
                  <li>To generate and share your shortlist and respond to demo/pricing requests.</li>
                  <li>To improve the product (fix bugs, improve recommendations).</li>
                </ul>

                <h2>What we don’t do</h2>
                <ul>
                  <li>We don’t sell your contact details.</li>
                  <li>We don’t share your details with vendors without your intent/consent.</li>
                </ul>

                <h2>Questions</h2>
                <p>
                  If you have questions, email <a href="mailto:hello@hrsignal.in">hello@hrsignal.in</a>.
                </p>

                <p>
                  <Link href="/resources" className="text-indigo-300 hover:underline">
                    Browse resources
                  </Link>{" "}
                  or{" "}
                  <Link href="/recommend" className="text-indigo-300 hover:underline">
                    get recommendations
                  </Link>.
                </p>
              </div>
            </Card>
          </main>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 text-sm text-[#CBD5E1] shadow-sm">
              This is a lightweight v1 policy page so links aren’t dead at launch. We can expand it post-launch with
              specifics (retention, processors, security).
            </div>
          </aside>
        </div>
      </Section>

      <SiteFooter />
    </div>
  );
}
