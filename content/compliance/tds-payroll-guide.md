# TDS on Payroll (India) — Practical Buyer Guide for Payroll Software (Section 192)

TDS on salary is where payroll systems must behave like an accounting/compliance engine: not just compute monthly tax, but handle declarations, proofs, mid-year changes, multiple employers, arrears, and year-end documents. Buyers often accept “TDS supported” without validating the operational workflow—and that’s how year-end becomes a crisis.

This guide is vendor-agnostic and designed for vendor demos and internal evaluation.

> Scope note: Tax rules change frequently. Validate the current-year rules, rates, and employer obligations with your advisor.

---

## 1) What TDS on payroll actually covers

Under **Section 192** (salary TDS), the employer is responsible for deducting tax at source based on estimated annual taxable salary and employee declarations/proofs.

A payroll system must support:

- Annualized tax projection and monthly deduction schedule.
- Employee declarations (and proof collection workflow, if included).
- Regime selection logic (old/new, if you support both in your org policy).
- Handling HRA, LTA, deductions, and exemptions (as configured by your org).
- Mid-year changes (salary revisions, joining/exits, regime changes where allowed).
- Year-end outputs:
  - **Form 16** generation.
  - Return preparation data for **Form 24Q** (quarterly TDS return).

---

## 2) Key documents & outputs you should verify

### Form 16
Your payroll product should be able to:
- Generate Form 16 for employees.
- Preserve a locked final version for the financial year.
- Regenerate with audit trail (if corrections are needed).

### Form 24Q (quarterly TDS return support)
Even if filing happens via an external tool, payroll should provide:
- Quarter-wise employee-level TDS details.
- Challan/payment mapping support (at least as a report/export).

### Year-end reconciliation
You need reports that reconcile:
- Tax projected vs tax deducted.
- Month-wise deductions vs deposit references.
- Employee-level variance flags.

---

## 3) The operational workflow that matters in real life

### A) Declarations → projections
Employees declare investments/exemptions. Payroll uses these to project taxable income and compute monthly TDS.

Buyer checks:
- Can employees submit declarations in-system (or can HR import)?
- Are declaration categories configurable (your policy)?
- Does projection update immediately and visibly?

### B) Proof submission (if supported)
Many systems support proof upload/approval. Even if you don’t need upload UX, you need:

- A way to record proofs received/approved.
- Cutoff controls (freeze declarations after a date).

### C) Mid-year changes
These are the pain points:
- Salary revision effective mid-year.
- Employee joins mid-year.
- Employee exits mid-year.
- Bonus paid in a single month.

The software must show how it re-annualizes and redistributes TDS.

---

## 4) Arrears handling (buyer-critical)

Arrears are common: retro pay increases, attendance corrections, backdated allowances.

What to verify:
- Does the system annualize tax correctly after arrears?
- Can it show “arrears paid this month” and how tax changed because of it?
- Can you post arrears without rewriting previous months?
- Are there reports to explain the delta to the employee?

A common failure mode is sudden TDS spikes that are hard to explain. The system should provide a “why did my tax change?” view.

---

## 5) Common vendor gaps (and demo traps)

1) **No transparent projection math**
- They show a number, not the calculation.
- Fix: require a step-by-step projection breakdown.

2) **Weak join/exit logic**
- TDS schedule doesn’t reflow properly.
- Fix: simulate join in October; verify deductions November–March.

3) **No multiple-employer handling**
- Many employees have prior employer income in the same FY.
- Fix: check if you can import previous employer salary/TDS details for accurate annualization.

4) **Form 16 / 24Q are “coming soon”**
- Year-end is not optional.
- Fix: demand sample outputs and customer references.

5) **Arrears treated as separate income without proper annualization**
- Fix: run retro revision and validate.

---

## 6) Buyer validation checklist (copy/paste)

### Configuration & governance
- [ ] Supports current-year tax settings (regimes, slabs, cess, surcharge) or has a documented update mechanism.
- [ ] Role-based access for tax settings.
- [ ] Audit log for configuration changes.

### Employee inputs
- [ ] Declarations can be captured (self-serve or import).
- [ ] Proofs can be recorded/approved (or at least tracked).
- [ ] Cutoff/freeze controls exist.

### Calculation behavior
- [ ] Monthly TDS is derived from annual projection and is explainable.
- [ ] Mid-year salary revisions reflow TDS correctly.
- [ ] Join/exit mid-year is handled.
- [ ] Bonus / variable pay months don’t break projections.
- [ ] Arrears adjust TDS with clear explanation.

### Outputs & filing support
- [ ] Form 16 generation is available and accurate.
- [ ] 24Q-support exports/reports exist (quarterly details).
- [ ] Reconciliation reports exist (deducted vs projected, month-wise, employee-wise).

---

## 7) Demo scenarios to demand

1) **Mid-year joiner**
- Employee joins Oct 15; show tax projection and monthly TDS schedule.

2) **Mid-year salary revision**
- Increase CTC effective Dec 1; show projection update and revised TDS.

3) **Arrears run**
- Retro revision effective Aug 1 paid in Jan; show TDS impact explanation.

4) **Previous employer income**
- Input prior employer income and TDS; show correct projection.

5) **Form 16 preview**
- Generate Form 16 for a sample employee; show locking and regeneration audit trail.

---

## 8) What “TDS-ready” looks like

A TDS-ready payroll system is:

- **Explainable**: projections are transparent.
- **Operational**: declarations, proofs, cutoffs supported.
- **Resilient**: joins/exits, variable pay, and arrears don’t break it.
- **Year-end complete**: Form 16 + 24Q support exists.
- **Reconciliable**: reports match deposits and registers.

If a vendor can’t show the above with your real-world patterns (variable pay, revisions, arrears), treat “TDS supported” as marketing—not a compliance capability.
