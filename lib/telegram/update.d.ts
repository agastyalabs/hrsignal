import type { z } from "zod";

export declare const TelegramUpdateSchema: z.ZodTypeAny;
export type TelegramUpdate = z.infer<typeof TelegramUpdateSchema>;

export declare function parseTelegramUpdate(input: unknown): TelegramUpdate;
export declare function extractTelegramText(update: TelegramUpdate): string;
export declare function extractChatId(update: TelegramUpdate): number | null;
export declare function extractUserId(update: TelegramUpdate): number | null;
