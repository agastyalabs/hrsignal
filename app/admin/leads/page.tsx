export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

export default async function AdminLeadsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">Lead Ops</h1>
          <p className="mt-2 text-zinc-600">
            Missing <code>DATABASE_URL</code>. Connect Postgres to view and route leads.
          </p>
        </div>
      </div>
    );
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { assignedVendor: true, deliveries: true },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Lead Ops</h1>
          <a className="text-sm underline" href="/admin">
            Back
          </a>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-sm">
            <thead className="border-b bg-zinc-50 text-left">
              <tr>
                <th className="p-3">Created</th>
                <th className="p-3">Company</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Need</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned vendor</th>
                <th className="p-3">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b last:border-0">
                  <td className="p-3 whitespace-nowrap">{l.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="p-3">{l.companyName}</td>
                  <td className="p-3">
                    <div className="font-medium">{l.contactName}</div>
                    <div className="text-zinc-600">{l.contactEmail}</div>
                  </td>
                  <td className="p-3 text-zinc-700">
                    {l.categoriesNeeded.slice(0, 2).join(", ")}
                    {l.categoriesNeeded.length > 2 ? ` +${l.categoriesNeeded.length - 2}` : ""}
                  </td>
                  <td className="p-3">{l.status}</td>
                  <td className="p-3">{l.assignedVendor?.name ?? "—"}</td>
                  <td className="p-3">
                    {l.deliveries.length ? (
                      <span className="text-zinc-700">{l.deliveries[l.deliveries.length - 1]?.status}</span>
                    ) : (
                      <span className="text-zinc-500">queued</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
