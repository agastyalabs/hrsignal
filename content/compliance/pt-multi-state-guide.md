# Professional Tax (PT) Multi-State Guide for Payroll Software Buyers (India)

Professional Tax (PT) is deceptively simple in a single-state setup and painful in a multi-state org. Rates vary by state, slabs can change, registration requirements differ, and filing frequency is not uniform. For payroll software buyers, PT is a “credibility test”: if the product handles PT cleanly, it usually handles other India-local complexity too.

This guide is vendor-agnostic and demo-ready.

> Scope note: PT is state legislation. Always confirm current slabs, forms, and filing frequencies for your states with your advisor.

---

## 1) Why PT is hard in payroll systems

PT differs from PF/ESI/TDS in three ways:

1) **State-by-state variability**: slabs, exemptions, and rules differ.
2) **Operational diversity**: registration, payment, and returns differ.
3) **Employee mobility**: location changes can alter PT liability.

A payroll product that assumes “one PT slab table” will fail for multi-state companies.

---

## 2) Core capabilities to require from payroll software

### A) Multi-state PT configuration
You need:

- State-wise PT slab configuration.
- Effective-date versioning (slabs change).
- Ability to assign employees to a **work location** (state) for PT purposes.
- Support for multiple registrations (if you operate multiple establishments within a state or different registrations).

### B) Employee-level PT logic
Payroll should:

- Compute PT based on employee’s state and salary basis.
- Support exemptions/edge cases (e.g., based on categories where applicable).
- Handle location changes mid-year without manual recalculation chaos.

### C) Filing and payment workflow support
At minimum, the system should provide:

- Month-wise PT liability by state/registration.
- Employee-wise PT deduction register.
- Exportable return formats (or at least clean CSVs) per state.

Even if the filing is done outside the product, exports must be reliable.

---

## 3) Multi-state reality: how to map employees

The single most important modeling decision is **how employees are assigned to a PT state**.

Recommended approach:

- Maintain a “PT work state” field in employee master.
- Define how you treat:
  - Remote employees,
  - Employees traveling/seconded,
  - Hybrid arrangements.

During evaluation, ask the vendor:

- Is PT state derived from branch/location? Can it be overridden?
- Is there an effective date for changes?
- Can you bulk update location changes safely (with audit log)?

---

## 4) Common vendor gaps and how to detect them

1) **No effective-dated slabs**
- Gap: cannot apply mid-year changes.
- Demo test: change slab effective from a date; rerun payroll for two months.

2) **PT is computed on gross only**
- Gap: some setups compute PT based on specific salary definitions.
- Demo test: employee has reimbursements/variable pay; confirm PT wage basis.

3) **No registration-level breakdown**
- Gap: multi-location within a state needs registration-wise totals.
- Demo test: two registrations in the same state (or simulate with two branches).

4) **No employee movement handling**
- Gap: location change causes double tax or missed tax.
- Demo test: employee moves from State A to State B; verify deduction logic.

5) **Exports are not aligned to return needs**
- Gap: you still end up manually shaping data.
- Demo test: ask for a state return export preview.

---

## 5) Practical buyer checklist (use during vendor selection)

### Configuration & governance
- [ ] State-wise PT slabs supported.
- [ ] Slabs are effective-dated/versioned.
- [ ] Multiple PT registrations supported (if needed).
- [ ] Configuration changes have audit logs + permissions.

### Employee mapping
- [ ] Employee PT state is explicit and reportable.
- [ ] Supports overrides and effective-dated changes.
- [ ] Bulk updates with audit trail.

### Calculation
- [ ] PT computed per employee based on correct wage basis.
- [ ] Handles location changes and avoids double deduction.
- [ ] Edge-case handling documented (exemptions, thresholds, minimums).

### Reporting
- [ ] State-wise monthly PT liability report.
- [ ] Employee PT deduction register exportable.
- [ ] Registration-wise totals where applicable.

### Operational fit
- [ ] Supports lock/reopen cycles safely.
- [ ] Reruns don’t rewrite history silently.

---

## 6) Demo scenarios (ask vendors to run these)

1) **Two states, different slabs**
- Employees in State A and State B with same gross salary; show different PT.

2) **Slab change effective date**
- Modify slab effective from next month; verify old month unchanged.

3) **Employee moves state**
- Change PT state effective mid-month or next month; show impact.

4) **Multiple registrations within a state**
- Assign employees to Registration 1 vs 2; show separate totals.

5) **Export**
- Provide PT register export that your compliance team can map to state return.

---

## 7) Decision guidance: what to prioritize

If you operate in multiple states, prioritize:

- **Correct modeling** (employee PT state + effective dates).
- **Governance** (audit logs, permissions).
- **Exports** (clean, consistent return-ready data).

PT won’t usually be the biggest money line item, but it is one of the most visible “India complexity” signals. If a vendor is vague on PT, expect similar gaps elsewhere.
