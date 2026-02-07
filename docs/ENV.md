# HRSignal Environment Variables

## Required (production)

- `DATABASE_URL` — Postgres connection string (Prisma).

## Leads notifications (optional but recommended)

- `RESEND_API_KEY` — Resend API key.
- `RESEND_FROM_EMAIL` — Verified sender address (e.g. `HRSignal <noreply@hrsignal.in>`).
- `LEAD_NOTIFY_EMAILS` — Comma-separated notify list for lead notifications.
- `LEAD_EMAIL_TO` — Back-compat alternate env var for notify list.

Behavior:
- `POST /api/leads` stores the lead (best-effort) and sends an email (best-effort).
- Email failures never break UX: the API still returns HTTP 200 `{ ok: true }` for non-validation cases.
