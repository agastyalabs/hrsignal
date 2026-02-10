# Payroll & Compliance Software (India) — Decision Guide (HRSignal)

**Category:** Payroll + Compliance  
**Purpose:** Help Indian teams shortlist payroll software that stays accurate at month-end, supports statutory compliance, and scales across states.

---

## 1) India-specific intro context
Payroll in India is not just “salary calculation” — it’s a compliance engine.

**Why this category is hard in India (and why buyers get burned):**
- **State-wise variance**: PT slabs, LWF rules, and location-specific policy handling.
- **Edge cases dominate**: arrears, reversals, backdated changes, FnF, and transfers.
- **Audit + traceability**: every manual edit must be explainable (who/what/when/why).
- **Integration reality**: attendance, HRMS, and accounting (Tally/Zoho Books) often break month-end.

**India-first definition (for HRSignal):**
A payroll tool is “India-ready” only if statutory workflows and reporting are clearly supported **with evidence** (not implied).

---

## 2) Who this category is for

### SME (20–200 employees)
Best for teams that need:
- Clean payroll processing + basic statutory outputs
- Simple approvals and salary structure management
- Smooth HRMS/attendance handoff

**Typical industries:** IT/ITES, professional services, early manufacturing, startups.

### Mid-market (200–1000 employees)
Best for teams that need:
- **Multi-location** policies (shifts, leave, LOP) feeding payroll reliably
- Strong approval chain and audit trail
- Reliable arrears + retro changes handling

**Typical industries:** retail chains, multi-site manufacturing, BFSI support ops, logistics.

### Enterprise (1000+ employees / multi-entity)
Best for teams that need:
- Multi-entity compliance, strict permissions, and audit controls
- Deeper integrations, exports, and reconciliation workflows
- Implementation partners and stronger SLAs

**Typical industries:** large manufacturing, BFSI, multi-entity groups, high-compliance sectors.

**Not ideal if…**
- You want a “set-and-forget” tool without policy definition and data hygiene.
- Your attendance/shift policies are unclear (garbage in → garbage out).

---

## 3) Buying checklist (India-first)
Use this as a demo script + requirements checklist.

### Workflow correctness (must demo)
- **End-to-end run**: attendance import → payroll calc → approvals → bank file → reports
- **Arrears + reversals**: backdated salary revision and reversal handling
- **Joiners/leavers + FnF**: last working day, notice period, settlement
- **Transfers**: location/department change affecting PT/LWF

### Controls & auditability
- **Maker-checker** for payroll finalization
- **Audit trail** for any manual override (field-level if possible)
- **Lock periods** post-approval (to prevent silent changes)
- **Exception lists**: missing bank/UAN, invalid PAN, attendance anomalies

### Reporting & exports
- **Statutory reports**: PF/ESI/PT/LWF/TDS-related outputs (see compliance section)
- **Reconciliation reports**: month-over-month diffs, component changes
- **Export formats**: CSV and accounting-ready exports

### Integrations (don’t skip)
- HRMS master data sync
- Attendance/shifts/leave source of truth
- Accounting integration (Tally/Zoho Books) or reliable export

### Support & rollout
- Implementation plan (timeline + responsibilities)
- Parallel run recommendation (at least 1 cycle for changes)
- Escalation path and SLA

---

## 4) Statutory & compliance notes (India)

### PF (Provident Fund)
What to verify:
- Employer/employee contribution logic and ceilings
- UAN handling and validation
- PF reporting outputs (as applicable) and audit trail

### ESI
What to verify:
- Eligibility thresholds + period rules
- ESI calculation handling and reporting

### PT (Professional Tax)
What to verify:
- State-wise PT slab support
- Location mapping and transfer handling

### LWF (Labour Welfare Fund)
What to verify:
- State-wise applicability
- Periodic calculation and reporting

### TDS (Income Tax / payroll tax)
What to verify:
- Declaration workflow + proofs collection (if included)
- Year-end handling (e.g., Form 16 workflows) if the tool claims it

### GST (billing/invoicing)
This is often overlooked during buying.
What to verify:
- **GST invoicing support** (vendor billing entity, GSTIN on invoices)
- Payment terms and procurement requirements

### Compliance evidence rule (HRSignal)
If a vendor claims compliance support, it must be backed by **sources** (official docs/pages). If not, treat as `UNKNOWN` and downgrade verification.

---

## 5) Pricing models + realistic ranges (India)

### Pricing types you’ll see
- **PEPM** (per employee per month) — common for payroll/HRMS bundles
- **Quote-based** — very common (especially when statutory scope + multi-location varies)
- **One-time costs** — implementation/setup/migration (almost always exists)

### Realistic (buyer-side) expectations
> These are **indicative** market patterns; do not treat as promised pricing. Always confirm with evidence/quotes.

**Recurring subscription**
- SMEs often see PEPM-style pricing, but many vendors still quote annually.
- For mid/enterprise, quote-based is common due to policy and integration complexity.

**One-time costs (implementation/migration)**
- Expect one-time setup for:
  - policy configuration
  - salary structures
  - statutory mappings
  - data migration
  - integrations

**Range policy (HRSignal)**
- Only publish numeric ranges if backed by cited sources.
- Otherwise, display pricing as:
  - `Quote-based` + “Contact vendor / request quote”
  - and separately note “implementation/setup fees may apply”.

---

## 6) Top vendor evaluation signals (aligned with VERIFICATION_POLICY.md)
Use these signals to score vendors quickly.

### HRSignal “Verified Vendor” baseline (must meet)
- Verification level: **Verified**
- `lastCheckedAt` within freshness window
- `sources[]` present (>=1 credible official URL)
- India-first fields explicitly set (YES/NO/UNKNOWN):
  - GST invoicing
  - data residency
  - WhatsApp support
  - local partners
- At least one published payroll/compliance tool listing on HRSignal

### Payroll-specific signals (prioritize these)
- **Month-end controls**: lock periods, approvals, exception lists
- **Arrears correctness**: backdated revisions and reversals demoed
- **Multi-state readiness**: PT/LWF handling with location mappings
- **Audit trail depth**: field-level changes + who approved
- **Exports + reconciliation**: diffs, audit reports, accounting exports
- **Implementation maturity**: playbooks + partner network, not ad-hoc setup
- **Support escalation**: clear SLA and India business hours support

---

## 7) Common buying mistakes (India)
- Buying before policies are defined (LOP, shifts, cutoffs)
- Skipping a parallel run (especially when switching payroll vendors)
- Assuming statutory coverage without checking evidence pages/docs
- Ignoring PT/LWF edge cases for multi-state teams
- Underestimating data cleanup (PAN/UAN/bank details)
- Allowing manual overrides without audit trail
- Treating accounting export as “later” (it becomes the month-end bottleneck)

---

## 8) Internal linking rules (HRSignal)

### Primary next actions
- **Browse payroll tools directory:**
  - `/tools?category=payroll`
- **Browse vendors:**
  - `/vendors`
- **Get recommendations (guided shortlist):**
  - `/recommend`

### Compare CTA rules
- When there are 2–5 leader tools available, link:
  - `/compare?tools=<slug1,slug2,slug3>`

### Related category links (common stacks)
Payroll rarely lives alone:
- Core HR (HRMS) + Payroll:
  - `/categories/hrms`
- Workforce management (attendance/leave/time) + Payroll:
  - `/categories/attendance`

### Placement on page
- Top CTA row: directory + recommendations
- After checklist: compare + vendors
- Bottom: related categories + resources

---

## Suggested CTA copy (consistent)
- “Browse payroll tools”
- “Compare top tools”
- “Get recommendations”
- “Request demo/pricing” (only where lead flow exists)
