# Telegram bridge (webhook) — minimal app endpoint

This repo includes a minimal Next.js webhook endpoint to accept Telegram updates and (optionally) forward them onward.

## Endpoint
- `POST /api/telegram/webhook`

## Environment variables

### Required (for debug reply)
- `TELEGRAM_BOT_TOKEN` — Bot token from BotFather.

### Recommended (webhook verification)
- `TELEGRAM_WEBHOOK_SECRET` — If set, webhook requests must include header:
  - `x-telegram-bot-api-secret-token: <TELEGRAM_WEBHOOK_SECRET>`

### Optional (forwarding)
- `OPENCLAW_FORWARD_URL` — If set, the webhook forwards a JSON payload best-effort.
- `OPENCLAW_FORWARD_TOKEN` — Optional bearer token used as `Authorization: Bearer ...`.

### Optional (auth debug)
- `TELEGRAM_ALLOWED_USER_ID` — Used by `/whoami` to report whether sender matches the allowlist.

## Debug command
- Send `/whoami` to the bot.
- Bot replies with:
  - detected `user_id`
  - configured `allowed` id
  - `matches=true|false`

## Tests
- `npm run test:telegram`

This uses Node’s built-in test runner (no extra test framework dependency).
