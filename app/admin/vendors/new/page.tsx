import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminNewVendorPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Add vendor</h1>
          <a className="text-sm underline" href="/admin/vendors">
            Back
          </a>
        </div>

        <form action={createVendor} className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow">
          <div>
            <label className="text-sm font-medium">Vendor name</label>
            <input className="input mt-1" name="name" required />
          </div>
          <div>
            <label className="text-sm font-medium">Website URL (optional)</label>
            <input className="input mt-1" name="websiteUrl" placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium">Contact email (optional)</label>
            <input className="input mt-1" name="contactEmail" type="email" placeholder="sales@vendor.com" />
          </div>

          <button className="rounded-md bg-black px-4 py-2 text-white">Create vendor</button>
        </form>
      </div>
    </div>
  );
}

async function createVendor(formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const websiteUrlRaw = String(formData.get("websiteUrl") ?? "").trim();
  const contactEmailRaw = String(formData.get("contactEmail") ?? "").trim();

  if (!name) return;

  await prisma.vendor.create({
    data: {
      name,
      websiteUrl: websiteUrlRaw || null,
      contactEmail: contactEmailRaw || null,
      isActive: true,
    },
  });

  redirect("/admin/vendors");
}
