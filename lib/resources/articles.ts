export type ResourceArticle = {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  readingTime: string;
  category: string;
  content: string;
};

const ARTICLES: ResourceArticle[] = [
  {
    slug: "hrms-selection-india-sme",
    title: "How to choose an HRMS in India (SME buyer guide)",
    summary:
      "A practical checklist for evaluating HRMS tools for Indian teams — data, workflows, permissions, and rollout readiness.",
    date: "2026-02-07",
    tags: ["HRMS", "SME", "Buying"],
    readingTime: "6 min",
    category: "Buyer guide",
    content: `## What an HRMS should do well\n\n- Employee records + org structure\n- Role-based access\n- Document workflows\n- Reporting that HR teams actually use\n\n## Shortlist criteria\n\n1) Fit for your size band\n2) Implementation effort\n3) Self-service UX\n4) Support responsiveness\n\n## Quick red flags\n\n- No export\n- No audit trail\n- Permissions are "all or nothing"\n`,
  },
  {
    slug: "payroll-compliance-checklist",
    title: "Payroll & compliance checklist (PF/ESI/PT/TDS)",
    summary:
      "The compliance questions to ask before you sign: filings, state coverage, validations, and what’s included vs add-on.",
    date: "2026-02-07",
    tags: ["Payroll", "Compliance", "PF"],
    readingTime: "7 min",
    category: "Checklist",
    content: `## What to validate\n\n- PF/ESI/PT rules coverage\n- Multi-state complexity\n- Employee lifecycle changes (joins/exits)\n- Error handling + reversals\n\n## Ask for evidence\n\n- Sample reports\n- Support SLAs\n- Implementation timeline\n`,
  },
  {
    slug: "attendance-leave-time-tracking-guide",
    title: "Attendance & leave tracking: what matters for Indian ops teams",
    summary:
      "Shift rules, biometric/device flows, field staff attendance, and leave policies — what to check in demos.",
    date: "2026-02-07",
    tags: ["Attendance", "Leave", "Shifts"],
    readingTime: "5 min",
    category: "Buyer guide",
    content: `## Common workflows\n\n- Shifts + late/early rules\n- Leave accruals\n- Approvals\n- Field attendance\n\n## Demo script\n\nHave vendors walk through a real month-end scenario.\n`,
  },
  {
    slug: "ats-hiring-stack-for-smes",
    title: "ATS for SMEs: building a hiring stack that doesn’t slow you down",
    summary:
      "Pipeline stages, interview scorecards, offer workflows, and integrations — how to evaluate ATS tools quickly.",
    date: "2026-02-07",
    tags: ["ATS", "Hiring", "SME"],
    readingTime: "6 min",
    category: "Playbook",
    content: `## Decide your process first\n\n- Stages\n- Roles\n- SLAs\n\n## Tool checklist\n\n- Scorecards\n- Email templates\n- Reporting\n`,
  },
  {
    slug: "performance-okr-lightweight-setup",
    title: "Performance & OKRs: a lightweight setup for fast-growing teams",
    summary:
      "A simple way to roll out goals and reviews without turning it into bureaucracy — cadence, templates, and manager habits.",
    date: "2026-02-07",
    tags: ["Performance", "OKR", "Managers"],
    readingTime: "6 min",
    category: "Playbook",
    content: `## Keep it simple\n\n- Quarterly goals\n- Monthly check-ins\n- Lightweight reviews\n\n## What to look for in tools\n\n- Goal visibility\n- Review templates\n- Manager nudges\n`,
  },
  {
    slug: "payroll-compliance-checklist-2026",
    title: "Payroll & compliance checklist for 2026 (PF/ESI/PT/TDS)",
    summary:
      "A tight list of what to verify in payroll tools for 2026 — filings, validations, state coverage, and audit-ready reporting.",
    date: "2026-02-07",
    tags: ["Payroll", "Compliance", "2026"],
    readingTime: "5 min",
    category: "Checklist",
    content: `## The 2026 checks\n\n- PF/ESI rules & exceptions\n- PT + multi-state complexity\n- TDS / Form 16 / 24Q outputs\n- Reversals, arrears, final settlement\n\n## Ask for examples\n\n- Sample payslip\n- Statutory reports\n- Month-end reconciliation flow\n`,
  },
  {
    slug: "labour-codes-2026-hr-prep",
    title: "Labour codes in India: what HR teams should prepare for (2026)",
    summary:
      "A non-legal overview for HR ops: policy changes to watch, data you should clean up, and questions to ask vendors.",
    date: "2026-02-07",
    tags: ["Compliance", "Policy", "2026"],
    readingTime: "6 min",
    category: "Explainer",
    content: `## Practical preparation\n\n- Centralize employee master data\n- Document policy assumptions\n- Ensure exports + audit trails\n\n## Vendor questions\n\n- How do updates roll out?\n- What is configurable vs hard-coded?\n- What reporting changes are planned?\n`,
  },
  {
    slug: "onboarding-document-workflows",
    title: "Onboarding & document workflows: a practical setup for Indian SMEs",
    summary:
      "Offer → joining → KYC → policy acknowledgements: how to design a clean onboarding flow and what to verify in HR tools.",
    date: "2026-02-08",
    tags: ["Onboarding", "Documents", "HRMS"],
    readingTime: "8 min",
    category: "Playbook",
    content: `## Why onboarding breaks in practice\n\nMost onboarding issues are not about the UI — they’re about *handoffs* and *missing ownership*. The goal is to remove ambiguity.\n\n### A simple onboarding map\n\n1) **Offer & acceptance** (template, approvals, version history)\n2) **Joining details** (joining date, location, manager, cost center)\n3) **KYC & statutory docs** (PAN, Aadhaar, bank, previous employment docs where needed)\n4) **Policy acknowledgements** (POSH, IT/security, leave policy, code of conduct)\n5) **Access provisioning** (email, payroll access, attendance device enrollment)\n\n## What to check in tools (demo script)\n\n- Can HR send an onboarding checklist per role/location?\n- Is there an **audit trail** for uploaded docs and acknowledgements?\n- Can employees upload from mobile without issues?\n- Can you export all docs for an employee in one click?\n\n## Common India-specific requirements\n\n- Multiple locations + different policy variants\n- Contractor onboarding\n- Document retention policies\n\n## Recommended next step\n\nIf you’re comparing HRMS tools, shortlist 3–5 and run this onboarding demo script end-to-end.\n\n**CTA:** Want a shortlist? Use **Get recommendations** and tell us your onboarding complexity.\n`,
  },
  {
    slug: "data-security-privacy-hr-software",
    title: "Data security & privacy checklist for HR software (India-first)",
    summary:
      "A buyer checklist: access controls, audit logs, exports, vendor support processes, and what questions to ask before signing.",
    date: "2026-02-08",
    tags: ["Security", "Privacy", "Buying"],
    readingTime: "9 min",
    category: "Checklist",
    content: `## What HR data includes\n\nHR systems store highly sensitive data: identity docs, salary, addresses, medical leaves, performance notes. Treat vendor security as a first-class requirement.\n\n## Minimum checklist (ask for evidence)\n\n### Access & identity\n\n- Role-based access controls (RBAC)\n- 2FA / SSO options\n- Admin action logs\n\n### Auditability\n\n- Audit log for employee record edits\n- Exportability (CSV/Excel)\n- Data retention controls\n\n### Vendor processes\n\n- Incident response policy\n- Support access controls (can support agents view salary?)\n- Backup + restore expectations\n\n## Red flags\n\n- “We can’t export your data”\n- No audit log\n- Shared admin accounts\n\n**CTA:** If security is a priority, choose the Detailed mode on the recommendation flow and add security requirements in notes.\n`,
  },
  {
    slug: "shift-management-field-staff",
    title: "Shift management & field staff attendance: what to validate",
    summary:
      "If you have shifts, overtime, field staff or multiple locations, these are the workflows that make or break adoption.",
    date: "2026-02-08",
    tags: ["Attendance", "Shifts", "Field staff"],
    readingTime: "8 min",
    category: "Buyer guide",
    content: `## The reality\n\nShift + field attendance is not a single feature — it’s a bundle of edge cases: late rules, overtime policies, device downtime, location spoofing, and approvals.\n\n## Validate these workflows\n\n1) **Shift roster**: can managers publish schedules weekly/monthly?\n2) **Grace + penalties**: configurable by location/role?\n3) **Overtime**: policy + approvals + payroll export\n4) **Device flows**: biometric sync, missed punches, offline mode\n5) **Field staff**: geo-fence, selfie check-in, travel days\n\n## Reports that matter\n\n- Attendance exceptions (late/early/missed punch)\n- Overtime totals and approvals\n- Per-location compliance export\n\n**CTA:** Compare tools that handle shifts well using the Compare tray — you’ll spot missing features quickly.\n`,
  },
  {
    slug: "accounting-integrations-tally-zoho",
    title: "Integrations with accounting (Tally/Zoho Books): how to avoid month-end chaos",
    summary:
      "What to check so payroll data flows cleanly into finance: mapping, exports, revisions, and audit trails.",
    date: "2026-02-08",
    tags: ["Integrations", "Payroll", "Finance"],
    readingTime: "9 min",
    category: "Playbook",
    content: `## Why integrations fail\n\nMost integration failures are about inconsistent master data (cost centers, departments) and unclear ownership of reconciliation.\n\n## A practical approach\n\n- Define a single chart-of-accounts mapping\n- Decide who owns corrections (HR vs Finance)\n- Keep a month-end checklist\n\n## What to validate in demos\n\n- Export formats supported\n- Can you re-export a corrected month?\n- Does the system keep an audit trail of changes?\n\n## Suggested rollout\n\n1) First month: export only (manual import)\n2) Second month: automated mapping\n3) Third month: lock policy + exception handling\n\n**CTA:** If finance integration is critical, mention Tally/Zoho Books in the recommendation flow so we prioritize tools with proven workflows.\n`,
  },
  {
    slug: "hrms-rollout-30-days",
    title: "HRMS rollout in 30 days: a simple plan for India-first SMEs",
    summary:
      "A realistic rollout plan: scope, owners, data cleanup, training, and how to prevent launch-day chaos.",
    date: "2026-02-08",
    tags: ["HRMS", "Implementation", "SME"],
    readingTime: "8 min",
    category: "Playbook",
    content: `## The goal\n\nA good HRMS rollout is boring. Employees can log in, HR can run month-end, and managers know what to approve.\n\n## Week-by-week plan\n\n### Week 1: Scope + owners\n\n- Pick the **minimum modules**: Core HR + Attendance + Payroll (if applicable)\n- Assign a single owner in HR + a backup\n- Decide “source of truth” for employee master data\n\n### Week 2: Data cleanup\n\n- Employee list, locations, departments\n- Leave balances\n- Payroll identifiers\n\n### Week 3: Pilot\n\n- Run a pilot with one location/team\n- Capture exceptions and decide policies\n\n### Week 4: Go-live + support\n\n- Manager training (approvals)\n- Employee onboarding (self-service)\n- Month-end dry run\n\n## What to ask vendors\n\n- Implementation timeline and dependencies\n- Who handles statutory configuration?\n- What’s the support SLA during month-end?\n\n**CTA:** If you’re planning a fast rollout, use the recommendation form and choose Detailed mode so we prioritize tools with proven onboarding and support.\n`,
  },
];

export function listResourceArticles(): ResourceArticle[] {
  return [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getResourceArticle(slug: string): ResourceArticle | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}
