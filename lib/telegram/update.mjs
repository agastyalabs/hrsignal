import { z } from "zod";

// Minimal Telegram Update schema (enough for webhook validation + basic routing).
export const TelegramUpdateSchema = z
  .object({
    update_id: z.number().int(),
    message: z
      .object({
        message_id: z.number().int(),
        date: z.number().int(),
        text: z.string().optional(),
        chat: z.object({
          id: z.number().int(),
          type: z.string(),
          username: z.string().optional().nullable(),
        }),
        from: z
          .object({
            id: z.number().int(),
            username: z.string().optional().nullable(),
            first_name: z.string().optional().nullable(),
          })
          .optional(),
      })
      .optional(),
    edited_message: z
      .object({
        message_id: z.number().int(),
        date: z.number().int(),
        text: z.string().optional(),
        chat: z.object({
          id: z.number().int(),
          type: z.string(),
          username: z.string().optional().nullable(),
        }),
        from: z
          .object({
            id: z.number().int(),
            username: z.string().optional().nullable(),
            first_name: z.string().optional().nullable(),
          })
          .optional(),
      })
      .optional(),
    callback_query: z
      .object({
        id: z.string(),
        data: z.string().optional(),
        message: z
          .object({
            message_id: z.number().int(),
            date: z.number().int().optional(),
            chat: z.object({
              id: z.number().int(),
              type: z.string(),
              username: z.string().optional().nullable(),
            }),
          })
          .optional(),
        from: z.object({
          id: z.number().int(),
          username: z.string().optional().nullable(),
          first_name: z.string().optional().nullable(),
        }),
      })
      .optional(),
  })
  .strict();

export function parseTelegramUpdate(input) {
  return TelegramUpdateSchema.parse(input);
}

export function extractTelegramText(update) {
  return update.message?.text ?? update.edited_message?.text ?? update.callback_query?.data ?? "";
}

export function extractChatId(update) {
  return update.message?.chat.id ?? update.edited_message?.chat.id ?? update.callback_query?.message?.chat.id ?? null;
}

export function extractUserId(update) {
  return update.message?.from?.id ?? update.edited_message?.from?.id ?? update.callback_query?.from.id ?? null;
}

function normSpaces(s) {
  return String(s ?? "").replace(/\s+/g, " ").trim();
}

export function isInfraRelatedText(text) {
  const t = normSpaces(text).toLowerCase();
  if (!t) return false;

  // Heuristic keywords: deployment/infra/ops.
  return /\b(vercel|deploy|deployment|prod|production|preview|domain|dns|ssl|tls|cert|webhook|gateway|openclaw|server|infra|ops|devops|ci|github\s*actions|pipeline|docker|kubernetes|k8s|nginx|postgres|database\s+url|direct_url|prisma\s+migrate|migration|cron|env\s+vars?|secrets?)\b/i.test(
    t,
  );
}

export function parseAgentAndTask(text, opts = {}) {
  const cleaned = normSpaces(text);

  const defaultAgent = typeof opts.defaultAgent === "string" && opts.defaultAgent.trim() ? opts.defaultAgent.trim() : "senior-dev";
  const infraAgent = typeof opts.infraAgent === "string" && opts.infraAgent.trim() ? opts.infraAgent.trim() : "devops";

  // Explicit @agent prefix: "@agent do thing"
  const m = cleaned.match(/^@([a-zA-Z0-9_-]{2,32})\s*(.*)$/);
  if (m) {
    const agent = m[1];
    const task = normSpaces(m[2]);
    return {
      agent,
      task,
      hadExplicitAgent: true,
      usedDefaultAgent: false,
      inferredInfra: false,
    };
  }

  // No explicit agent: route to default agent, or infra agent if needed.
  const inferredInfra = isInfraRelatedText(cleaned);
  const agent = inferredInfra ? infraAgent : defaultAgent;

  return {
    agent,
    task: cleaned,
    hadExplicitAgent: false,
    usedDefaultAgent: true,
    inferredInfra,
  };
}
