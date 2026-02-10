# HRSignal Flagship Lead Magnet — HR Software Decision Report (India)

**Role:** Principal Product + Growth Designer  
**Status:** Spec (no code changes)  
**Goal:** A single flagship asset that beats G2/SoftwareSuggest/Capterra on **decision clarity** by turning buyer inputs into an **evidence-first shortlist + comparison-ready report**.

Aligned to product truth:
- `docs/CONTENT_SPEC.md` (uniform comparable fields + India-first fields + pricing normalization)
- `docs/VERIFICATION_POLICY.md` (Verified / Partially verified / Unverified rules + evidence + freshness)

---

## 1) User entry points (where users start)

### Entry Point A — Homepage (`/`)
**CTA:** “Generate my HR Software Decision Report (India)”
- Secondary CTA next to “Get recommendations” (does not replace it).
- Microcopy: “3–5 tool shortlist with evidence, India fit, and pricing model clarity.”

### Entry Point B — Category decision pages (`/categories/[slug]`)
**CTA:** “Generate a decision report for this category”
- Contextual subtitle: “Payroll & Compliance / ATS / Core HR…”
- Pre-fills category, asks only the deltas (size, states, constraints).

### Entry Point C — Tool detail pages (`/tools/[slug]`)
**CTA:** “Compare this tool in a Decision Report”
- Adds current tool to the report baseline and asks what else the buyer is considering.
- Secondary CTA near pricing / trust row (high intent moment).

**Important constraint:** All CTAs must keep existing navigation and lead flow intact.

---

## 2) Question flow (buyer inputs)

**Design rule:** no long forms. Use 1 question per screen with a progress bar. Default answers and “skip” where safe.

### Step 0 — Scope
- **What are you evaluating?**
  - Categories (multi-select): Core HR, Payroll, ATS, BGV, LMS, Performance, Workforce mgmt, HR service delivery, Expense/Benefits
  - Default: if user entered from a category page, preselect that category.

### Step 1 — Company profile
- **Company size** (bands): 1–20 / 20–200 / 50–500 / 100–1000 / 1000+
- **Industry** (single-select): IT/ITES, Manufacturing, Retail, BFSI, Logistics, Hospitality, Healthcare, Other
- **Workforce type** (multi): office-only, field staff, shifts/rotational, contractors

### Step 2 — Compliance exposure (India-first)
- **States of operation** (multi-select, optional)
- **Statutory complexity** (pick one):
  - basic (single state, minimal edge cases)
  - multi-state (PT/LWF variance)
  - multi-entity / higher compliance
- **Payroll compliance needed** (multi-select): PF, ESI, PT, LWF, TDS, Form 16/24Q

### Step 3 — Payroll complexity (if payroll selected)
- **Attendance source**: built-in / biometric integration / third-party / manual
- **Edge cases** (multi): arrears, reversals, FnF, transfers, multiple salary structures
- **Approval controls**: maker-checker required? (yes/no)

### Step 4 — Budget model
- **Budget unit preference**:
  - PEPM (per employee per month)
  - Per user/month (recruiter/agent seats)
  - Quote-based is fine
- **Budget band (optional):** under ₹25 PEPM / ₹25–₹75 / ₹75–₹150 / ₹150+ / unknown
- **One-time implementation budget sensitivity:** low/medium/high

### Step 5 — Procurement constraints
- **GST invoicing required** (yes/no/unsure)
- **Data residency** (India required / India preferred / not required)
- **Support channel preference** (WhatsApp / phone / ticket / email)

### Step 6 — Integrations
- Must-have integrations (multi): Tally, Zoho Books, Google Workspace, Microsoft 365, Slack, HRMS/ATS cross-links

### Step 7 — Contact + delivery
- Deliver report via email (name + work email). Optional phone.
- Consent note (privacy-first).

---

## 3) Scoring & shortlisting logic (aligned to CONTENT_SPEC + VERIFICATION_POLICY)

### 3.1 Candidate set
- Start with tools in selected categories.
- Filter/boost for India-first where applicable.
- If user arrived from a tool page, include that tool regardless.

### 3.2 Hard gates (only when user explicitly requires)
Hard gates should be minimal to avoid false negatives.
- If **Data residency = India required** → remove tools explicitly marked `GLOBAL` with no India option; keep `UNKNOWN` but flag risk.
- If **GST invoicing required** → remove tools explicitly `NO`; keep `UNKNOWN` but flag risk.
- If **maker-checker required** (payroll) → keep only tools that claim it with evidence or mark unknown as “needs validation”.

### 3.3 Score components (0–100)

**A) Trust score (0–35)**
- Verified vendor/tool: +35
- Partially verified: +18
- Unverified: +6

Modifiers (from `VERIFICATION_POLICY.md`):
- Missing sources (0 sources): cap trust at 6
- Freshness:
  - lastCheckedAt ≤ 90d: no penalty
  - 90–180d: -8
  - >180d: -15 (and treat as effectively unverified)

**B) India readiness score (0–25)**
Based on `CONTENT_SPEC.md` India-first fields:
- Compliance tags match (PF/ESI/PT/LWF/TDS): up to +12
- GST invoicing requirement met: +5 (or -5 if explicit NO)
- Data residency match: +5
- WhatsApp support preference met: +3

Unknown handling:
- `UNKNOWN` never earns points; it earns a “validate” flag instead.

**C) Fit score (0–25)**
- Size band fit: +10
- Industry/workforce alignment (shifts/field staff): +8
- Implementation time fit: +7

**D) Economics score (0–15)**
- Pricing type alignment (PEPM vs per-user vs quote-based): +8
- Budget band alignment (if provided): +7

No false precision:
- If pricing is quote-based or unknown, do not estimate numbers; treat as “needs quote”.

### 3.4 Shortlisting
- Output: **3–5 primary recommendations** + **2 alternatives**.
- Ensure diversity:
  - don’t return 5 near-identical suites unless buyer asked for “suite only”.

### 3.5 Explainability (required)
Every recommended tool must show:
- “Why this fits” bullets tied to inputs
- “What to validate” checklist (especially for UNKNOWN fields)
- Trust row: verification level + sources count + last checked

---

## 4) Decision Report output structure (what the user receives)

**Format:** PDF + CSV appendices

### 4.1 Report cover
- Title: “HR Software Decision Report (India)”
- Date generated
- Company profile summary (size, industry, states)

### 4.2 Executive summary (1 page)
- Recommended stack (categories)
- Top 3–5 tools with one-line fit summary
- Key risks to validate (unknowns)

### 4.3 Your inputs (audit trail)
- Inputs table (label:value)

### 4.4 Shortlist table (comparison-ready)
Columns aligned to `CONTENT_SPEC.md`:
- Tool, Vendor
- Verification level
- Last checked
- Sources count
- Pricing type
- India fit flags (GST, residency, WhatsApp, compliance tags)
- Implementation time
- Key integrations

### 4.5 Tool pages (1–2 pages each)
For each shortlisted tool:
- Trust signals row
- Key facts grid
- India-first readiness block
- Pros / Cons
- “Why it fits” bullets
- “Validate next” checklist

### 4.6 Category decision appendix
For each selected category:
- Buying checklist
- Statutory/compliance notes (India)
- Common buying mistakes

### 4.7 Evidence appendix
- Sources list grouped by tool/vendor (URLs)
- “What Verified means” snippet aligned to `VERIFICATION_POLICY.md`

### 4.8 CSV export appendix
- A ready-to-use scorecard template (same schema as report shortlist table)

---

## 5) Trust signals & disclaimers

### Trust signals shown everywhere
- Verification level badge (always present)
- Sources count (if >0)
- Last checked date (if present)

### Disclaimers (required)
- “This report is a decision aid, not legal/tax advice.”
- “Pricing is normalized by unit (PEPM/per-user/quote-based). Numeric ranges are shown only when evidenced.”
- “Fields marked UNKNOWN require vendor confirmation; we do not guess.”
- “Verified means evidence-backed and checked recently (see policy).”

---

## 6) Upgrade paths (free vs gated vs vendor-intro)

### Free (no email)
- On-screen preview:
  - top 3 recommendations + 3 ‘validate next’ bullets
- CTA: “Email me the full report (PDF + CSV)”

### Gated (email required)
- Full report PDF + CSV delivered to email.
- Follow-up: 5-email sequence (re-use from funnel spec, tailored by category).

### Vendor-intro (high intent)
- Optional next step inside report:
  - “Request pricing/vendor intro for 1 best-fit vendor”
- Must use existing lead pipeline and privacy-first rules.

### Team/Enterprise upsell (optional)
- “Assisted evaluation pack”
  - vendor screening
  - RFP template
  - call to refine shortlist

---

## Phase-1 implementation checklist (no code in this doc)

### Pages/components touched (expected)
- Homepage CTA placement: `app/page.tsx`
- Category page CTA placement: `app/categories/[slug]/page.tsx`
- Tool detail CTA placement: `app/tools/[slug]/page.tsx`
- Report generation UI wrapper (new page or modal) must **not break routes**.

### Data requirements
- Ensure tool/vendor records populate:
  - verification level
  - last checked
  - sources count
  - pricing type
  - India-first fields

### QA
- Lead flow remains unchanged.
- Report preview does not block existing navigation.
- Unknown fields are shown as “Validate” not silently omitted.
