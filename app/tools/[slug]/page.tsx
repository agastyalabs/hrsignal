export const dynamic = "force-dynamic";

import Link from "next/link";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LeadSection } from "./LeadSection";

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Fallback for local/demo when DB is not connected
  if (!process.env.DATABASE_URL) {
    const fallback = {
      greythr: {
        name: "greytHR",
        tagline: "HRMS + payroll for Indian SMEs",
        vendor: "greytHR",
        categories: ["HRMS", "Payroll"],
      },
      keka: {
        name: "Keka",
        tagline: "Modern HRMS with payroll",
        vendor: "Keka",
        categories: ["HRMS", "Payroll", "Performance"],
      },
      "zoho-people": {
        name: "Zoho People",
        tagline: "HRMS with attendance/leave",
        vendor: "Zoho",
        categories: ["HRMS", "Attendance"],
      },
      freshteam: {
        name: "Freshteam",
        tagline: "ATS + onboarding for SMEs",
        vendor: "Freshworks",
        categories: ["ATS"],
      },
    } as const;

    const f = fallback[slug as keyof typeof fallback];
    if (!f) return notFound();

    return (
      <div className="min-h-screen bg-zinc-50">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-6 py-10">
          <Link className="text-sm font-medium text-indigo-700" href="/tools">
            Back to tools
          </Link>
          <div className="mt-4 rounded-xl bg-white p-6 shadow">
            <h1 className="text-2xl font-semibold">{f.name}</h1>
            <p className="mt-1 text-sm text-zinc-600">by {f.vendor}</p>
            <p className="mt-4 text-zinc-700">{f.tagline}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info title="Categories" value={f.categories.join(", ")} />
              <Info title="Integrations" value="—" />
            </div>
            <div className="mt-8 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
              Demo data shown (DB not connected). Connect DB + seed catalog for full details.
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const tool = await prisma.tool.findUnique({
    where: { slug },
    include: {
      vendor: true,
      categories: { include: { category: true } },
      integrations: { include: { integration: true } },
      pricingPlans: true,
    },
  });

  if (!tool || tool.status !== "PUBLISHED") return notFound();

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Link className="text-sm font-medium text-indigo-700" href="/tools">
          Back to tools
        </Link>

        <div className="mt-4 rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">{tool.name}</h1>
          {tool.vendor?.name ? <p className="mt-1 text-sm text-zinc-600">by {tool.vendor.name}</p> : null}
          {tool.tagline ? <p className="mt-4 text-zinc-700">{tool.tagline}</p> : null}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Info title="Categories" value={tool.categories.map((c) => c.category.name).join(", ") || "—"} />
            <Info
              title="Integrations"
              value={tool.integrations.map((i) => i.integration.name).join(", ") || "—"}
            />
          </div>

          {tool.pricingPlans.length ? (
            <div className="mt-6">
              <h2 className="text-lg font-semibold">Pricing</h2>
              <ul className="mt-2 space-y-2 text-sm">
                {tool.pricingPlans.map((p) => (
                  <li key={p.id} className="rounded-lg border border-zinc-200 p-3">
                    <div className="font-medium">{p.name}</div>
                    {p.priceNote ? <div className="text-zinc-700">{p.priceNote}</div> : null}
                    {p.setupFeeNote ? <div className="text-zinc-600">Setup: {p.setupFeeNote}</div> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-md bg-black px-4 py-2 text-white"
              href={`/recommend?prefill=${encodeURIComponent(tool.slug)}`}
            >
              See if this fits my team
            </Link>
            <Link className="rounded-md border border-zinc-300 bg-white px-4 py-2" href={`/tools/${tool.slug}#lead`}>
              Request demo/pricing
            </Link>
          </div>

          <LeadSection>
            <div className="mt-10 rounded-xl bg-zinc-50 p-4">
            <p className="text-sm text-zinc-700">
              Want an intro or pricing help? Use the Stack Builder—HRSignal will route you to the best-fit vendor.
            </p>
            <Link className="mt-3 inline-block text-sm font-medium text-indigo-700" href="/recommend">
              Open recommendations →
            </Link>
            </div>
          </LeadSection>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-sm font-medium text-zinc-800">{title}</div>
      <div className="mt-1 text-sm text-zinc-600">{value}</div>
    </div>
  );
}
