import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type LeadType = "shortlist" | "checklist" | "report" | "generic";

type Payload = {
  type?: unknown;
  email?: unknown;
  metadata?: unknown;

  // legacy (ignored but tolerated)
  website?: unknown;
};

const FALLBACK_NOTIFY = "nk@infira.in,pcst.ecrocks@gmail.com";
const ALLOWED_NOTIFY = new Set(["nk@infira.in", "pcst.ecrocks@gmail.com"]);

function s(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function splitEmails(v: string) {
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function getNotifyRecipients(): string[] {
  const raw = s(process.env.LEAD_NOTIFY_EMAILS) || s(process.env.LEAD_EMAIL_TO) || "";
  const requested = splitEmails(raw);

  // Safety: recipients must be exactly the two intended inboxes.
  const filtered = requested.filter((e) => ALLOWED_NOTIFY.has(e));
  if (filtered.length) return filtered;

  return splitEmails(FALLBACK_NOTIFY);
}

function originFrom(req: Request): string {
  const env = s(process.env.NEXT_PUBLIC_SITE_URL);
  if (env) return env.replace(/\/+$/, "");
  try {
    const u = new URL(req.url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "https://hrsignal.vercel.app";
  }
}

function shell(title: string, bodyHtml: string) {
  return `
    <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px">${title}</h2>
      ${bodyHtml}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
      <p style="margin:0;color:#6b7280;font-size:12px">HRSignal is privacy-first. We don’t share your details without consent.</p>
    </div>
  `;
}

async function tryResend(args: { to: string[]; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.log("[leads] Resend not configured; skipping email.");
    return { ok: false as const, skipped: true as const };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from, to: args.to, subject: args.subject, html: args.html }),
  }).catch((e: unknown) => {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[leads] Resend request failed:", msg);
    return null;
  });

  if (!resp) return { ok: false as const, error: "fetch_failed" };

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const msg = text.slice(0, 500) || resp.statusText || "Resend error";
    console.error("[leads] Resend failed:", resp.status, msg);
    return { ok: false as const, statusCode: resp.status, error: msg };
  }

  return { ok: true as const };
}

export async function POST(req: Request) {
  let body: Payload = {};
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot (legacy): treat as success quietly.
  if (s(body.website)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const typeRaw = s(body.type);
  const type: LeadType =
    typeRaw === "shortlist" || typeRaw === "checklist" || typeRaw === "report" || typeRaw === "generic"
      ? (typeRaw as LeadType)
      : "generic";

  const email = s(body.email);
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid work email." }, { status: 400 });
  }

  const metadata = (body.metadata && typeof body.metadata === "object" ? body.metadata : {}) as Record<string, unknown>;

  // 1) DB insert ALWAYS first.
  // Lead schema requires companyName/contactName/contactEmail.
  let leadId: string;
  try {
    const created = await prisma.lead.create({
      data: {
        companyName: s(metadata.companyName) || s(metadata.company) || "Unknown",
        contactName: s(metadata.name) || "Unknown",
        contactEmail: email,
        contactPhone: s(metadata.phone) || null,
        buyerRole: s(metadata.role) || null,

        // Store structured data in timelineNote for now (no JSON column yet).
        timelineNote: JSON.stringify({ type, metadata }, null, 2).slice(0, 6000),

        // Keep submissionId optional if provided.
        submissionId: s(metadata.submissionId) || null,
      },
      select: { id: true },
    });
    leadId = created.id;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[leads] DB insert failed:", msg);
    return NextResponse.json({ success: false, error: "Could not save your request. Please retry." }, { status: 500 });
  }

  // 2) Resend (best-effort; never fail the request)
  const origin = originFrom(req);
  const internalTo = getNotifyRecipients();

  try {
    const internalSubject = `HRSignal lead (${type}) — ${email}`;
    const internalHtml = shell(
      "New lead",
      `
        <p style="margin:0 0 12px">A new lead was submitted.</p>
        <table style="border-collapse:collapse;font-size:13px">
          <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Lead ID</td><td style="padding:4px 0">${leadId}</td></tr>
          <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Type</td><td style="padding:4px 0">${type}</td></tr>
          <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Email</td><td style="padding:4px 0">${email}</td></tr>
          <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Metadata</td><td style="padding:4px 0"><pre style="margin:0;white-space:pre-wrap">${escapeHtml(
            JSON.stringify(metadata, null, 2).slice(0, 5000)
          )}</pre></td></tr>
        </table>
      `,
    );

    await tryResend({ to: internalTo, subject: internalSubject, html: internalHtml });

    if (type === "checklist") {
      const downloadUrl = `${origin}/downloads/india-payroll-risk-checklist.pdf`;
      const buyerSubject = "Your HRSignal Payroll Risk Checklist";
      const buyerHtml = shell(
        "India Payroll Risk Checklist",
        `
          <p style="margin:0 0 12px">Thanks — here’s your download link:</p>
          <p style="margin:0 0 16px"><a href="${downloadUrl}">${downloadUrl}</a></p>
          <p style="margin:0;color:#6b7280;font-size:12px">If the link doesn’t open, copy-paste it into your browser.</p>
        `,
      );

      await tryResend({ to: [email], subject: buyerSubject, html: buyerHtml });
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[leads] Email send failed (non-fatal):", msg);
  }

  return NextResponse.json({ success: true, leadId }, { status: 200 });
}

function escapeHtml(input: string) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
