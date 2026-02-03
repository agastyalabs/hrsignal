# HRSignal v1 — Architecture (MVP)

This document is based on (and aligned with):
- `docs/PRODUCT_DECISION.md` (LOCKED)
- `docs/RESEARCH.md`

HRSignal v1 = **HR software discovery + recommendations for Indian SMEs/MSMEs**, monetized via **qualified lead capture**.

---

## 1) MVP system overview (Next.js App Router)

### Components
- **Next.js App Router (UI + Backend)**
  - Public pages: home, category browse, tool browse, tool detail, questionnaire, results/compare
  - Admin pages: catalog management, lead ops
- **Postgres DB** (system of record) accessed via **Prisma**
  - Catalog, questionnaire submissions, recommendation runs, leads, delivery/audit
- **Recommendation Engine v1**
  - Rule-based constraints + scoring + explainable output
- **Auth/RBAC**
  - NextAuth for admin sessions + role checks
- **Email Notifications**
  - Resend to deliver leads to vendors (after internal review)

### Primary user flows
1) **Discovery**
   - Browse categories → tool lists → tool detail
2) **Recommendations**
   - Questionnaire → results (3–5 recommended tools + “why”) → compare
3) **Lead capture / monetization**
   - Request demo/quote → lead created → routed to best-fit vendor → delivered via email
4) **Admin ops**
   - Maintain catalog, review/route leads, send leads to vendors, track outcomes

### Non-goals (MVP)
- No HR analytics/alerts product.
- No marketplace payments.
- No deep integrations (only “supports integration with X” metadata).

---

## 2) Data model (core entities)

> The exact schema can be implemented via Prisma; below is the canonical conceptual model.

### Tool
A product listing.
- `id`, `slug`, `name`, `tagline`, `description`
- `status` (draft/published)
- `vendorId`
- `categories[]` (many-to-many)
- `integrationsSupported[]` (many-to-many)
- Fit facets:
  - `bestForEmployeeBand` (e.g., 20–50 / 51–200 / 201–500 / 501–2000)
  - `indiaComplianceNotes` (PF/ESI/PT/TDS readiness notes)
  - `pricingBand` (e.g., <₹50/employee, ₹50–₹100, quote-based)
  - `lastVerifiedAt`

### Category
One-level taxonomy in MVP.
- `id`, `slug`, `name`, `sortOrder`

Initial MVP categories (top 5, locked):
- Core HRMS
- Payroll + Statutory Compliance (PF/ESI/PT/TDS)
- Attendance/Leave/Time
- ATS / Hiring
- Performance/OKR

### Vendor
Company behind tools.
- `id`, `name`, `websiteUrl`, `contactEmail`
- ICP/routing fields:
  - `supportedCategories[]`
  - `supportedEmployeeBands[]`
  - `supportedStates[]` (optional)
  - `isActive`

### QuestionnaireSubmission
Stores buyer input (raw + derived).
- `id`, `createdAt`
- `answers` (JSON)
- Derived fields used by engine and routing:
  - `employeeBand`
  - `industry`
  - `locations` + `states[]`
  - `modulesNeeded[]` (categories)
  - `complianceNeeds[]` (PF/ESI/PT/TDS + “Not sure”)
  - `integrationsRequired[]` (Tally/Zoho/etc.)
  - `budgetBand`, `timelineToGoLive`
  - buyer contact fields (email/role)

### RecommendationRun
Persisted recommendation output for a submission.
- `id`, `createdAt`
- `submissionId`
- `result` (JSON)

**Result JSON (v1) should include:**
- `version`
- `tools[]` (3–5 recommended tools)
  - `toolId/slug/name`
  - `score`
  - `why` (explainable reason)
  - `fit` (optional structured breakdown)

### Lead
A buyer request for vendor contact.
- `id`, `createdAt`, `updatedAt`
- `submissionId` (recommended)
- Buyer info: `companyName`, `contactName`, `contactEmail`, `phone`, `role`
- Need profile: `employeeBand`, `states[]`, `categoriesNeeded[]`, `budgetBand`, `timeline`
- `qualificationTier` (hot/warm/cold)
- `status` (new/assigned/queued/sent/accepted/rejected/contacted/won/lost)
- `assignedVendorId`

---

## 3) Recommendation engine v1 (rule-based scoring + explainable)

### Inputs
- Questionnaire-derived `CompanyProfile`
  - employee band
  - modules needed
  - compliance needs (PF/ESI/PT/TDS)
  - integrations required
  - budget band + timeline
  - (optional) attendance complexity, workforce mix, industry

- Catalog signals
  - tool category coverage
  - size-band fit
  - integration support
  - compliance notes
  - pricing band
  - freshness (last verified)

### Algorithm

#### Step A — Hard filters (eligibility)
Candidate tools must:
- be `published`
- match requested categories/modules
- satisfy required integrations (if specified)
- satisfy size band (or be marked as broad fit)

#### Step B — Scoring (rank eligible tools)
A weighted score, tuned for SMEs:
- **Category fit** (primary module coverage)
- **Size fit** (employee band)
- **India compliance fit** (especially for payroll category)
- **Integration fit** (Tally/Zoho etc.)
- **Commercial fit** (budget band, quote-based penalty/bonus)
- **Freshness** (recent verification)

#### Step C — Explainability
Generate “why this tool” from the score contributors (no hallucination):
- e.g., “Fits 51–200 employees, supports payroll compliance (PF/ESI/PT) and integrates with Tally; pricing is in your target band.”

### Output
- 3–5 tools overall (or per-category picks + alternates)
- `why` explanations
- pricing band + compliance notes shown in results UI

---

## 4) Admin area + RBAC (NextAuth)

### Authentication
- NextAuth manages sessions.
- MVP supports internal admin access (upgrade path: Google OAuth + allowlist).

### Roles
- `admin`: manage catalog + manage leads + send to vendors
- `ops`: manage leads only
- `viewer`: read-only

### Admin capabilities
- Catalog CRUD:
  - categories, tools, vendors
  - publish/unpublish
  - last verified + pricing band + compliance notes
- Lead ops:
  - view lead list + filters
  - inspect recommendation context
  - assign best-fit vendor (auto + override)
  - send lead email (Resend)
  - track outcomes

---

## 5) Email/notifications (Resend)

### Use cases (MVP)
- Deliver a lead to the assigned vendor (after internal review)

### Content requirements
- Buyer company + contact
- Requirements summary (modules, size band, states, compliance needs)
- Timeline + budget band
- Link back to internal admin lead detail page

### Implementation notes
- A single send action should:
  1) create a `LeadDelivery` audit record
  2) attempt send (Resend)
  3) update delivery status + lead status

---

## 6) API routes + server actions plan

### Public
- `POST /api/recommendations`
  - validate input
  - create QuestionnaireSubmission
  - compute RecommendationRun
  - return results id

- `POST /api/leads`
  - validate contact details
  - create Lead
  - qualify tier (hot/warm/cold)
  - assign single best-fit vendor
  - status remains queued for admin review

### Admin (prefer server actions)
Admin UX should use server actions for simplicity and safety:
- `assignVendor(leadId, vendorId)`
- `sendLeadToVendor(leadId)`
- `updateLeadStatus(leadId, status)`
- `publishTool(toolId, published)`

API routes are reserved for external integrations (webhooks) later.

---

## 7) Security notes (secrets, rate limits)

### Secrets
- Store in env (Vercel env vars), never commit.
- Required:
  - `DATABASE_URL`
  - `AUTH_SECRET`
  - `RESEND_API_KEY`

### Rate limits / abuse
- Rate limit public endpoints:
  - `/api/recommendations`
  - `/api/leads`
- Add bot protection if needed (captcha v1.1).

### Authorization
- Admin pages and actions require session + role checks.
- Public pages must not expose vendor contact emails or lead details.

### Privacy/trust
- Do not broadcast leads; route to a single vendor.
- Show explainable scoring, and label any sponsored placement if introduced later.
