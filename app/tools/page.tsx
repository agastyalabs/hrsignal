export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

type ToolCard = {
  slug: string;
  name: string;
  vendorName?: string;
  categories: string[];
  tagline?: string;
};

const FALLBACK_TOOLS: ToolCard[] = [
  {
    slug: "greythr",
    name: "greytHR",
    vendorName: "greytHR",
    categories: ["HRMS", "Payroll"],
    tagline: "HRMS + payroll for Indian SMEs",
  },
  {
    slug: "keka",
    name: "Keka",
    vendorName: "Keka",
    categories: ["HRMS", "Payroll", "Performance"],
    tagline: "Modern HRMS with payroll",
  },
  {
    slug: "zoho-people",
    name: "Zoho People",
    vendorName: "Zoho",
    categories: ["HRMS", "Attendance"],
    tagline: "HRMS with attendance/leave",
  },
  {
    slug: "freshteam",
    name: "Freshteam",
    vendorName: "Freshworks",
    categories: ["ATS"],
    tagline: "ATS + onboarding for SMEs",
  },
];

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category?.trim();
  const q = sp.q?.trim();

  let tools: ToolCard[] = [];
  let mode: "live" | "empty" | "fallback" = "live";

  if (!process.env.DATABASE_URL) {
    mode = "fallback";
    tools = FALLBACK_TOOLS;
  } else {
    try {
      const rows = await prisma.tool.findMany({
        where: {
          status: "PUBLISHED",
          ...(q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { tagline: { contains: q, mode: "insensitive" } },
                  { vendor: { name: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {}),
          ...(category
            ? {
                categories: {
                  some: { category: { slug: category } },
                },
              }
            : {}),
        },
        orderBy: { name: "asc" },
        include: { vendor: true, categories: { include: { category: true } } },
        take: 200,
      });
      tools = rows.map((t) => ({
        slug: t.slug,
        name: t.name,
        vendorName: t.vendor?.name ?? undefined,
        categories: t.categories.map((c) => c.category.name),
        tagline: t.tagline ?? undefined,
      }));
      if (!tools.length) mode = "empty";
    } catch {
      mode = "fallback";
      tools = FALLBACK_TOOLS;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Browse tools</h1>
            <p className="mt-1 text-sm text-zinc-600">Only HR ecosystem: HRMS, payroll, attendance, ATS, performance.</p>
          </div>
          <a className="text-sm underline" href="/stack-builder">
            Get recommendations
          </a>
        </div>

        <form className="mt-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow sm:flex-row">
          <input
            className="input"
            name="q"
            defaultValue={q}
            placeholder="Search tools (e.g., Keka, payroll, attendance)"
          />
          <select className="input" name="category" defaultValue={category ?? ""}>
            <option value="">All categories</option>
            <option value="hrms">HRMS</option>
            <option value="payroll">Payroll + Compliance</option>
            <option value="attendance">Attendance/Leave</option>
            <option value="ats">ATS/Hiring</option>
            <option value="performance">Performance/OKR</option>
          </select>
          <button className="rounded-md bg-black px-4 py-2 text-white">Search</button>
        </form>

        {mode === "empty" ? (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <p className="text-zinc-700">No tools are published yet.</p>
            <p className="mt-2 text-sm text-zinc-600">
              Next step: seed the catalog (vendors/tools/categories) and publish tools.
            </p>
            <a className="mt-3 inline-block text-sm font-medium underline" href="/admin">
              Go to Admin →
            </a>
          </div>
        ) : null}

        {mode === "fallback" ? (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <p className="text-zinc-700">Showing sample tools while the database/catalog is not connected.</p>
            <p className="mt-2 text-sm text-zinc-600">Connect DB + run migrations/seed to see the real marketplace catalog.</p>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tools.map((t) => (
            <a key={t.slug} href={`/tools/${t.slug}`} className="rounded-xl bg-white p-4 shadow hover:shadow-md">
              <div className="text-lg font-semibold">{t.name}</div>
              {t.vendorName ? <div className="mt-1 text-sm text-zinc-600">{t.vendorName}</div> : null}
              <div className="mt-3 text-sm text-zinc-700">{t.categories.join(" • ")}</div>
              {t.tagline ? <div className="mt-3 text-sm text-zinc-600">{t.tagline}</div> : null}
            </a>
          ))}
        </div>

        {mode === "empty" ? (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <p className="text-zinc-700">No tools match your search yet.</p>
            <p className="mt-2 text-sm text-zinc-600">Try removing filters, or seed/publish more tools from Admin.</p>
            <a className="mt-3 inline-block text-sm font-medium underline" href="/admin">
              Go to Admin →
            </a>
          </div>
        ) : null}

        {mode === "fallback" ? (
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
            <p className="text-zinc-700">Showing sample tools (DB/catalog unavailable).</p>
            <p className="mt-2 text-sm text-zinc-600">Connect DB + run migrations/seed for the full marketplace catalog.</p>
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <a
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-xl bg-white p-4 shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-lg font-semibold">{t.name}</div>
              {t.vendorName ? <div className="mt-1 text-sm text-zinc-600">by {t.vendorName}</div> : null}
              <div className="mt-3 text-sm text-zinc-700">{t.categories.join(" • ")}</div>
              {t.tagline ? <div className="mt-3 text-sm text-zinc-600">{t.tagline}</div> : null}
              <div className="mt-4 text-sm font-medium text-zinc-900 underline opacity-0 transition-opacity group-hover:opacity-100">
                View details →
              </div>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
