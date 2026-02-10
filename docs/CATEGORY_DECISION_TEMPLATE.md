# HRSignal — Category Decision Page (Master Template)

Use this template to create a **Category Decision Page** for every HR category in HRSignal.

**Design goals**
- India-first, buyer-focused, scannable (no doc-dumps).
- Consistent, comparable fields across categories.
- Strong internal linking to `/tools`, `/vendors`, and `/compare`.

**Trust alignment**
- Verification and evidence rules must align with `docs/VERIFICATION_POLICY.md`.
- Pricing normalization must align with `docs/CONTENT_SPEC.md`.

---

## 0) Category metadata (required)
- **Category slug:** `<slug>`
- **Category name:** `<name>`
- **Related categories:** `<core pairs>` (e.g., Core HR ↔ Payroll)
- **Primary buyer persona:** Founder / HR / Finance / Ops

---

## 1) India-specific intro context (required)
**Purpose:** explain why this category matters in India and what “India-ready” means.

### Context bullets (2–5)
- Example: Multi-state operations require policy + statutory flexibility.
- Example: Audit trail and exports matter for compliance and disputes.

### India-first nuance (1–3)
- Mention India-only constraints: PF/ESI/PT/TDS, state-wise PT slabs, consent/audit, data residency.

---

## 2) Who this category is for (required)

### Company size fit (required)
- **20–200:** `<what matters>`
- **50–500:** `<what matters>`
- **100–1000:** `<what matters>`
- **1000+:** `<what matters>`

### Industries / operating models (optional but recommended)
- Manufacturing
- Retail
- IT/ITES
- BFSI / regulated
- Distributed/field workforce

### “Not ideal if…” (optional)
- 2–4 bullets.

---

## 3) Buying checklist (required)
**Rule:** checklist must be scannable; no paragraphs.

### Checklist (8–15 items)
Use this format:
- **Requirement** — what to ask vendors to demo/confirm

Examples:
- **Workflow demo** — show joiner → Day 30 flow end-to-end
- **Approvals** — maker-checker + audit trail
- **Exports** — CSV exports and reconciliation reports

---

## 4) Statutory & compliance notes (India) (required where applicable)

### Applicable statutory/compliance areas
List only what applies to the category:
- PF / ESI
- PT (state-wise)
- TDS (Form 16/24Q)
- LWF
- Consent + audit requirements
- Data residency

### What to verify (3–8 bullets)
- **Evidence-backed** checks only.
- If unknown, mark as `UNKNOWN` and downgrade trust where necessary.

---

## 5) Pricing models + realistic ranges (required)

### Pricing model normalization
Use HRSignal normalized pricing types (from `docs/CONTENT_SPEC.md`):
- **PEPM**
- **Per user/month**
- **One-time**
- **Quote-based**

### Ranges policy (non-negotiable)
- Only show numeric ranges when you have **evidence URLs** supporting them.
- Never fake precision.

### Category-specific pricing patterns
Use this structure:
- **Typical pricing unit:** `<PEPM / Per user/month / Quote-based>`
- **What drives pricing:** `<employees / recruiters / locations / modules>`
- **Implementation fees:** `<common one-time costs>`

If you have evidence-based numbers, add:
- **Indicative range:** `₹X–₹Y` with a citation in Sources.

---

## 6) Top vendor evaluation signals (aligned to VERIFICATION_POLICY.md)

### Verified Vendor minimums (must check)
A vendor should be considered “top tier” for this category only if it meets:
- `verificationLevel = Verified`
- `lastCheckedAt` within freshness window
- `sources[]` includes at least one credible URL
- India-first fields explicitly set (YES/NO/UNKNOWN):
  - GST invoicing
  - Data residency
  - WhatsApp support
  - Local partners
- At least one **published tool** in this category

### Category-specific signals (choose 5–8)
Examples:
- **Evidence quality**: pricing + security + support pages cited
- **Freshness**: checked within 90 days
- **India readiness**: statutory coverage + escalation model
- **Implementation**: clear onboarding plan + partner network
- **Exports + audit**: supports reconciliation and dispute workflows

---

## 7) Common buying mistakes (required)
**Rule:** 5–10 bullets, highly practical.

Examples:
- Buying before requirements are written down
- Skipping parallel run (for payroll)
- Choosing based on UI polish only, ignoring policy engine
- Not checking GST invoicing and billing entity early
- Assuming “India-ready” without evidence

---

## 8) Internal linking rules (required)

### Linking principles
- Always provide a next action:
  - **Browse tools** (pre-filtered)
  - **Compare leaders**
  - **Browse vendors**
  - **Get recommendations**

### Required link placements
- Top CTA row:
  - `/tools?category=<slug>`
  - `/compare?tools=<a,b,c>` (top 2–5)
- Mid-page (after checklist):
  - link to 1–2 related categories
- Bottom:
  - `/vendors` filtered (if available) or `/vendors` + anchors
  - `/recommend`

### Anchor linking
- Use anchors for scannability:
  - `#leaders`, `#checklist`, `#pricing`, `#compliance`, `#mistakes`, `#sources`

---

## Appendix: Category-specific starters (fill these per category)

Below are the categories HRSignal must support. For each, create a decision page using the template sections above.

### Core HR (HRMS)
- India context: employee lifecycle + documents + approvals; payroll handoff.
- Checklist focus: RBAC, workflows, exports, onboarding.
- Compliance: data residency, audit trail.
- Pricing: often PEPM or quote-based.

### Payroll
- India context: PF/ESI/PT/TDS/LWF, arrears, month-end controls.
- Checklist focus: statutory reports, maker-checker, reconciliation.
- Compliance: PF/ESI/PT/TDS, audit.
- Pricing: PEPM + onboarding fee, often quote-based.

### ATS (Recruitment)
- India context: hiring velocity, stakeholder approvals, offer workflow.
- Checklist focus: pipeline, scorecards, email/calendar integration.
- Pricing: often per user/month (recruiter seats), quote-based for enterprise.

### BGV (Background verification)
- India context: coverage, consent, audit trails.
- Checklist focus: TAT, dispute workflows, export/API.
- Pricing: per check or quote-based; may be one-time integrations.

### LMS (Learning)
- India context: onboarding + compliance training.
- Checklist focus: reporting, mobile learning, SSO.
- Pricing: PEPM or per user/month.

### Performance / OKRs
- India context: cycles, calibration readiness, manager adoption.
- Checklist focus: templates, check-ins, reporting.
- Pricing: PEPM / per user/month.

### HR service delivery (Helpdesk)
- India context: employee case mgmt; WhatsApp/phone workflows matter.
- Checklist focus: SLA, routing, knowledge base, integrations.
- Pricing: per agent/month.

### Workforce management
- India context: shifts, locations, field staff; device/offline handling.
- Checklist focus: policy engine, overtime, exceptions.
- Pricing: PEPM.

### Expense / Benefits
- India context: reimbursements, GST invoices, payroll integration.
- Checklist focus: approval flows, policy controls, exports.
- Pricing: per user/month or quote-based.
