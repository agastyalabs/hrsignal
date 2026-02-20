import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ success: false, error: "Database not configured." }, { status: 500 });
  }

  let body: { toolId?: unknown } = {};
  try {
    body = (await req.json()) as { toolId?: unknown };
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const toolId = typeof body.toolId === "string" ? body.toolId.trim() : "";
  if (!toolId) {
    return NextResponse.json({ success: false, error: "Missing toolId." }, { status: 400 });
  }

  try {
    const updated = await prisma.tool.update({
      where: { id: toolId },
      data: {
        upvotes: { increment: 1 },
        upvotesWeek: { increment: 1 },
      },
      select: { id: true, upvotes: true, upvotesWeek: true },
    });

    return NextResponse.json({ success: true, tool: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Could not upvote." }, { status: 500 });
  }
}
