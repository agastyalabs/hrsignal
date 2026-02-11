import { NextResponse } from "next/server";

type Payload = {
  email?: unknown;
  name?: unknown;
  companySize?: unknown;
  role?: unknown;
  source?: unknown;
  tool?: unknown;
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

async function sendWithResend(args: { to: string[]; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.log("[leads/submit] Resend not configured; skipping email.");
    return { ok: false as const, skipped: true as const };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const msg = text.slice(0, 500) || resp.statusText || "Resend error";

    // Treat as non-fatal for capture; caller can decide.
    console.error("[leads/submit] Resend failed:", resp.status, msg);
    return { ok: false as const, statusCode: resp.status, error: msg };
  }

  return { ok: true as const };
}

function baseEmailShell(args: { title: string; bodyHtml: string; footerHtml?: string }) {
  return `
    <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px">${args.title}</h2>
      ${args.bodyHtml}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
      <p style="margin:0;color:#6b7280;font-size:12px">
        HRSignal is privacy-first. We don’t share your details without consent.
      </p>
      ${args.footerHtml ?? ""}
    </div>
  `;
}

export async function POST(req: Request) {
  let body: Payload = {};
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const email = s(body.email);
  const name = s(body.name);
  const companySize = s(body.companySize);
  const role = s(body.role);
  const source = s(body.source);
  const tool = s(body.tool);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid work email." }, { status: 400 });
  }

  if (!source) {
    return NextResponse.json({ ok: false, error: "Missing source." }, { status: 400 });
  }

  const payload = {
    email,
    name: name || undefined,
    companySize: companySize || undefined,
    role: role || undefined,
    source,
    tool: tool || undefined,
    createdAtIso: new Date().toISOString(),
  };

  console.log("[leads/submit] lead", JSON.stringify(payload));

  // 1) Internal notification (best-effort)
  const notifyTo = getNotifyRecipients();
  const internalSubject = `HRSignal lead (${source}) — ${name || email}`;
  const internalHtml = baseEmailShell({
    title: "New lead",
    bodyHtml: `
      <p style="margin:0 0 12px">A new lead was submitted.</p>
      <table style="border-collapse:collapse;font-size:13px">
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Email</td><td style="padding:4px 0">${email}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Name</td><td style="padding:4px 0">${name || "—"}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Role</td><td style="padding:4px 0">${role || "—"}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Company size</td><td style="padding:4px 0">${companySize || "—"}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Source</td><td style="padding:4px 0">${source}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Tool</td><td style="padding:4px 0">${tool || "—"}</td></tr>
      </table>
    `,
  });

  await sendWithResend({ to: notifyTo, subject: internalSubject, html: internalHtml }).catch(() => null);

  // 2) Buyer-facing email (best-effort)
  const downloadUrl = "https://hrsignal.vercel.app/downloads/india-payroll-risk-checklist.pdf";
  const buyerSubject = tool === "india_payroll_risk_checklist" ? "Your India Payroll Risk Checklist" : "Your HRSignal request";

  const buyerBody =
    tool === "india_payroll_risk_checklist"
      ? `<p style="margin:0 0 12px">Thanks — here’s your checklist link.</p>
         <p style="margin:0 0 16px"><a href="${downloadUrl}">Download PDF (placeholder)</a></p>
         <p style="margin:0;color:#6b7280;font-size:12px">Requested from: ${source}</p>`
      : `<p style="margin:0 0 12px">Thanks — we’ve received your request.</p>
         <p style="margin:0 0 16px">If you want a deterministic shortlist, you can start here: <a href="https://hrsignal.vercel.app/recommend">Get a shortlist</a></p>
         <p style="margin:0;color:#6b7280;font-size:12px">Source: ${source}</p>`;

  const buyerHtml = baseEmailShell({ title: buyerSubject, bodyHtml: buyerBody });

  const buyerSent = await sendWithResend({ to: [email], subject: buyerSubject, html: buyerHtml }).catch(() => ({ ok: false as const }));

  return NextResponse.json(
    { ok: true, emailSent: Boolean((buyerSent as { ok?: boolean }).ok) },
    { status: 200 },
  );
}
