export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

export default async function AdminHome() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="mt-2 text-zinc-600">
            Admin is up, but the database isn’t configured yet (missing <code>DATABASE_URL</code>).
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            Once DB is connected, you’ll see tool/vendor/lead counts and can use Lead Ops.
          </p>
        </div>
      </div>
    );
  }

  const [toolsCount, leadsCount, vendorsCount] = await Promise.all([
    prisma.tool.count(),
    prisma.lead.count(),
    prisma.vendor.count(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Tools" value={toolsCount} />
          <Stat label="Vendors" value={vendorsCount} />
          <Stat label="Leads" value={leadsCount} />
        </div>
        <div className="mt-8 flex gap-3">
          <a className="rounded-md bg-black px-4 py-2 text-white" href="/admin/leads">
            Lead Ops
          </a>
          <a className="rounded-md border border-zinc-300 bg-white px-4 py-2" href="/admin/tools">
            Tools
          </a>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <div className="text-sm text-zinc-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
