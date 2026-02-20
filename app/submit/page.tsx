export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

async function submitTool(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !website || !category || !email) {
    return;
  }

  await prisma.pendingTool.create({
    data: {
      name,
      website,
      category,
      email,
      notes: notes || null,
    },
  });
}

export default function SubmitToolPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-main)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 py-10">
        <div className="mb-6">
          <Link className="text-sm font-semibold text-[var(--link)] hover:text-[var(--link-hover)]" href="/tools">
            ← Back to tools
          </Link>
        </div>

        <section className="radius-card border border-slate-200 bg-white p-8 shadow-soft">
          <div className="inline-flex items-center gap-2 radius-pill bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-700">
            Founder submission
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">
            Submit a tool for India-first verification
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Stealth mode: we’re curating a tight directory. If it’s useful for Indian HR teams, we’ll review and list it.
          </p>

          <form action={submitTool} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-slate-900">Tool name</label>
              <input className="input mt-2" name="name" placeholder="e.g., Keka" required />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900">Website</label>
              <input className="input mt-2" name="website" placeholder="https://" required />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-900">Primary category</label>
                <select className="input mt-2" name="category" required defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="HRMS">HRMS</option>
                  <option value="Payroll">Payroll</option>
                  <option value="Compliance">Compliance</option>
                  <option value="ATS">ATS</option>
                  <option value="Performance">Performance</option>
                  <option value="Engagement">Engagement</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">Work email</label>
                <input className="input mt-2" type="email" name="email" placeholder="you@company.com" required />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-900">Notes (optional)</label>
              <textarea
                className="input mt-2"
                name="notes"
                rows={5}
                placeholder="What’s unique? Target segment? Pricing model? India compliance support?"
              />
            </div>

            <button
              type="submit"
              className="h-11 w-full radius-pill bg-[var(--primary-blue)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              Submit for review
            </button>

            <p className="text-center text-xs text-slate-500">We’ll only use your email to follow up about this submission.</p>
          </form>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
