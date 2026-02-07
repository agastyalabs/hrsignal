# Go-live env vars (HRSignal)

Set these in Vercel for **Preview** and **Production**.

## Required

- `DATABASE_URL` — Postgres connection string used by Prisma.

## Optional (lead email notifications)

- `RESEND_API_KEY` — Resend API key.
- `RESEND_FROM_EMAIL` — Verified sender (e.g. `HRSignal <noreply@hrsignal.in>`).
- `LEAD_NOTIFY_EMAILS` — Comma-separated list of recipients for lead notifications.
  - Back-compat: `LEAD_EMAIL_TO`.

## Notes

- Leads endpoint (`POST /api/leads`) is **best-effort** for DB + email:
  - Validation errors → HTTP 400 with `{ ok:false, error }`
  - All other cases → HTTP 200 `{ ok:true }` so UX can always show success
