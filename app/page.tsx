import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const CATEGORIES = [
  { slug: "hrms", name: "Core HRMS" },
  { slug: "payroll", name: "Payroll + Compliance" },
  { slug: "attendance", name: "Attendance/Leave/Time" },
  { slug: "ats", name: "ATS / Hiring" },
  { slug: "performance", name: "Performance/OKR" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
        <div className="rounded-2xl bg-white p-8 shadow sm:p-10">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900">
            Find the right HR software for your business — fast.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            India-first recommendations for HRMS, payroll & compliance (PF/ESI/PT/TDS), attendance, ATS, and performance tools.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-md bg-black px-5 py-3 text-white" href="/stack-builder">
              Get recommendations (2 minutes)
            </Link>
            <Link className="rounded-md border border-zinc-300 bg-white px-5 py-3" href="/tools">
              Browse categories/tools
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/tools?category=${encodeURIComponent(c.slug)}`}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-white"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card title="India-first compliance fit">
              PF/ESI/PT-ready options with clear notes and SME realities.
            </Card>
            <Card title="Explainable recommendations">
              See “why this tool” with scoring factors — no black box.
            </Card>
            <Card title="Qualified vendor intros">
              Share your requirements once. We route to one best-fit vendor.
            </Card>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">How it works</h2>
            <ol className="mt-4 space-y-3 text-sm text-zinc-700">
              <li>
                <span className="font-medium">1) </span>Pick a category or answer a quick questionnaire
              </li>
              <li>
                <span className="font-medium">2) </span>Get 3–5 recommended tools with reasons
              </li>
              <li>
                <span className="font-medium">3) </span>Request demos/quotes — we match the right vendor
              </li>
            </ol>
          </div>
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Browse the marketplace</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Explore only the HR ecosystem: HRMS, payroll, attendance, ATS, performance.
            </p>
            <div className="mt-4 flex gap-3">
              <Link className="rounded-md bg-black px-4 py-2 text-white" href="/tools">
                Browse tools
              </Link>
              <Link className="rounded-md border border-zinc-300 bg-white px-4 py-2" href="/vendors">
                Browse vendors
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="text-base font-semibold text-zinc-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-zinc-600">{children}</div>
    </div>
  );
}
