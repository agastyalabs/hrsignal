import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;
const rateMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim();
  const xr = req.headers.get("x-real-ip");
  return xr?.trim() ?? null;
}

function rateLimitOrThrow(ip: string) {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (!rec || rec.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  rec.count += 1;
  if (rec.count > RATE_MAX) {
    const err = new Error("Rate limit exceeded");
    // @ts-ignore
    err.statusCode = 429;
    throw err;
  }
}

function parseNotifyEmails() {
  const raw = process.env.LEAD_NOTIFY_EMAILS || "";
  const emails = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return Array.from(new Set(emails));
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req) ?? "unknown";
    rateLimitOrThrow(ip);

    const userAgent = req.headers.get("user-agent") ?? undefined;
    const body = await req.json().catch(() => ({}));

    // Honeypot
    if (typeof body?.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const name = typeof body?.name === "string" ? body.name.trim() : undefined;
    const email = typeof body?.email === "string" ? body.email.trim() : undefined;
    const phone = typeof body?.phone === "string" ? body.phone.trim() : undefined;
    const company = typeof body?.company === "string" ? body.company.trim() : undefined;
    const message = typeof body?.message === "string" ? body.message.trim() : undefined;
    const source = typeof body?.source === "string" ? body.source.trim() : "unknown";

    if (!email && !phone) {
      return NextResponse.json(
        { ok: false, error: "Please provide email or phone." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        message,
        source,
        payload: body,
        ip,
        userAgent,
      },
      select: { id: true, createdAt: true },
    });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM = process.env.RESEND_FROM_EMAIL;
    const notifyEmails = parseNotifyEmails();

    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
    if (!FROM) throw new Error("Missing RESEND_FROM_EMAIL");
    if (notifyEmails.length === 0) throw new Error("Missing LEAD_NOTIFY_EMAILS");

    const resend = new Resend(RESEND_API_KEY);

    const subject = `New HRsignal lead (${source}) — ${company || name || email || phone || lead.id}`;

    const text = [
      `New lead received`,
      ``,
      `Lead ID: ${lead.id}`,
      `Source: ${source}`,
      `Time: ${lead.createdAt.toISOString()}`,
      ``,
      `Name: ${name || "-"}`,
      `Company: ${company || "-"}`,
      `Email: ${email || "-"}`,
      `Phone: ${phone || "-"}`,
      ``,
      `Message:`,
      `${message || "-"}`,
      ``,
      `Raw payload:`,
      JSON.stringify(body, null, 2),
    ].join("\n");

    await resend.emails.send({
      from: FROM,
      to: notifyEmails,
      subject,
      text,
    });

    return NextResponse.json({ ok: true, id: lead.id }, { status: 200 });
  } catch (e: any) {
    const status = e?.statusCode === 429 ? 429 : 500;
    return NextResponse.json(
      { ok: false, error: status === 429 ? "Too many requests" : "Server error" },
      { status }
    );
  }
}
