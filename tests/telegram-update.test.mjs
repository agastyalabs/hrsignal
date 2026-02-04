import test from "node:test";
import assert from "node:assert/strict";

import {
  extractChatId,
  extractTelegramText,
  extractUserId,
  parseTelegramUpdate,
} from "../lib/telegram/update.mjs";

test("parseTelegramUpdate: accepts minimal message update", () => {
  const update = parseTelegramUpdate({
    update_id: 1,
    message: {
      message_id: 10,
      date: 1700000000,
      text: "hello",
      chat: { id: 123, type: "private" },
      from: { id: 456, first_name: "A" },
    },
  });

  assert.equal(update.update_id, 1);
  assert.equal(extractTelegramText(update), "hello");
  assert.equal(extractChatId(update), 123);
  assert.equal(extractUserId(update), 456);
});

test("parseTelegramUpdate: rejects unknown top-level keys (strict)", () => {
  assert.throws(() =>
    parseTelegramUpdate({
      update_id: 1,
      message: {
        message_id: 10,
        date: 1700000000,
        chat: { id: 123, type: "private" },
      },
      extra: true,
    })
  );
});

test("extractTelegramText: supports callback_query.data", () => {
  const update = parseTelegramUpdate({
    update_id: 2,
    callback_query: {
      id: "cbq_1",
      data: "CLICKED",
      from: { id: 777, first_name: "B" },
      message: { message_id: 11, chat: { id: 999, type: "private" } },
    },
  });

  assert.equal(extractTelegramText(update), "CLICKED");
  assert.equal(extractChatId(update), 999);
  assert.equal(extractUserId(update), 777);
});

test("/whoami is representable as message text", () => {
  const update = parseTelegramUpdate({
    update_id: 3,
    message: {
      message_id: 12,
      date: 1700000001,
      text: "/whoami",
      chat: { id: 321, type: "private" },
      from: { id: 654, first_name: "C" },
    },
  });

  assert.equal(extractTelegramText(update), "/whoami");
  assert.equal(extractChatId(update), 321);
  assert.equal(extractUserId(update), 654);
});
