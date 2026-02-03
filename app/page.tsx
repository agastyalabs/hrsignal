import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <div className="text-lg font-semibold">HRSignal</div>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-zinc-700 hover:underline" href="/tools">
            Browse tools
          </Link>
          <Link className="rounded-full bg-black px-4 py-2 text-white" href="/stack-builder">
            Build my HR stack
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16 pt-10">
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900">
          Build your HR stack for India—HRMS, payroll, hiring &amp; more—picked to fit your team.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
          HRSignal is an India-first HR software marketplace for SMEs/MSMEs. Tell us about your team, locations, budget and integrations—
          we’ll shortlist the best-fit tools and help you buy faster.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="rounded-md bg-black px-5 py-3 text-white" href="/stack-builder">
            Get recommendations
          </Link>
          <Link className="rounded-md border border-zinc-300 bg-white px-5 py-3" href="/tools">
            Browse the marketplace
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="India-first realities">
            Compliance readiness, multi-state ops, implementation timelines, and India support quality.
          </Card>
          <Card title="Fit-based shortlists">
            Not generic lists—recommendations based on team size, workforce mix, budget, and integrations.
          </Card>
          <Card title="Qualified vendor intros">
            When you’re ready, we route your requirement to one best-fit vendor (reviewed internally first).
          </Card>
        </div>

        <div className="mt-14 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">What categories are covered?</h2>
          <p className="mt-2 text-zinc-600">
            HRMS, Payroll &amp; Compliance, ATS, BGV, Performance, Engagement, LMS, and Attendance.
          </p>
          <div className="mt-4">
            <Link className="text-sm font-medium underline" href="/stack-builder">
              Start Stack Builder →
            </Link>
          </div>
        </div>
      </main>
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
