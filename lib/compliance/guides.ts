export type ComplianceGuide = {
  slug: "pf-compliance-guide" | "esi-complete-guide" | "pt-multi-state-guide" | "tds-payroll-guide";
  title: string;
  description: string;
};

export const COMPLIANCE_GUIDES: ComplianceGuide[] = [
  {
    slug: "pf-compliance-guide",
    title: "PF Compliance Guide",
    description: "Coverage, wage definition, month-end checks, and demo validation.",
  },
  {
    slug: "esi-complete-guide",
    title: "ESI Complete Guide",
    description: "Eligibility transitions, location mapping, reports, and corrections.",
  },
  {
    slug: "pt-multi-state-guide",
    title: "PT Multi-State Guide",
    description: "State slabs, transfers, overrides, and auditability.",
  },
  {
    slug: "tds-payroll-guide",
    title: "TDS for Payroll Guide",
    description: "Declarations, proofs, Form 16, projections, and audit trails.",
  },
];

export function isComplianceGuideSlug(s: string): s is ComplianceGuide["slug"] {
  return COMPLIANCE_GUIDES.some((g) => g.slug === s);
}

export function guideBySlug(slug: ComplianceGuide["slug"]) {
  return COMPLIANCE_GUIDES.find((g) => g.slug === slug)!;
}
