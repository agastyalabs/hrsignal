# HRSignal Environment Variables

## Required (production)

- `DATABASE_URL` — Postgres connection string.

## Email notifications (optional but recommended)

- `RESEND_API_KEY` — Resend API key.
- `RESEND_FROM_EMAIL` — Verified sender address (e.g. `HRSignal <noreply@yourdomain>`).
- `LEAD_NOTIFY_EMAILS` — Comma-separated notify list.
- `LEAD_EMAIL_TO` — Alternate env var for notify list.

Notes:
- For safety, the leads endpoint filters recipients to only `nk@infira.in` and `pcst.ecrocks@gmail.com`.
- If Resend is in testing mode and returns 403, the API still returns 200 and includes `emailError`.
