export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!process.env.DATABASE_URL) return notFound();

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
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-4xl">
        <a className="text-sm underline" href="/tools">
          Back to tools
        </a>

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

          <div className="mt-8 flex gap-3">
            <a
              className="rounded-md bg-black px-4 py-2 text-white"
              href={`/stack-builder?prefill=${encodeURIComponent(tool.slug)}`}
            >
              See if this fits my team
            </a>
            <a className="rounded-md border border-zinc-300 bg-white px-4 py-2" href="#lead">
              Request demo/pricing
            </a>
          </div>

          <div id="lead" className="mt-10 rounded-xl bg-zinc-50 p-4">
            <p className="text-sm text-zinc-700">
              Want an intro or pricing help? Use the Stack Builder—HRSignal will route you to the best-fit vendor.
            </p>
            <a className="mt-3 inline-block text-sm font-medium underline" href="/stack-builder">
              Open Stack Builder →
            </a>
          </div>
        </div>
      </div>
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
