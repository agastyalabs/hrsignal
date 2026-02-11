import { NextResponse } from "next/server";

type Payload = {
  email?: unknown;
  companySize?: unknown;
  role?: unknown;
  sourcePage?: unknown;
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
    return { ok: false as const, statusCode: 500, error: "Resend not configured." };
  }

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from, to: args.to, subject: args.subject, html: args.html }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const msg = text.slice(0, 500) || resp.statusText || "Resend error";
    return { ok: false as const, statusCode: resp.status, error: msg };
  }

  return { ok: true as const };
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

export async function POST(req: Request) {
  let body: Payload = {};
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const email = s(body.email);
  const companySize = s(body.companySize);
  const role = s(body.role);
  const sourcePage = s(body.sourcePage);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid work email." }, { status: 400 });
  }
  if (!companySize) {
    return NextResponse.json({ ok: false, error: "Please select a company size." }, { status: 400 });
  }
  if (!role) {
    return NextResponse.json({ ok: false, error: "Please select your role." }, { status: 400 });
  }
  if (!sourcePage) {
    return NextResponse.json({ ok: false, error: "Missing sourcePage." }, { status: 400 });
  }

  const origin = originFrom(req);
  const downloadUrl = `${origin}/downloads/india-payroll-risk-checklist.pdf`;

  const lead = {
    email,
    companySize,
    role,
    sourcePage,
    kind: "india_payroll_risk_checklist",
    createdAtIso: new Date().toISOString(),
  };

  console.log("[checklist] lead", JSON.stringify(lead));

  // (a) Buyer email
  const buyerSubject = "Your HRSignal Payroll Risk Checklist";
  const buyerHtml = shell(
    "India Payroll Risk Checklist",
    `
      <p style="margin:0 0 12px">Thanks — here’s your download link:</p>
      <p style="margin:0 0 16px"><a href="${downloadUrl}">${downloadUrl}</a></p>
      <p style="margin:0;color:#6b7280;font-size:12px">If the link doesn’t open, copy-paste it into your browser.</p>
    `,
  );

  const buyer = await sendWithResend({ to: [email], subject: buyerSubject, html: buyerHtml });
  if (!buyer.ok) {
    return NextResponse.json(
      { ok: false, error: buyer.error || "Failed to send email." },
      { status: 500 },
    );
  }

  // (b) Internal email
  const internalTo = getNotifyRecipients();
  const internalSubject = `Checklist lead (${sourcePage}) — ${email}`;
  const internalHtml = shell(
    "New checklist lead",
    `
      <p style="margin:0 0 12px">A checklist lead was submitted.</p>
      <table style="border-collapse:collapse;font-size:13px">
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Email</td><td style="padding:4px 0">${email}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Company size</td><td style="padding:4px 0">${companySize}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Role</td><td style="padding:4px 0">${role}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Source page</td><td style="padding:4px 0">${sourcePage}</td></tr>
        <tr><td style="padding:4px 10px 4px 0;color:#6b7280">Download</td><td style="padding:4px 0">${downloadUrl}</td></tr>
      </table>
    `,
  );

  const internal = await sendWithResend({ to: internalTo, subject: internalSubject, html: internalHtml });
  if (!internal.ok) {
    return NextResponse.json(
      { ok: false, error: internal.error || "Failed to send internal notification." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, emailSent: true, downloadUrl }, { status: 200 });
}
