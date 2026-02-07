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
];

export function listResourceArticles(): ResourceArticle[] {
  return [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getResourceArticle(slug: string): ResourceArticle | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}
