import { NextResponse } from "next/server";
import { BuyerSizeBand } from "@prisma/client";
import { prisma } from "@/lib/db";

type LeadPayload = {
  // Canonical fields (preferred)
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  company?: string;
  useCase?: string;
  message?: string;

  // Existing UI fields (back-compat)
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;

  submissionId?: string;
  runId?: string;
  buyerRole?: string;

  // Optional enrichment
  sizeBand?: unknown;
  states?: string[];
  categoriesNeeded?: string[];
  mustHaveIntegrations?: string[];
  budgetNote?: string;
  timelineNote?: string;

  source?: string;
  website?: string; // honeypot
  payload?: unknown;
};

const FALLBACK_NOTIFY = "nk@infira.in,pcst.ecrocks@gmail.com";

function s(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => s(x)).filter(Boolean);
}

function splitEmails(v: string) {
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function getNotifyRecipients(): string[] {
  const raw =
    s(process.env.LEAD_NOTIFY_EMAILS) ||
    s(process.env.LEAD_EMAIL_TO) ||
    FALLBACK_NOTIFY;
  const emails = splitEmails(raw);
  return emails.length ? emails : splitEmails(FALLBACK_NOTIFY);
}

function parseSizeBand(v: unknown): BuyerSizeBand | null {
  const band = s(v);
  if (!band) return null;
  if ((Object.values(BuyerSizeBand) as string[]).includes(band)) {
    return band as BuyerSizeBand;
  }
  return null;
}

async function tryResend(to: string[], subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.log("[leads] Resend not configured; skipping email.");
    return { ok: false as const, skipped: true as const };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const resp = await resend.emails.send({ from, to, subject, html });
    const id = (resp as unknown as { data?: { id?: string } })?.data?.id;
    console.log("[leads] Resend OK:", id || resp);
    return { ok: true as const };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[leads] Resend failed (non-fatal):", msg);
    return { ok: false as const, error: msg };
  }
}

export async function POST(req: Request) {
  let body: LeadPayload = {};
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON. Please retry." },
      { status: 400 }
    );
  }

  // Honeypot: treat as success (quietly)
  if (s(body.website)) {
    return NextResponse.json({ ok: true, emailSent: false }, { status: 200 });
  }

  const name = s(body.name) || s(body.contactName);
  const email = s(body.email) || s(body.contactEmail);
  const phone = s(body.phone) || s(body.contactPhone);
  const companyName = s(body.companyName) || s(body.company);
  const useCase = s(body.useCase) || s(body.message);

  // Validation: 400 only for truly invalid payloads
  if (!name && !useCase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Tell us your name or a short use-case (what you need help with).",
      },
      { status: 400 }
    );
  }

  if (!email && !phone) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please share at least one contact method (email preferred, or phone).",
      },
      { status: 400 }
    );
  }

  const recipients = getNotifyRecipients();
  const source = s(body.source) || "web";

  // 1) Store (best-effort; should never block)
  let leadId: string | undefined;
  try {
    const created = await prisma.lead.create({
      data: {
        submissionId: s(body.submissionId) || null,

        // DB currently requires these fields; use safe fallbacks.
        companyName: companyName || "Unknown",
        contactName: name || "Unknown",
        contactEmail: email || "unknown@invalid.hrsignal",
        contactPhone: phone || null,
        buyerRole: s(body.buyerRole) || null,

        sizeBand: parseSizeBand(body.sizeBand),
        states: asStringArray(body.states),
        categoriesNeeded: asStringArray(body.categoriesNeeded),
        budgetNote: s(body.budgetNote) || null,
        timelineNote: s(body.timelineNote) || useCase || null,

        // keep default status/qualification
      },
      select: { id: true },
    });
    leadId = created.id;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[leads] DB insert failed (non-fatal):", msg);
  }

  // 2) Notify (non-blocking)
  let emailSent = false;
  try {
    const subject = `HRsignal Lead (${source}) — ${name || companyName || email || phone || "New lead"}`;

    const html = `
      <h2>New Lead</h2>
      <ul>
        <li><b>Lead ID:</b> ${leadId ?? "(not stored)"}</li>
        <li><b>Source:</b> ${escapeHtml(source)}</li>
      </ul>
      <h3>Contact</h3>
      <ul>
        <li><b>Name:</b> ${escapeHtml(name || "-")}</li>
        <li><b>Company:</b> ${escapeHtml(companyName || "-")}</li>
        <li><b>Email:</b> ${escapeHtml(email || "-")}</li>
        <li><b>Phone:</b> ${escapeHtml(phone || "-")}</li>
      </ul>
      <h3>Use-case</h3>
      <pre style="white-space:pre-wrap">${escapeHtml(useCase || "-")}</pre>
      <hr />
      <details>
        <summary>Raw payload</summary>
        <pre style="white-space:pre-wrap">${escapeHtml(JSON.stringify({ ...body, payload: undefined }, null, 2))}</pre>
      </details>
    `;

    const r = await tryResend(recipients, subject, html);
    emailSent = r.ok;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[leads] Email notify failed (non-fatal):", msg);
  }

  // If DB insert succeeds → ALWAYS return 200.
  // For non-validation failures, still return 200 to keep UX friendly.
  return NextResponse.json(
    {
      ok: true,
      leadId,
      emailSent,
    },
    { status: 200 }
  );
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
