# NEXT_STEPS (prioritized) — HRSignal

Scope: analysis + **exact file paths** where fixes should happen. **No implementation in this step.**

Priority order per request:
1) Unify lead-to-inbox via Resend across **all** lead capture points
2) Fix PDF download not working
3) Fix email not arriving after form submission

---

## 1) Unify lead-to-inbox via Resend across ALL lead capture points

### Problem (current state)
Lead capture is fragmented across multiple endpoints with different behavior:

- `POST /api/leads` → `app/api/leads/route.ts`
  - ✅ best-effort DB insert (`Lead`)
  - ✅ best-effort Resend internal notify
  - ✅ returns 200 on non-validation failures

- `POST /api/leads/submit` → `app/api/leads/submit/route.ts`
  - ❌ does not write to DB
  - ⚠️ internal + buyer emails are best-effort but can silently **skip** if `RESEND_API_KEY` or `RESEND_FROM_EMAIL` missing
  - used by:
    - `app/results/[id]/results-client.tsx` (unlock + intro)
    - `app/recommend/submit/route.ts`

- `POST /api/leads/checklist` → `app/api/leads/checklist/route.ts`
  - ❌ fails hard (500) if Resend not configured / errors
  - used by:
    - `components/lead/ChecklistDownloadCard.tsx`

Result: the “lead-to-inbox” outcome varies depending on which UI entry point is used.

### Target behavior
- A single lead capture pipeline that:
  1) Delivers **internal notification emails** consistently via Resend
  2) Optionally sends buyer confirmation email (per lead kind)
  3) Does not break UX on email/provider errors (at minimum, still captures the lead payload)
  4) Uses one canonical recipient policy + allowlist

### Minimal safe migration plan (no UX breakage)

**Step A — create a single shared server utility (new file)**
- Create a shared module (example path):
  - `lib/leads/email.ts` (or `lib/leads/resend.ts`)

Responsibilities:
- `getNotifyRecipients()` with allowlist (currently duplicated)
- `sendWithResend({to, subject, html})` with consistent logging and error return shape
- (Optional) email HTML shell helpers

**Step B — consolidate endpoints to use shared utility**
Update these files to import the shared utility:
- `app/api/leads/route.ts`
- `app/api/leads/submit/route.ts`
- `app/api/leads/checklist/route.ts`

**Step C — choose the canonical API surface for UI**
Two safe options:

Option 1 (most consistent): Make `/api/leads` the single endpoint for all capture.
- Update callers to post to `/api/leads`:
  - `app/results/[id]/results-client.tsx`
  - `app/recommend/submit/route.ts`
  - `components/lead/ChecklistDownloadCard.tsx`
- Expand `/api/leads` validation to accept “checklist lead” style payloads (email + companySize + role + sourcePage) without requiring name/usecase.

Option 2 (least disruption): Keep multiple routes but they all call a single shared `captureLead(...)` function.
- Create `lib/leads/capture.ts`:
  - `captureLead({ kind, email, name?, companySize?, role?, source, tool?, ... })`
  - Handles DB write if applicable, always handles internal email.
- Wire:
  - `/api/leads` and `/api/leads/submit` and `/api/leads/checklist` → call `captureLead`.

### Exact files involved (inventory)
Lead capture call sites:
- `app/results/[id]/results-client.tsx` → posts to `/api/leads/submit`
- `app/recommend/submit/route.ts` → posts to `/api/leads/submit`
- `components/lead/ChecklistDownloadCard.tsx` → posts to `/api/leads/checklist`

Lead API routes:
- `app/api/leads/route.ts`
- `app/api/leads/submit/route.ts`
- `app/api/leads/checklist/route.ts`

Env var docs:
- `docs/ENV.md`
- `docs/ENV_VARS.md`
- (Also update `.env.example` because it currently mentions `INTERNAL_LEADS_EMAIL` / SMTP and doesn’t list the real envs.)

---

## 2) Fix PDF download not working

### What “PDF” means in the repo today
There are two separate PDF experiences:

1) **Checklist PDF download** (static file)
- File exists: `public/downloads/india-payroll-risk-checklist.pdf`
- Download link appears in:
  - UI: `components/lead/ChecklistDownloadCard.tsx`
  - Buyer email in: `app/api/leads/checklist/route.ts` (uses origin + `NEXT_PUBLIC_SITE_URL`)
  - Buyer email in: `app/api/leads/submit/route.ts` (hard-coded URL; says “placeholder”)

2) **Decision report “PDF export”** is actually **print-to-PDF**
- Entry: `app/recommend/page.tsx` links to `/report?...`
- Page: `app/report/page.tsx` renders report and provides `window.print()` button

### Likely failure modes
- Checklist download link wrong domain (hard-coded `hrsignal.vercel.app`) or inconsistent between routes.
- Checklist email may never send (so user never receives link).
- Report export mismatch: user expects a “download” but gets a print flow.

### Fix plan (structure only)

**A) Normalize checklist download URL generation**
- Update `app/api/leads/submit/route.ts` to build `downloadUrl` using the same method as checklist route:
  - use `NEXT_PUBLIC_SITE_URL` or request origin (see `originFrom(req)` pattern in `app/api/leads/checklist/route.ts`).

Files:
- `app/api/leads/submit/route.ts`
- `app/api/leads/checklist/route.ts` (use as reference)

**B) Confirm static asset path used everywhere**
- Ensure all download links resolve to:
  - `/downloads/india-payroll-risk-checklist.pdf`

Files:
- `components/lead/ChecklistDownloadCard.tsx`
- `app/api/leads/checklist/route.ts`
- `app/api/leads/submit/route.ts`

**C) Clarify/report export behavior**
If the bug report refers to “Export report (PDF)” not downloading:
- Decide whether to:
  1) rename CTA to “Open printable report” / “Print to PDF” (UI fix), OR
  2) implement a real PDF generator route (heavier)

Files:
- `app/recommend/page.tsx` (CTA label)
- `app/report/page.tsx` (auto-trigger print, or clarify UI)

---

## 3) Fix email not arriving after form submission

### Current failure-prone behavior
- `/api/leads/submit` can silently skip email if Resend isn’t configured:
  - `app/api/leads/submit/route.ts` logs: `[leads/submit] Resend not configured; skipping email.`
  - Client pages generally treat form submit as success regardless.

- `/api/leads/checklist` returns **500** if email fails (hard failure), which may show errors even if the user still should be able to download the PDF.

- `/api/leads` (DB endpoint) is best-effort and returns 200, but may not be used by all forms.

### Fix plan (no code, just where)

**A) Ensure Resend is correctly configured in deployment**
- Confirm Vercel env vars in both Preview + Production:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL` (must be a verified sender in Resend)
  - `LEAD_NOTIFY_EMAILS` (or rely on fallback allowlisted recipients)

Docs to align:
- `docs/ENV.md`
- `docs/ENV_VARS.md`
- `.env.example` (currently incomplete/outdated)

**B) Standardize response shape from lead endpoints**
- Ensure all lead endpoints return something like:
  - `{ ok: true, emailSent: boolean, emailError?: string }`
- Ensure UI surfaces “We captured your request but couldn’t email you. Here’s the download link.” when needed.

Files:
- `app/api/leads/route.ts`
- `app/api/leads/submit/route.ts`
- `app/api/leads/checklist/route.ts`
- `components/lead/ChecklistDownloadCard.tsx`
- `app/results/[id]/results-client.tsx` (unlock + intro)

**C) Eliminate hard failures for checklist capture**
- Checklist route currently blocks if buyer email fails.
- For a lead magnet, better UX is:
  - capture intent, return `ok:true` and show the download link even if email fails.

Files:
- `app/api/leads/checklist/route.ts`
- `components/lead/ChecklistDownloadCard.tsx`

---

## Quick triage checklist (before any code)

1) In Vercel env, is `RESEND_FROM_EMAIL` set to a verified sender?
2) Are Resend logs showing rejections (403 testing mode, domain not verified, etc.)?
3) Trigger test lead:
   - `npm run test:lead` (see `scripts/test-lead.mjs`)
4) Confirm PDF exists at:
   - `https://<site>/downloads/india-payroll-risk-checklist.pdf`

---

## Appendix: Relevant paths (one list)

- Lead API routes:
  - `app/api/leads/route.ts`
  - `app/api/leads/submit/route.ts`
  - `app/api/leads/checklist/route.ts`

- Lead capture UI:
  - `components/lead/ChecklistDownloadCard.tsx`
  - `app/results/[id]/results-client.tsx`
  - `app/recommend/submit/route.ts`

- PDF assets:
  - `public/downloads/india-payroll-risk-checklist.pdf`

- PDF/print report:
  - `app/recommend/page.tsx`
  - `app/report/page.tsx`

- Env docs:
  - `docs/ENV.md`
  - `docs/ENV_VARS.md`
  - `.env.example`
