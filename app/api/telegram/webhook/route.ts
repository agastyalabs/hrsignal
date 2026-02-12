import { NextResponse } from "next/server";

import {
  extractChatId,
  extractTelegramText,
  extractUserId,
  parseAgentAndTask,
  parseTelegramUpdate,
  type TelegramUpdate,
} from "@/lib/telegram/update";

export const runtime = "nodejs";

const DEFAULT_AGENT = "senior-dev";
const INFRA_AGENT = "devops";

// Best-effort memory: persists only within a warm runtime.
// Safe behavior: if missing, we fall back to agent inference.
const lastAgentByChat = new Map<number, { agent: string; atMs: number }>();

function rememberLastAgent(chatId: number, agent: string) {
  // TTL to avoid stale routing across long gaps.
  const now = Date.now();
  lastAgentByChat.set(chatId, { agent, atMs: now });

  // Opportunistic cleanup.
  if (lastAgentByChat.size > 200) {
    for (const [k, v] of lastAgentByChat.entries()) {
      if (now - v.atMs > 1000 * 60 * 60 * 24) lastAgentByChat.delete(k);
    }
  }
}

function getRememberedAgent(chatId: number): string | null {
  const v = lastAgentByChat.get(chatId);
  if (!v) return null;
  if (Date.now() - v.atMs > 1000 * 60 * 60 * 24) {
    lastAgentByChat.delete(chatId);
    return null;
  }
  return v.agent;
}

function helpText() {
  return [
    "HRSignal bot:",
    "- Type normally (plain English).",
    "- '@agent' is optional.",
    "- Examples:",
    "  - Fix PDF download link on the checklist email",
    "  - @devops check Vercel env vars",
    "Commands:",
    "- /whoami",
    "- /help",
  ].join("\n");
}

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

  // Help commands
  if ((text.trim() === "/start" || text.trim() === "/help") && chatId) {
    await sendTelegramMessage({ chatId, text: helpText() });
    return NextResponse.json({ ok: true });
  }

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
    // 1) Parse @agent prefix when present.
    // 2) If absent, route to DEFAULT_AGENT, or INFRA_AGENT for infra-related messages.
    // 3) Optional: remember last agent per chat.

    const remembered = chatId ? getRememberedAgent(chatId) : null;

    const parsed = parseAgentAndTask(text, {
      defaultAgent: remembered || DEFAULT_AGENT,
      infraAgent: INFRA_AGENT,
    });

    // If user typed just "@agent" (no task), show help.
    if (chatId && parsed.hadExplicitAgent && !parsed.task) {
      await sendTelegramMessage({ chatId, text: helpText() });
      return NextResponse.json({ ok: true });
    }

    if (chatId && parsed.agent) rememberLastAgent(chatId, parsed.agent);

    const forwardedText = `@${parsed.agent} ${parsed.task}`.trim();

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
        // Keep original text for debugging + traceability.
        text,
        forwardedText,
        agent: parsed.agent,
        task: parsed.task,
        hadExplicitAgent: parsed.hadExplicitAgent,
        inferredInfra: parsed.inferredInfra,
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
