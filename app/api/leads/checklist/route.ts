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

export async function POST(req: Request) {
  // Back-compat shim: proxy checklist capture to the unified endpoint.
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

  const resp = await fetch(new URL("/api/leads/submit", req.url), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email,
      companySize,
      role,
      source: `checklist:${sourcePage || "unknown"}`,
      tool: "india_payroll_risk_checklist",
    }),
  }).catch(() => null);

  const data = await resp?.json().catch(() => null);
  if (!resp?.ok) {
    return NextResponse.json(data ?? { ok: false, error: "Something went wrong." }, { status: resp?.status || 500 });
  }

  return NextResponse.json(data ?? { ok: true }, { status: 200 });
}
