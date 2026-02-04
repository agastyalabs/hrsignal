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
