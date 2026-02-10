# HRSignal Lead Magnet Spec (V1)

## One irresistible asset

### Asset name
**India Payroll & HR Compliance Buying Kit (2026)**

### One-line value prop
A **buyer-ready kit** that lets an Indian SME/mid-market team **shortlist and compare payroll + HR stack vendors in 30 minutes**—with checklists, demo scripts, and an evidence-first scorecard aligned to HRSignal’s verification policy.

### Why this beats G2/SoftwareSuggest/Capterra on decision clarity
Those sites optimize for breadth and reviews. This kit optimizes for:
- **India statutory reality** (PF/ESI/PT/LWF/TDS/GST)
- **Month-end failure modes** (arrears, reversals, reconciliation)
- **Uniform comparable fields** (aligned to `CONTENT_SPEC.md`)
- **Evidence-first trust** (aligned to `VERIFICATION_POLICY.md`)

### Audience
- Founders / HR / Finance / Ops at India-first SMEs and multi-location teams.

---

## Kit deliverables (what user receives)

### Format
- **PDF** (primary) + **CSV** (scorecard template)

### Kit contents (outline)
1) **30-minute shortlist workflow** (1 page)
   - Pick category → define must-haves → shortlist 3–5 → compare → request demo/pricing
2) **Payroll & Compliance decision guide** (condensed)
   - Based on: `docs/categories/payroll_decision.md`
3) **Statutory checklist** (PF/ESI/PT/LWF/TDS/GST) (1–2 pages)
   - “What to verify” + red flags
4) **Month-end demo script** (1 page)
   - Arrears + reversals
   - Joiners/leavers/FnF
   - Maker-checker + lock periods
   - Exception lists
5) **Vendor evaluation scorecard (CSV + printable table)**
   - Criteria aligned with:
     - `VERIFICATION_POLICY.md` (sources, freshness, completeness)
     - India-first fields (GST invoicing, data residency, WhatsApp support, local partners)
     - Pricing normalization rules (PEPM vs one-time vs quote-based)
6) **Common stacks (India-first)** (1 page)
   - Core HR + Payroll
   - Core HR + Payroll + ATS
   - Payroll + Workforce mgmt

---

## Scorecard schema (CSV)

### Columns (exact)
- `Vendor`
- `Product`
- `Category`
- `Verification level` (Verified / Partially verified / Unverified)
- `Last checked (YYYY-MM-DD)`
- `Sources count`
- `Pricing type` (PEPM / Per user/month / One-time / Quote-based)
- `Pricing notes`
- `One-time fees notes`
- `India: PF/ESI/PT/LWF/TDS coverage` (free text or tags)
- `GST invoicing` (YES/NO/UNKNOWN)
- `Data residency` (INDIA/GLOBAL/CONFIGURABLE/UNKNOWN)
- `WhatsApp support` (YES/NO/UNKNOWN)
- `Local partners` (YES/NO/UNKNOWN)
- `Month-end controls` (0–5)
- `Arrears + reversals` (0–5)
- `Audit trail` (0–5)
- `Integrations/exports` (0–5)
- `Implementation plan` (0–5)
- `Notes`

### Filled example (sample row)
- Vendor: `ExampleVendor`
- Product: `ExamplePayroll`
- Verification level: `Partially verified`
- Pricing type: `Quote-based`
- Data residency: `UNKNOWN`

(Important: do not ship fake pricing numbers; only “notes” unless evidenced.)

---

## Category mapping (how it maps to HRSignal)

### Primary category
- Payroll + Compliance

### Secondary categories (kit includes cross-category blocks)
- Core HR (HRMS)
- Workforce management (attendance/leave/time)
- Expense/Benefits (optional appendix)

### Links embedded in PDF (existing flows, no new routes required)
- Browse payroll tools: `/tools?category=payroll`
- Browse vendors: `/vendors`
- Category decision page: `/categories/payroll`
- Guided shortlist: `/recommend`
- Compare leaders: `/compare?tools=...` (dynamic per page)

---

## Proof / credibility layer (how we sell it)
- “Built from real month-end failure modes”
- “Aligned to HRSignal Verification Policy”
- “Evidence-first: sources + freshness included”

---

## Phase 1 acceptance criteria
- One downloadable asset (PDF) + one editable scorecard (CSV)
- CTA placement does not disrupt navigation
- Leads captured via existing pipeline (no endpoint changes)
