export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

export default async function AdminVendorsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">Vendors</h1>
          <p className="mt-2 text-zinc-600">Missing <code>DATABASE_URL</code>. Connect Postgres to manage vendors.</p>
        </div>
      </div>
    );
  }

  const vendors = await prisma.vendor.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { _count: { select: { tools: true } } },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Vendors</h1>
          <a className="text-sm underline" href="/admin">
            Back
          </a>
        </div>

        <div className="mt-6 flex justify-end">
          <a className="rounded-md bg-black px-4 py-2 text-white" href="/admin/vendors/new">
            Add vendor
          </a>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-sm">
            <thead className="border-b bg-zinc-50 text-left">
              <tr>
                <th className="p-3">Vendor</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Tools</th>
                <th className="p-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="p-3">
                    <div className="font-medium">{v.name}</div>
                    <div className="text-zinc-600">{v.websiteUrl ?? "—"}</div>
                  </td>
                  <td className="p-3">{v.contactEmail ?? "—"}</td>
                  <td className="p-3">{v._count.tools}</td>
                  <td className="p-3">{v.isActive ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-zinc-600">
            Editing vendors will be added next (ICP fields + lead routing). For now, seed vendors via Admin → Seed catalog.
          </p>
        </div>
      </div>
    </div>
  );
}
