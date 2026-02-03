import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AdminNewLeadPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-zinc-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-semibold">Add lead</h1>
          <p className="mt-2 text-zinc-600">Missing <code>DATABASE_URL</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Add lead</h1>
          <a className="text-sm underline" href="/admin/leads">
            Back
          </a>
        </div>

        <form action={createLead} className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow">
          <div>
            <label className="text-sm font-medium">Company</label>
            <input className="input mt-1" name="companyName" required />
          </div>
          <div>
            <label className="text-sm font-medium">Contact name</label>
            <input className="input mt-1" name="contactName" required />
          </div>
          <div>
            <label className="text-sm font-medium">Contact email</label>
            <input className="input mt-1" name="contactEmail" type="email" required />
          </div>
          <div>
            <label className="text-sm font-medium">Phone (optional)</label>
            <input className="input mt-1" name="contactPhone" />
          </div>
          <div>
            <label className="text-sm font-medium">Requirement notes (optional)</label>
            <input className="input mt-1" name="notes" placeholder="e.g., HRMS + payroll, go-live in 30 days" />
          </div>

          <button className="rounded-md bg-black px-4 py-2 text-white">Create lead</button>
        </form>
      </div>
    </div>
  );
}

async function createLead(formData: FormData) {
  "use server";

  const companyName = String(formData.get("companyName") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!companyName || !contactName || !contactEmail) return;

  await prisma.lead.create({
    data: {
      companyName,
      contactName,
      contactEmail,
      contactPhone: contactPhone || null,
      buyerRole: null,
      budgetNote: notes || null,
      timelineNote: null,
      qualification: "warm",
      status: "NEW",
    },
  });

  redirect("/admin/leads");
}
