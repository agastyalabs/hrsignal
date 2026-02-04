import { NextResponse } from "next/server";

import {
  extractChatId,
  extractTelegramText,
  extractUserId,
  parseTelegramUpdate,
  type TelegramUpdate,
} from "@/lib/telegram/update";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Optional secret validation (recommended when using Telegram webhook secret token).
  // https://core.telegram.org/bots/api#setwebhook
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret) {
    const got = req.headers.get("x-telegram-bot-api-secret-token");
    if (got !== expectedSecret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });

  let update: TelegramUpdate;
  try {
    update = parseTelegramUpdate(body);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_update" }, { status: 400 });
  }

  const text = extractTelegramText(update);
  const chatId = extractChatId(update);
  const userId = extractUserId(update);

  // Debug command: /whoami
  // Replies with sender user_id + whether it matches TELEGRAM_ALLOWED_USER_ID.
  if (text.trim() === "/whoami" && chatId && userId) {
    const allowed = process.env.TELEGRAM_ALLOWED_USER_ID
      ? Number(process.env.TELEGRAM_ALLOWED_USER_ID)
      : null;
    const matches = allowed !== null && Number.isFinite(allowed) && userId === allowed;

    await sendTelegramMessage({
      chatId,
      text: `user_id=${userId}\nallowed=${allowed ?? "(not set)"}\nmatches=${matches}`,
    });

    return NextResponse.json({ ok: true });
  }

  // Forwarding hook to OpenClaw (webhook → OpenClaw gateway/agent).
  // Keep it minimal and environment-controlled; no secrets logged.
  const forwardUrl = process.env.OPENCLAW_FORWARD_URL;
  if (forwardUrl) {
    await fetch(forwardUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.OPENCLAW_FORWARD_TOKEN ? { authorization: `Bearer ${process.env.OPENCLAW_FORWARD_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        source: "telegram",
        receivedAt: new Date().toISOString(),
        chatId,
        userId,
        text,
        update,
      }),
    }).catch(() => {
      // Best-effort: Telegram expects fast 200s; we don't fail the webhook on forwarding errors.
    });
  }

  return NextResponse.json({ ok: true });
}

async function sendTelegramMessage({ chatId, text }: { chatId: number; text: string }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  }).catch(() => {
    // best-effort
  });
}
