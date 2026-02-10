# HRSignal — Lead Magnet UI Flow (V1)

**Lead magnet:** HR Software Decision Report (India)  
**Source of truth:** `docs/LEAD_MAGNET_DECISION_REPORT.md` + `docs/CONTENT_SPEC.md` + `docs/VERIFICATION_POLICY.md`  
**Constraint:** No code changes in this spec; preserve existing navigation and lead submission pipeline.

---

## 1) Entry CTAs + exact copy (non-disruptive)

### A) Homepage (`/`)
**Placement:** Hero CTA cluster (secondary CTA next to “Get recommendations”).
- Primary CTA (existing): **Get recommendations**
- Secondary CTA (new): **Generate Decision Report**
- Microcopy under CTA: “Evidence-first shortlist + India fit + pricing model clarity.”

**Fallback link (text):** “Prefer browsing? View Tools directory →”

### B) Category pages (`/categories/[slug]`)
**Placement:** Top CTA row.
- Button: **Generate report for this category**
- Microcopy: “Shortlist 3–5 tools with verification + evidence included.”
- Prefill: category = current slug.

### C) Tool detail pages (`/tools/[slug]`)
**Placement:** Near pricing block or trust row.
- Link/button: **Compare in a Decision Report**
- Microcopy: “Add this tool and generate an evidence-first shortlist.”
- Prefill: include current tool slug as “considering”.

### D) Vendors list (`/vendors`) (optional, low priority)
**Placement:** Small inline card above list.
- CTA: **Generate Decision Report**
- Microcopy: “Use when comparing multiple categories (Core HR + Payroll + ATS).”

---

## 2) Step-by-step question screens (max 8)

**Design principles**
- One question per screen.
- Progress indicator: “Step X of Y”.
- Defaults and “Skip” where safe.
- No long paragraphs; use short helper text.

### Screen 1 — Scope
**Question:** “What are you evaluating?”
- Multi-select categories:
  - Core HR (HRMS)
  - Payroll + Compliance
  - ATS (Recruitment)
  - BGV
  - LMS
  - Performance / OKRs
  - Workforce management
  - HR service delivery
  - Expense / Benefits

**Helper text:** “Pick 1–3. You can generate multi-category stacks too.”

**Validation**
- Must select at least **1** category.

---

### Screen 2 — Company profile
**Question:** “Your company profile”
- Company size (required): 1–20 / 20–200 / 50–500 / 100–1000 / 1000+
- Industry (required): IT/ITES, Manufacturing, Retail, BFSI, Logistics, Hospitality, Healthcare, Other
- Workforce type (optional multi): office-only, field staff, shifts/rotational, contractors

**Validation**
- Size required.
- Industry required.

---

### Screen 3 — Compliance exposure (India)
**Question:** “Compliance exposure (India)”
- States of operation (optional multi)
- Statutory complexity (required):
  - Basic (single state)
  - Multi-state (PT/LWF variance)
  - Multi-entity / higher compliance
- Payroll compliance needed (optional multi): PF, ESI, PT, LWF, TDS, Form 16/24Q

**Validation**
- Statutory complexity required.

---

### Screen 4 — Category-specific complexity (conditional)
**Shown if Payroll selected**
- Attendance source (required): built-in / biometric / third-party / manual
- Edge cases (optional multi): arrears, reversals, FnF, transfers, multiple salary structures
- Controls (optional): maker-checker required? yes/no

**Shown if ATS selected** (example)
- Hiring volume (required): low / medium / high
- Must-have (optional): scorecards, offer approvals, reporting

**Validation**
- Only the “required” fields for the selected category must be answered.

---

### Screen 5 — Budget model
**Question:** “Budget model”
- Budget unit preference (required):
  - PEPM (per employee/month)
  - Per user/month
  - Quote-based is fine
- Budget band (optional): under ₹25 PEPM / ₹25–₹75 / ₹75–₹150 / ₹150+ / unknown
- One-time implementation budget sensitivity (optional): low/medium/high

**Validation**
- Budget unit preference required.

---

### Screen 6 — Procurement constraints
**Question:** “Procurement constraints”
- GST invoicing required (required): Yes / No / Unsure
- Data residency (required): India required / India preferred / Not required
- Support preference (optional multi): WhatsApp, phone, ticket, email

**Validation**
- GST question required.
- Data residency required.

---

### Screen 7 — Integrations
**Question:** “Must-have integrations”
- Multi-select: Tally, Zoho Books, Google Workspace, Microsoft 365, Slack, Other

**Validation**
- Optional; allow continue with none.

---

### Screen 8 — Delivery
**Question:** “Where should we send the report?”
- Name (required)
- Work email (required)
- Phone (optional)
- Consent checkbox (required): “I agree to be contacted about this report and vendor intro (no spam).”

**Validation**
- Name required
- Email must be valid
- Consent required

---

## 3) Validation rules (global)

- Any missing required field blocks continue with an inline message.
- Errors must be actionable (“Select at least one category”, “Enter a valid work email”).
- Never show ambiguous failures. If submission fails, show the API error (if 400) or a retry message.

---

## 4) Result states (shortlist + explainability + next actions)

### Result State A — Success (full report generated)
**Page header:** “Your Decision Report is ready”

**Above-the-fold blocks (scannable):**
1) **Executive summary** (key facts rows)
   - Categories evaluated
   - Company size + complexity
   - Top recommendation
2) **Shortlist table** (comparison-ready)
   Columns aligned with `CONTENT_SPEC.md`:
   - Tool / Vendor
   - Verification level (badge always)
   - Last checked (if available)
   - Sources count (if >0)
   - Pricing type (normalized)
   - India fit flags (GST, residency, WhatsApp, compliance tags)

3) **Why these are recommended**
   - 3–5 bullets tied to inputs

**Next actions (do not change core flows)**
- CTA 1: “Compare shortlisted tools” → `/compare?tools=a,b,c`
- CTA 2: “Get recommendations” → existing `/recommend` flow
- CTA 3: “Request pricing/vendor intro” → existing lead flow (same endpoint)

---

### Result State B — Preview only (free)
If user hasn’t provided email yet:
- Show top 3 tools + 3 “validate next” bullets.
- CTA: “Email me the full report (PDF + CSV)”

---

### Explainability requirements per tool card (in report)
For each tool shown:
- “Why this fits” (2–4 bullets)
- “Validate next” (2–4 checklist items)
- Trust signals row:
  - Verification badge (always)
  - Sources count (if >0)
  - Last checked date (if present)

---

## 5) Trust messaging placement

### Always visible (top of results)
A compact trust bar:
- “Verified = evidence-backed and checked recently” (link to policy page)
- “We never guess: UNKNOWN fields are flagged for validation”

### Near pricing blocks
- “Pricing is normalized by unit (PEPM/per-user/quote-based). Numeric ranges shown only when evidenced.”

### Near India readiness
- “India fit fields (GST, residency, compliance tags) are shown as YES/NO/UNKNOWN with sources when available.”

---

## 6) Fallback states

### Fallback 1 — No match
**When:** filters/hard gates exclude everything.

**UI:**
- Title: “No exact matches yet”
- Explain why (bullet list):
  - e.g., “India data residency required” + “GST invoicing required” + “maker-checker required”
- Actions:
  - “Relax constraints” (go back to relevant step)
  - “Show partially verified tools” (toggle)
  - “Get recommendations” → `/recommend`

### Fallback 2 — Partial match
**When:** only partially verified/unverified tools remain.

**UI:**
- Title: “Partial matches found”
- Show shortlist but include prominent “Validate next” checklists.
- Trust bar emphasizes:
  - “Partially verified means some evidence exists, but key fields may be unknown or stale.”

### Fallback 3 — Unknown-heavy results
**When:** many fields are UNKNOWN.

**UI:**
- Display “Validation checklist” section before shortlist table.
- CTA: “Request a sanity-check intro” (existing lead flow)

---

## Notes on preserving existing flows
- This flow can be implemented as a **new UI wrapper** around existing lead capture semantics.
- Do not change:
  - `/api/leads`
  - existing lead success UI behavior
  - `/recommend` route and results routing
