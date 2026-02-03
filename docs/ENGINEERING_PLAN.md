# ENGINEERING_PLAN — HRSignal v1 (Next.js App Router)

This plan implements the locked product direction from:
- `docs/PRODUCT_DECISION.md`
- `docs/RESEARCH.md`
- `docs/ARCHITECTURE.md`

**HRSignal v1:** India-first HR software discovery + *rule-based, explainable* recommendations for SMEs/MSMEs, monetized via **qualified lead capture**.

---

## Milestones (PR1 → PR6)

Principles:
- Keep PRs **small, shippable**, and independently deployable.
- Keep business logic in `lib/` as pure, testable functions.
- Public API routes do **validate → persist → call domain logic → return**.

### PR1 — Public UI foundation: Landing + CTAs + Category browse entry
**Goal:** A credible homepage aligned to `docs/RESEARCH.md` with clear entry points into the two MVP journeys.

Deliverables:
- Landing page sections:
  - Hero (headline + subhead)
  - Primary CTA: **Get Recommendations (2 minutes)**
  - Secondary CTA: **Browse Categories**
  - Value props (India-first compliance fit, explainable recommendations, compare quickly, qualified vendor intros)
  - How it works (3 steps)
  - Trust/safety copy (privacy control)
- Category browse page showing the **5 locked categories**.
- Seed ensures the categories exist.

Acceptance criteria:
- Home page copy matches `docs/RESEARCH.md`.
- Both CTAs navigate to working routes (questionnaire start, category browse).

---

### PR2 — Discovery loop: Category → tool list → tool detail
**Goal:** Users can discover tools by category and view tool details.

Deliverables:
- Category list page → category detail page showing tools in that category.
- Tool card view model:
  - name, tagline, vendor (if present)
  - best-for size bands (if present)
  - pricing note (if present)
- Tool detail page:
  - description + pricing plans
  - integrations supported
  - “Request demo/quote” CTA (can link to lead form entry in PR4)

Acceptance criteria:
- All 5 categories render and show their tools (from seed/catalog).
- Tool detail is reachable via stable slug route.

---

### PR3 — Recommendation flow: Questionnaire → rule-based engine → Results UI
**Goal:** User completes a short questionnaire and gets **3–5 explainable recommendations**.

Deliverables:
- Questionnaire wizard (multi-step) that collects:
  - Categories needed (single or multi)
  - Company size band
  - States (optional)
  - Must-have integrations (optional)
  - Payroll compliance needs (PF/ESI/PT/TDS + “not sure”) when payroll selected
  - Budget note + timeline note (optional)
- Recommendation pipeline:
  - Create `QuestionnaireSubmission` (raw answers + derived fields)
  - Run rule-based engine (hard filters + scoring)
  - Create `RecommendationRun` (persisted JSON)
  - Results page loads by run id (`/results/[id]`)
- Results UI:
  - 3–5 recommended tools
  - “Why recommended” per tool (explainable reasons derived from scoring)
  - Link to tool detail

Acceptance criteria:
- Submitting questionnaire returns a results URL.
- Results page displays deterministic recommendations + explanations.

---

### PR4 — Lead capture (public): form + storage + basic abuse prevention
**Goal:** Convert intent into stored, qualified leads.

Deliverables:
- Lead capture form entry points:
  - Primary: results page
  - Secondary (optional): tool detail page
- Required fields:
  - company name
  - contact name
  - contact email
- Optional fields:
  - phone
  - role
  - states
  - budget note, timeline note
- Storage:
  - Create `Lead` row
  - Link to `QuestionnaireSubmission` when coming from recommendations
  - Set `qualification` (hot/warm/cold heuristic)
  - Initial status `NEW` (or `ASSIGNED` if auto-routing is enabled)
- Abuse prevention:
  - Zod validation for all inputs
  - request size limit
  - basic IP rate limiting for `/api/leads` and `/api/recommendations`

Acceptance criteria:
- A lead submit creates a `Lead` record and returns a success confirmation.
- Lead appears in admin lead list.

---

### PR5 — Admin ops: Auth/RBAC + lead review + vendor assignment + status updates
**Goal:** Internal team can operate the lead pipeline safely.

Deliverables:
- Admin authentication via NextAuth.
  - MVP acceptable: internal credentials/allowlist via env (upgrade path: Google OAuth allowlist)
- RBAC helpers (admin/ops/viewer) and route protection.
- Admin pages:
  - Lead list (filters: status, category, date)
  - Lead detail:
    - buyer info
    - need profile (size band, categories, states, budget/timeline)
    - linked submission / recommendation run if available
    - assign/override vendor
    - update lead status (accepted/rejected/contacted/won/lost)
- Vendor assignment logic:
  - `assignBestVendor(lead)` uses vendor ICP facets from `docs/ARCHITECTURE.md` (category overlap, size band fit, state fit, isActive)

Acceptance criteria:
- `/admin/*` requires authentication.
- Admin can assign vendor and update status on a lead.

---

### PR6 — Lead delivery: Resend email + audit trail + engineering quality gates
**Goal:** Close the monetization loop and add guardrails.

Deliverables:
- Resend integration:
  - Admin action “Send to vendor”
  - Create `LeadDelivery` row (queued → sent/failed)
  - Update lead status (`SENT`) on success
  - Email includes buyer profile + requirements summary + link back to admin lead
- Minimal server-side events (optional but recommended for funnel tracking):
  - `view_home`, `view_category`, `view_tool`
  - `start_questionnaire`, `submit_questionnaire`, `view_results`
  - `lead_submit`, `lead_assigned`, `lead_sent`, `lead_status_changed`
- Testing/lint/typecheck gates (see below)

Acceptance criteria:
- Sending a lead generates an email and a persisted delivery audit record.
- CI runs lint + typecheck + tests.

---

## File/folder structure (Next.js App Router)

Repo root uses Next.js App Router (`app/`) with Prisma (`prisma/`) and shared logic (`lib/`). Recommended structure going forward:

- `app/`
  - `page.tsx` *(landing)*
  - `categories/`
    - `page.tsx` *(browse categories)*
    - `[slug]/page.tsx` *(tools in a category)*
  - `tools/`
    - `page.tsx` *(optional: all tools or alias to categories)*
    - `[slug]/page.tsx` *(tool detail)*
  - `recommendation/`
    - `page.tsx` *(questionnaire start + wizard)*
  - `results/[id]/`
    - `page.tsx`
    - `results-client.tsx`
  - `admin/`
    - `login/page.tsx`
    - `leads/page.tsx`
    - `leads/[id]/page.tsx`
    - `tools/page.tsx`
  - `api/`
    - `recommendations/route.ts`
    - `leads/route.ts`
    - `admin/…` *(only if needed; prefer server actions for admin UI)*

- `components/`
  - `layout/` *(Header, Footer, Container)*
  - `ui/` *(Button, Card, Badge, Input, Select, Modal, Stepper)*
  - `catalog/` *(CategoryCard, ToolCard, ToolMeta, PricingTable)*
  - `recommendations/` *(QuestionnaireWizard, QuestionSteps, ResultsList, RecommendationCard)*
  - `leads/` *(LeadCaptureForm, ConsentBlock)*

- `lib/`
  - `db.ts` *(Prisma client)*
  - `validation/` *(Zod schemas)*
    - `recommendations.ts`
    - `leads.ts`
  - `catalog/` *(queries + mappers to view models)*
  - `recommendations/`
    - `engine.ts` *(hard filters + scoring)*
    - `explain.ts` *(generate “why” strings from score contributions)*
    - `types.ts`
  - `leads/`
    - `qualify.ts` *(hot/warm/cold heuristic)*
    - `assign.ts` *(best vendor routing)*
  - `auth/` *(NextAuth config + RBAC helpers)*
  - `notifications/` *(Resend client + templates)*
  - `events/` *(optional server-side funnel events)*
  - `rate-limit/` *(basic limiter; replaceable)*

- `prisma/`
  - `schema.prisma`
  - `migrations/`

- `scripts/`
  - `seed.mjs` *(categories + sample vendors/tools)*

Notes:
- Keep slugs for the locked categories as constants (single source of truth), e.g. `lib/constants/categories.ts`:
  - `hrms`, `payroll`, `attendance`, `ats`, `performance`

---

## What to implement first in the UI (landing + CTA + category browse)

### 1) Landing page (first)
Reason: it locks positioning, provides a polished top-of-funnel, and requires minimal backend.

Implement:
- Hero:
  - “Find the right HR software for your business — fast.”
  - “India-first recommendations for HRMS, payroll & compliance, attendance, ATS and performance tools.”
- CTAs:
  - Primary → `/recommendation`
  - Secondary → `/categories`
- Value props + How it works + Trust/safety (from `docs/RESEARCH.md`)

### 2) CTA wiring + navigation
- Ensure header/nav always has:
  - “Get Recommendations”
  - “Browse Categories”

### 3) Category browse
- Simple grid/list of 5 categories with short descriptions.
- Each category links to its tool list.

---

## Recommendation flow: screens + components

### Screens

1) **Recommendation Start** (`/recommendation`)
- Explain what will be asked (2 minutes).
- Link to privacy (“We don’t sell your data. You control what you submit.”).
- CTA: Start.

2) **Questionnaire Wizard** (`/recommendation` internal steps)
- Multi-step, with progress indicator.
- Inputs tuned for `docs/ARCHITECTURE.md` engine:
  - category/modules needed
  - size band
  - states (optional)
  - integrations required (optional)
  - compliance needs (PF/ESI/PT/TDS) when payroll selected
  - budget note, timeline note

3) **Results** (`/results/[id]`)
- 3–5 tools overall (or per-category sections if multi-category).
- Each tool includes:
  - key metadata (size band fit, integrations, pricing note)
  - “Why this tool” (1–3 bullet reasons)
- CTA: “Request demos/quotes” (opens lead capture).

4) **Lead Capture** (modal or `/lead` page)
- Collect contact details and submit to `/api/leads`.
- Confirmation state with expectations: “We’ll review and connect you to the best-fit vendor.”

### Components

Shared UI:
- `components/ui/Button.tsx`, `Card.tsx`, `Badge.tsx`, `Input.tsx`, `Select.tsx`, `Modal.tsx`, `Stepper.tsx`
- `components/layout/Header.tsx`, `Footer.tsx`, `Container.tsx`

Recommendation-specific:
- `components/recommendations/QuestionnaireWizard.tsx`
- `components/recommendations/ProgressStepper.tsx`
- `components/recommendations/questions/CategoryStep.tsx`
- `components/recommendations/questions/SizeBandStep.tsx`
- `components/recommendations/questions/ComplianceStep.tsx`
- `components/recommendations/questions/IntegrationsStep.tsx`
- `components/recommendations/questions/BudgetTimelineStep.tsx`
- `components/recommendations/ResultsList.tsx`
- `components/recommendations/RecommendationCard.tsx`
- `components/recommendations/WhyThisTool.tsx` *(render explanation bullets)*

---

## Lead capture form + storage

### Form UX requirements
- Required:
  - company name
  - contact name
  - contact email
- Optional:
  - phone
  - role
  - states
  - budget note, timeline note
- Always include (hidden/derived):
  - categories needed
  - size band (if known)
  - `submissionId` when available

### Storage model
Use the schema described in `docs/ARCHITECTURE.md` (and already aligned in Prisma):
- `QuestionnaireSubmission`
- `RecommendationRun`
- `Lead`
- `LeadAssignment`
- `LeadDelivery`

### Submission contract
- `POST /api/leads`
  - Validate via Zod.
  - Create `Lead` (status `NEW`).
  - Optionally precompute `assignedVendorId` (but keep delivery behind admin review per architecture).
  - Return `{ leadId }`.

### Qualification heuristic (v1)
Compute `qualification` as hot/warm/cold using simple signals:
- Hot: clear category + size band + urgent timeline + contact phone provided
- Cold: missing critical context, vague timeline/budget

---

## Testing + lint + typecheck gates

### Required local scripts
Add scripts (by PR6; earlier is fine):
- `lint`: already present
- `typecheck`: `tsc --noEmit`
- `test`: unit tests
- Optional: `test:e2e`: Playwright smoke tests

### Unit tests (recommended)
Framework: Vitest.

Focus areas:
- `lib/recommendations/engine.ts` (hard filters + scoring are deterministic)
- `lib/recommendations/explain.ts` (explanations match score contributions)
- `lib/leads/qualify.ts` and `lib/leads/assign.ts`
- Zod schemas: parsing + refinements

### E2E smoke tests (recommended)
Framework: Playwright.

Minimal cases:
1) Home loads and CTAs navigate.
2) Questionnaire submit → results render.
3) Lead submit → success confirmation.
4) `/admin/*` redirects to login when unauthenticated.

### CI gates (PR checks)
On every PR:
- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- Optional: `npm run test:e2e`

---

## Scope controls (MVP guardrails)
- No payments/checkout.
- No deep integrations (metadata only).
- No “sponsored overrides” that violate hard constraints.
- Recommendation engine must remain deterministic and debuggable.
- Do not blast leads to multiple vendors; route to a single vendor and audit deliveries.
