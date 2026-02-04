import Link from "next/link";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminNewToolPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">Add tool</h1>
          <p className="mt-2 text-zinc-600">Missing <code>DATABASE_URL</code>.</p>
        </div>
      </div>
    );
  }

  const vendors = await prisma.vendor.findMany({ orderBy: { name: "asc" } });
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Add tool</h1>
          <Link className="text-sm font-medium text-indigo-700" href="/admin/tools">
            Back
          </Link>
        </div>

        <form action={createTool} className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow">
          <div>
            <label className="text-sm font-medium">Tool name</label>
            <input className="input mt-1" name="name" required />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <input className="input mt-1" name="slug" placeholder="keka" required />
            <p className="mt-1 text-xs text-zinc-500">Used in URL: /tools/&lt;slug&gt;</p>
          </div>
          <div>
            <label className="text-sm font-medium">Tagline (optional)</label>
            <input className="input mt-1" name="tagline" placeholder="HRMS + payroll for Indian SMEs" />
          </div>
          <div>
            <label className="text-sm font-medium">Vendor (optional)</label>
            <select className="input mt-1" name="vendorId" defaultValue="">
              <option value="">—</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select className="input mt-1" name="categoryId" required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input id="published" name="published" type="checkbox" defaultChecked />
            <label htmlFor="published" className="text-sm">
              Published
            </label>
          </div>

          <button className="rounded-md bg-black px-4 py-2 text-white">Create tool</button>
        </form>
      </div>
    </div>
  );
}

async function createTool(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const vendorId = String(formData.get("vendorId") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!name || !slug || !categoryId) return;

  await prisma.tool.create({
    data: {
      name,
      slug,
      tagline: tagline || null,
      vendorId: vendorId || null,
      status: published ? "PUBLISHED" : "DRAFT",
      lastVerifiedAt: published ? new Date() : null,
      categories: {
        create: [{ categoryId }],
      },
    },
  });

  redirect(`/admin/tools`);
}
