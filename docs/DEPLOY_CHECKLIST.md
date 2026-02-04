# Deploy Checklist (Vercel + Neon)

This checklist is meant to prevent the common “works locally / fails on Vercel” problems: missing env vars, mismatched DB URLs, and unsafe Prisma migration flows.

---

## 1) Environments & ownership

Decide the 3 environments up-front and keep them separate:

- **Local dev**: `.env.local` (not committed)
- **Preview (Vercel)**: Vercel “Preview” env vars + (ideally) a **Neon branch DB**
- **Production (Vercel)**: Vercel “Production” env vars + **Neon primary DB**

Recommended pattern:

- **Preview deployments use a dedicated Neon branch** (or a separate Neon project) so migrations can run safely without touching prod.
- **Prod deployments only migrate forward** and never run `prisma migrate dev`.

---

## 2) Required environment variables

### Database (Neon)

Required:

- `DATABASE_URL`
  - Must be a **pooled/HTTP-safe** connection string if your runtime uses serverless connections.
  - For Prisma with Postgres, typical format:
    - `postgresql://USER:PASSWORD@HOST:5432/DB?schema=public`

Recommended (depending on how you run migrations):

- `DIRECT_URL`
  - Direct (non-pooled) connection string used **only** for migrations.
  - Prisma supports this via `datasource.db.directUrl` (optional).

Neon note:

- Use **different DB URLs** for Preview vs Production.

### Auth (admin)

This repo uses NextAuth Credentials for an internal admin login.

Required in Vercel Preview + Production:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET` (long random string)

Guidance:

- Generate `AUTH_SECRET` with a password manager or:
  - `openssl rand -base64 48`
- Rotate `ADMIN_PASSWORD` if it ever appears in logs/screenshots.

### Email / lead delivery

Current code supports internal lead delivery by destination email.

Required (if you want leads routed internally):

- `INTERNAL_LEADS_EMAIL`

Optional (only if/when email sending is implemented):

- `RESEND_API_KEY` (or SMTP creds if you switch providers)

---

## 3) Vercel project settings

- **Node.js version**: align with local (currently Node 22.x).
- **Build command**: `npm run build`
- **Install command**: default (`npm ci`)
- Ensure env vars are set for:
  - Preview
  - Production

Sanity checks:

- Preview should not point at Production `DATABASE_URL`.
- Production should not use a pooled URL for migrations (use `DIRECT_URL` if needed).

---

## 4) Prisma migration strategy (Preview vs Prod)

### Local dev

- Use:
  - `npm run prisma:migrate` (runs `prisma migrate dev`)

### Preview (Vercel)

Recommended options:

**Option A (best): Neon branch DB per preview**

- Create a Neon branch per preview environment and set that branch’s `DATABASE_URL`.
- Run:
  - `prisma migrate deploy`

**Option B: shared preview DB (acceptable early-stage)**

- Use a single preview DB, but understand schema drift risk if multiple PRs deploy concurrently.

### Production (Vercel)

- Run only:
  - `npm run prisma:migrate:deploy` (`prisma migrate deploy`)
- Never run `prisma migrate dev` in Production.

Practical ways to run `migrate deploy`:

- During deploy pipeline (preferred):
  - Run `prisma migrate deploy` using `DIRECT_URL` (if configured)
- Or manual step during release:
  - Run migrations from a secure machine/CI job with production credentials

---

## 5) GitHub Actions CI (lint + build)

This repo includes a CI workflow that runs on PRs and pushes:

- `npm ci`
- `npm run lint`
- `npm run build`

The CI uses a dummy `DATABASE_URL` to allow `prisma generate` during the build step.

---

## 6) Secrets hygiene (must-do)

- Confirm env files are not committed:
  - `.env`, `.env.local`, `.env.*` should be ignored (see `.gitignore`).
- Do not paste Neon connection strings into:
  - GitHub issues/PRs
  - Vercel logs
  - Screenshots

Quick checks:

- `git ls-files | grep -E '^\.env'` should return nothing.
- Search for leaked secrets before shipping:
  - `grep -R "postgresql://" -n .`
  - `grep -R "AUTH_SECRET" -n .`

---

## 7) Post-deploy smoke tests

- App loads on `/` and `/tools`.
- Admin login works:
  - `/admin/login`
- DB-backed pages render (production only):
  - `/vendors`, `/tools/[slug]`, `/admin`
- Create a lead (if enabled) and verify it appears in Admin Lead Ops.
