export type ResourceArticle = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Markdown-ish content */
  content: string;
};

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    slug: "hrms-selection-india-sme",
    title: "How to pick an HRMS for an Indian SME",
    summary:
      "A fast framework to shortlist HRMS vendors: size band, onboarding flows, document management, and India compliance basics.",
    tags: ["HRMS", "Buyer guide", "India"],
    date: "2026-02-01",
    content: `# How to pick an HRMS for an Indian SME

Buying HR software is less about features and more about fit: your headcount, compliance needs, and how HR actually operates day-to-day.

## 1) Start with your size band

- 20–100 employees: keep setup lightweight; focus on onboarding, documents, attendance basics.
- 100–500 employees: approvals, policies, role-based access, and integrations matter.
- 500+: multi-entity, advanced permissions, and audit trails become non-negotiable.

## 2) Map your onboarding flow

Write down what happens from offer acceptance → Day 30:

- Offer letter + joining kit
- Document collection (PAN, Aadhaar, bank details)
- Policy acknowledgements
- Asset allocation

## 3) India readiness checklist

- Payroll support or clean integration with payroll
- PF / ESI / PT (state-wise) support
- TDS, Form 16, year-end processing
- Strong leave & attendance policy engine

## 4) Demos: ask for the "messy" cases

Ask vendors to demo:

- A backdated salary revision
- An employee transfer between locations
- Notice period + FnF

## 5) Decide with a 1-page scorecard

Create a simple rubric:

- Fit for size band (0–5)
- India compliance readiness (0–5)
- UX for HR + managers (0–5)
- Integration readiness (0–5)

If you want, use HRSignal to get an explainable shortlist based on your company profile.
`,
  },
  {
    slug: "payroll-compliance-checklist",
    title: "Payroll + compliance checklist (India)",
    summary:
      "PF/ESI/PT/TDS readiness, approvals, bank integrations, and month-end accuracy checks — a practical checklist for HR teams.",
    tags: ["Payroll", "Compliance", "Checklist"],
    date: "2026-01-22",
    content: `# Payroll + compliance checklist (India)

Use this as a month-end / implementation checklist.

## Foundations

- Confirm legal entities, locations, and state mappings
- Configure salary structures (CTC → components)
- Lock policy definitions (LOP rules, rounding, overtime)

## Statutory items

- PF setup: UAN handling, ceilings, employer contribution logic
- ESI setup: eligibility thresholds, period rules
- PT setup: state-wise slabs, registration numbers
- TDS: declarations, proofs workflow, Form 16

## Bank + approvals

- Maker-checker for payroll finalisation
- Bank file format export (NEFT / salary transfer)
- Reconciliation workflow (failed transfers)

## Month-end accuracy checks

- Joiners/leavers list validated
- Attendance finalised + exceptions resolved
- Arrears and backdated changes reviewed
- Statutory reports generated and cross-checked

## Audit trail

- Changes tracked (who, what, when)
- Exportable reports for internal audit

If you’re switching payroll vendors, plan a parallel run for at least 1 cycle.
`,
  },
  {
    slug: "attendance-leave-policies-sme",
    title: "Attendance & leave policies: what to define before you buy software",
    summary:
      "Before evaluating tools, define shifts, late marks, LOP rules, carry-forward, and exception handling — otherwise every demo looks good.",
    tags: ["Attendance", "Leave", "Policy"],
    date: "2026-01-10",
    content: `# Attendance & leave policies (SME)

Tools are only as good as the policies you configure.

## Define the core rules

- Workweek pattern (5/6 days) + holidays by location
- Shift types: fixed vs rotational
- Late mark and grace period
- Half-day rules and minimum hours

## Leave structure

- Earned / Casual / Sick leave definitions
- Accrual frequency (monthly/quarterly)
- Carry-forward and encashment

## Exceptions

- WFH and on-duty requests
- Outdoor/field staff tracking
- Comp-off eligibility and expiry

## Integrations

- Biometric devices or third-party attendance sources
- Payroll cut-off dates

**Tip:** ask vendors to configure one real policy set in a sandbox, not a generic demo.
`,
  },
  {
    slug: "ats-hiring-workflow-setup",
    title: "ATS evaluation: a simple workflow-based approach",
    summary:
      "Evaluate ATS tools by workflow: sourcing → screening → interviews → offers → joining, plus permissions and reporting.",
    tags: ["ATS", "Hiring", "Buyer guide"],
    date: "2025-12-18",
    content: `# ATS evaluation: workflow-based approach

An ATS should reduce coordination overhead, not add more steps.

## Start with your hiring stages

- Sourcing
- Screening
- Interview rounds
- Offer and approvals
- Joining and onboarding handoff

## Must-have questions for demos

- Can you customise stages per role?
- How are interviewers notified and reminded?
- What does the offer approval chain look like?
- Can you export pipeline reports by recruiter / role / stage?

## Collaboration & permissions

- Hiring manager visibility vs recruiter control
- Interview feedback forms and locks
- Candidate communication history

## Integrations

- Email/calendar integration
- Job boards
- HRMS handoff after offer acceptance

Pick the tool that matches your workflow today, but can scale to a slightly more structured process.
`,
  },
  {
    slug: "implementation-plan-hr-software",
    title: "HR software implementation plan (30-60-90)",
    summary:
      "A practical rollout plan with milestones, data readiness, parallel runs, training, and go-live checks.",
    tags: ["Implementation", "Rollout", "Checklist"],
    date: "2025-11-30",
    content: `# HR software implementation plan (30-60-90)

A successful rollout is 80% change management.

## Days 0–30: prepare

- Freeze requirements: modules, locations, policies
- Clean master data (employees, org, salary, leave balances)
- Identify owners: HR, finance, IT, vendor

## Days 31–60: configure + test

- Configure policies and workflows
- Run UAT with real edge cases
- Train HR admins and managers

## Days 61–90: parallel run + go-live

- Run parallel payroll (if applicable) for 1 cycle
- Launch employee self-serve
- Measure adoption: logins, requests, approvals

## Go-live checklist

- Support channel and escalation path defined
- Export/report access verified
- Backup plan for payroll processing

If you want, HRSignal can recommend vendors that match your timeline and modules.
`,
  },
];

export function getResourceArticle(slug: string): ResourceArticle | undefined {
  return RESOURCE_ARTICLES.find((a) => a.slug === slug);
}

export function listResourceArticles(): ResourceArticle[] {
  return [...RESOURCE_ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
}
