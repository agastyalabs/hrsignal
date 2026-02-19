import { NextResponse } from "next/server";
import { missionControlAllowed } from "@/lib/internal/missionControl";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!missionControlAllowed(req)) return new NextResponse("Not Found", { status: 404 });
  return NextResponse.json({ ok: true, env: process.env.NODE_ENV });
}
