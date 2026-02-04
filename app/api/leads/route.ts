import type { BuyerSizeBand } from "@prisma/client";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  submissionId: z.string().min(1),
  runId: z.string().min(1).optional(),
  companyName: z.string().min(1).optional().nullable(),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional().nullable(),
  buyerRole: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Lead capture not configured (missing DATABASE_URL)." },
      { status: 503 }
    );
  }
  const input = Schema.parse(await req.json());

  const submission = await prisma.questionnaireSubmission.findUnique({
    where: { id: input.submissionId },
  });
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const qualification = qualify(submission);
  const assignedVendor = await pickBestVendor(submission);

  const lead = await prisma.lead.create({
    data: {
      submissionId: submission.id,
      companyName: input.companyName ?? submission.companyName ?? "Unknown",
      contactName: input.contactName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone ?? null,
      buyerRole: input.buyerRole ?? submission.buyerRole,
      sizeBand: submission.sizeBand,
      states: submission.states,
      categoriesNeeded: submission.categoriesNeeded,
      budgetNote: submission.budgetNote,
      timelineNote: submission.timelineNote,
      qualification,
      status: assignedVendor ? "ASSIGNED" : "NEW",
      assignedVendorId: assignedVendor?.id ?? null,
      assignedAt: assignedVendor ? new Date() : null,
      nextActionAt: assignedVendor ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
      assignments: assignedVendor
        ? {
            create: {
              vendorId: assignedVendor.id,
              note: "Auto-assigned best-fit vendor. Queued for internal review.",
            },
          }
        : undefined,
    },
  });

  return NextResponse.json({ leadId: lead.id, assignedVendor: assignedVendor?.name ?? null });
}

function qualify(submission: {
  timelineNote: string | null;
  budgetNote: string | null;
  sizeBand: BuyerSizeBand | null;
  categoriesNeeded: string[];
}) {
  let score = 0;
  if (submission.timelineNote && /(0-2|1\s*month|30\s*days|2\s*weeks)/i.test(submission.timelineNote)) score += 3;
  if (submission.budgetNote) score += 2;
  if (submission.sizeBand) score += 2;
  if (submission.categoriesNeeded.length >= 3) score += 1;

  if (score >= 7) return "hot";
  if (score >= 4) return "warm";
  return "cold";
}

async function pickBestVendor(submission: {
  categoriesNeeded: string[];
  sizeBand: BuyerSizeBand | null;
  states: string[];
}) {
  const vendors = await prisma.vendor.findMany({
    where: { isActive: true },
    include: { categories: true },
    take: 200,
  });

  const needed = new Set(submission.categoriesNeeded);
  const stateSet = new Set(submission.states.map((s) => s.toLowerCase()));

  const scored = vendors
    .map((v) => {
      let s = 0;
      const vendorCats = new Set(v.categories.map((c) => c.slug));
      for (const c of needed) if (vendorCats.has(c)) s += 3;
      if (!v.supportedSizeBands.length || (submission.sizeBand && v.supportedSizeBands.includes(submission.sizeBand))) s += 2;
      if (!v.supportedStates.length) s += 1;
      else {
        const overlap = v.supportedStates.filter((st) => stateSet.has(st.toLowerCase())).length;
        s += Math.min(2, overlap);
      }
      return { v, s };
    })
    .sort((a, b) => b.s - a.s);

  return scored[0]?.s ? scored[0].v : null;
}
