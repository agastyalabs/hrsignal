import { NextResponse } from "next/server";

type Payload = {
  email?: unknown;
  companySize?: unknown;
  role?: unknown;
  sourcePage?: unknown;
};

function s(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

function isValidEmail(email: string) {
  // Simple, pragmatic validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendWithResend(args: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.log("[checklist] Resend not configured; skipping email.");
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
      to: [args.to],
      subject: args.subject,
      html: args.html,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    const msg = text.slice(0, 500) || resp.statusText || "Resend error";
    console.error("[checklist] Resend failed:", resp.status, msg);

    return { ok: false as const, statusCode: resp.status, error: msg };
  }

  return { ok: true as const };
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

  if (!sourcePage || !["homepage", "payroll-india", "scanner"].includes(sourcePage)) {
    return NextResponse.json({ ok: false, error: "Invalid source page." }, { status: 400 });
  }

  const payload = {
    email,
    companySize,
    role,
    sourcePage,
    kind: "india_payroll_risk_checklist",
    createdAtIso: new Date().toISOString(),
  };

  console.log("[checklist] lead", JSON.stringify(payload));

  const downloadUrl = "https://hrsignal.vercel.app/downloads/india-payroll-risk-checklist.pdf";

  const subject = "Your India Payroll Risk Checklist";

  const html = `
    <div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px">India Payroll Risk Checklist</h2>
      <p style="margin:0 0 12px">Thanks — here’s your checklist link.</p>
      <p style="margin:0 0 16px"><a href="${downloadUrl}">Download PDF (placeholder)</a></p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
      <p style="margin:0;color:#6b7280;font-size:12px">
        You requested this from HRSignal (${sourcePage}). No vendor spam. No paid ranking.
      </p>
    </div>
  `;

  const sent = await sendWithResend({ to: email, subject, html });

  if (!sent.ok && !sent.skipped) {
    return NextResponse.json({ ok: false, error: "Could not send email right now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, emailSent: Boolean(sent.ok) }, { status: 200 });
}
