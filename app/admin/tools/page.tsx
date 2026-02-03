export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";

export default async function AdminToolsPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">Tools</h1>
          <p className="mt-2 text-zinc-600">
            Missing <code>DATABASE_URL</code>. Connect Postgres to manage the catalog.
          </p>
        </div>
      </div>
    );
  }

  const tools = await prisma.tool.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { vendor: true, categories: { include: { category: true } } },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Tools</h1>
          <a className="text-sm underline" href="/admin">
            Back
          </a>
        </div>

        <div className="mt-6 flex justify-end">
          <a className="rounded-md bg-black px-4 py-2 text-white" href="/admin/tools/new">
            Add tool
          </a>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full text-sm">
            <thead className="border-b bg-zinc-50 text-left">
              <tr>
                <th className="p-3">Tool</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Categories</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last verified</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="p-3">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-zinc-600">/{t.slug}</div>
                  </td>
                  <td className="p-3">{t.vendor?.name ?? "—"}</td>
                  <td className="p-3 text-zinc-700">
                    {t.categories.map((c) => c.category.name).join(", ") || "—"}
                  </td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3">{t.lastVerifiedAt ? t.lastVerifiedAt.toISOString().slice(0, 10) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
