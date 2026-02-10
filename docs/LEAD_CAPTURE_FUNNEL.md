# HRSignal Lead Capture Funnel (V1)

This funnel uses **existing pages and lead submission pipeline** (no endpoint/routing changes). It adds conversion-focused CTAs and a tight follow-up sequence.

Truth sources:
- `docs/CONTENT_SPEC.md`
- `docs/VERIFICATION_POLICY.md`
- `docs/CATEGORY_DECISION_TEMPLATE.md`
- `docs/UI_DECISION_REDESIGN_PLAN.md`
- `docs/LEAD_MAGNET_SPEC.md`

---

## 1) Core CTA

### Primary lead magnet CTA
**“Get the India Payroll & HR Compliance Buying Kit (PDF + Scorecard)”**

### Supporting microcopy (one line)
“Shortlist and compare payroll vendors in 30 minutes. Evidence-first and India-ready.”

---

## 2) CTA placements (exact) — no navigation disruption

### A) Homepage (`/`)
**Placement 1: Hero (secondary CTA, next to Get recommendations)**
- Button: “Download Buying Kit”
- On click: scroll to existing lead capture block OR open a modal using the existing lead endpoint.
- Form fields (use existing lead submission):
  - name
  - email (preferred)
  - companyName (optional)
  - useCase preset = `"Buying Kit: Payroll & Compliance"`

**Placement 2: Below trust strip / logos**
- Inline card CTA: “Get the kit + scorecard”

### B) Tools directory (`/tools`)
**Placement: Above results count (right side)**
- Text link: “Need a faster shortlist? Get the Buying Kit →”
- Avoid replacing existing “Prefer guided shortlist?” link.

**Placement: Empty state**
- If no results: show CTA card
  - “Download the Buying Kit”
  - “Or get recommendations”

### C) Vendors directory (`/vendors`)
**Placement: Above vendor grid**
- Small card (non-sticky):
  - Title: “Evaluating payroll vendors?”
  - CTA: “Download Buying Kit”

### D) Category decision page (`/categories/payroll`)
**Placement 1: Top CTA row**
- Third CTA (text button): “Download Buying Kit”

**Placement 2: After ‘Buying checklist’ section**
- Card CTA: “Want the scorecard template?”
- CTA: “Download PDF + CSV”

**Placement 3: Bottom**
- Reminder CTA + link to `/recommend`

### E) Tool detail pages (`/tools/[slug]`)
**Placement: Near pricing block**
- Small inline text CTA: “Use our scorecard (PDF + CSV) to compare vendors →”

---

## 3) Capture behavior (keep lead flow unchanged)

### Submission
- Use existing `/api/leads` behavior.

### Success state (copy)
- “Thanks — we’ll reach out soon.”
- Add secondary line:
  - “We’ll email you the kit + scorecard shortly.”

### Failure state
- Only show actionable validation errors (HTTP 400 messages).

---

## 4) Email sequence (5 emails)

**Rule:** practical buyer language; no fluff.

### Email 1 — Delivery + next step (Day 0)
Subject: “Your India Payroll & Compliance Buying Kit (PDF + Scorecard)”
- Link to PDF
- Link to CSV
- 3-step usage:
  1) shortlist 3 vendors
  2) run demo script
  3) score + compare
- CTA: “Get recommendations” → `/recommend`

### Email 2 — Month-end failure modes (Day 1)
Subject: “The 7 month-end payroll failures to demo (India)”
- Bullets: arrears, reversals, lock periods, exception lists, transfers, FnF, statutory reporting
- CTA: “Compare leaders” → `/categories/payroll`

### Email 3 — Statutory compliance cheat sheet (Day 3)
Subject: “PF/ESI/PT/LWF/TDS: what to verify (and what to mark UNKNOWN)”
- Checklist summary
- Evidence rule reminder
- CTA: “Browse payroll tools” → `/tools?category=payroll`

### Email 4 — Evaluation scorecard walkthrough (Day 5)
Subject: “How to use the scorecard to pick a payroll vendor in 30 minutes”
- Explain scoring columns
- Recommend 2 passes: must-haves then weights
- CTA: “Browse vendors” → `/vendors`

### Email 5 — Offer help / vendor intro (Day 7)
Subject: “Want us to sanity-check your shortlist?”
- Ask 3 questions (size, states, modules)
- CTA: “Request intro/pricing” (existing lead CTA) and `/recommend`

---

## 5) Export formats

### PDF
- Name: `HRSignal_India_Payroll_Compliance_Buying_Kit_2026.pdf`
- Includes: workflow + checklist + demo script + scoring table

### CSV
- Name: `HRSignal_Payroll_Vendor_Scorecard_Template.csv`
- Columns as defined in `docs/LEAD_MAGNET_SPEC.md`

---

## 6) Phase-1 implementation checklist (minimal; no code here)

### Components/pages likely to touch
- `app/page.tsx` (homepage CTA card/button)
- `app/tools/page.tsx` (directory inline CTA)
- `app/vendors/page.tsx` (vendor directory CTA)
- `app/categories/[slug]/page.tsx` (category decision CTA placements)
- `app/tools/[slug]/page.tsx` (tool detail inline CTA)
- `components/ui/Button.tsx` (ensure consistent button variants)
- `components/ui/Card.tsx` (CTA card style)

### Assets/content
- Add downloadable assets under:
  - `public/lead-magnets/` (PDF + CSV)

### QA checklist
- Lead submission still hits `/api/leads`
- Success state displays even if email sending fails
- No CTA breaks navigation or replaces primary flows
