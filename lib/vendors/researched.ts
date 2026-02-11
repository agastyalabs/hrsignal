export type EvidenceLink = {
  label: string;
  url: string;
  kind: "Docs" | "Pricing" | "Security" | "Case study" | "Support" | "Other";
};

export type VendorResearch = {
  slug: string;
  displayName: string;
  descriptor: string;

  overview: string;
  bestFor: string[];
  notFor: string[];
  modules: string[];

  indiaReadiness: {
    summary: string;
    checklist: string[];
  };

  implementation: {
    summary: string;
    timeline: string;
    whatToValidate: string[];
  };

  integrations: {
    summary: string;
    common: string[];
  };

  faqs: Array<{ q: string; a: string }>;

  evidence: EvidenceLink[];
};

// Note: This is UI copy + evidence-link curation.
// We avoid hard claims and instead provide what to verify + primary sources.
const PROFILES: Record<string, VendorResearch> = {
  keka: {
    slug: "keka",
    displayName: "Keka",
    descriptor: "Modern HRMS + Payroll for Indian SMEs and mid-market",
    overview:
      "Keka is a widely evaluated India-first HR platform that combines Core HR, Payroll & Compliance, Attendance, and Performance. Use it when you want a single system of record with payroll depth and strong employee/manager workflows.",
    bestFor: [
      "Indian companies running monthly payroll with PF/ESI/PT/TDS",
      "Teams that need leave/attendance → payroll alignment",
      "SMBs to mid-market looking for a single suite",
    ],
    notFor: [
      "Global-first orgs needing multi-country payroll as primary",
      "Extremely bespoke payroll rules without standardization",
    ],
    modules: ["Core HR", "Payroll & Compliance", "Attendance", "Performance", "Expenses (optional)", "Recruitment (optional)"],
    indiaReadiness: {
      summary:
        "Strong India focus; still validate your state/entity edge cases and maker-checker/audit controls during demo.",
      checklist: ["Multi-state payroll handling", "GST invoicing", "Statutory reports + challans", "Approvals / maker-checker"],
    },
    implementation: {
      summary:
        "Implementation usually depends on attendance source, salary structure complexity, and historical data migration.",
      timeline: "Typically 2–6 weeks (validate with vendor)",
      whatToValidate: ["Data migration scope", "Attendance device/integration", "Payroll edge cases (arrears/FnF/transfers)"],
    },
    integrations: {
      summary: "Validate payroll export formats and your accounting/biometric integration requirements.",
      common: ["Tally", "Zoho Books", "Biometric devices", "Google Workspace", "Slack/MS Teams"],
    },
    faqs: [
      {
        q: "Does Keka support multi-state payroll?",
        a: "It’s commonly evaluated for India payroll, but confirm your specific PT/LWF/state rules and reporting in a demo using your exact sample payroll cases.",
      },
      {
        q: "What’s the pricing metric?",
        a: "Pricing can vary by plan and headcount. Use the pricing link below and confirm minimum billable headcount and add-ons.",
      },
    ],
    evidence: [
      { kind: "Other", label: "Website", url: "https://www.keka.com/" },
      { kind: "Docs", label: "Help Center", url: "https://support.keka.com/" },
      { kind: "Pricing", label: "Pricing", url: "https://www.keka.com/pricing/" },
      { kind: "Security", label: "Security (check vendor disclosures)", url: "https://www.keka.com/" },
    ],
  },

  darwinbox: {
    slug: "darwinbox",
    displayName: "Darwinbox",
    descriptor: "Enterprise HR suite (Core HR + Talent) with India depth",
    overview:
      "Darwinbox is an enterprise-grade HR suite typically evaluated by larger teams for Core HR plus talent modules. Use it when you need enterprise controls, workflows, and a broader suite beyond payroll.",
    bestFor: ["Mid-market to enterprise", "Multi-module HR suite evaluations", "Workflow-heavy orgs"],
    notFor: ["Tiny teams looking for a lightweight HRMS", "Strictly payroll-only buyers (unless suite is desired)"],
    modules: ["Core HR", "Payroll (validate) + Compliance", "Performance", "Recruitment", "Learning", "Engagement"],
    indiaReadiness: {
      summary: "Often shortlisted in India enterprise contexts; validate residency, statutory needs, and support model.",
      checklist: ["Data residency requirements", "Audit / RBAC", "Compliance reporting", "Implementation partner model"],
    },
    implementation: {
      summary: "Implementation is usually programmatic (phased rollouts across modules/entities).",
      timeline: "Typically 6–16+ weeks depending on scope",
      whatToValidate: ["Module scope", "Workflow approvals", "HRIS integrations", "Change management plan"],
    },
    integrations: {
      summary: "Confirm HRIS/payroll/accounting integrations and SSO requirements.",
      common: ["SSO/SAML", "Microsoft 365/Google Workspace", "ERP connectors", "Payroll exports"],
    },
    faqs: [
      { q: "Is Darwinbox suitable for SMEs?", a: "It can work, but ROI is typically strongest when you need multiple modules and enterprise controls." },
    ],
    evidence: [
      { kind: "Other", label: "Website", url: "https://darwinbox.com/" },
      { kind: "Support", label: "Contact / Support", url: "https://darwinbox.com/contact/" },
    ],
  },

  zoho: {
    slug: "zoho",
    displayName: "Zoho (People / Recruit)",
    descriptor: "Modular HR tools (People, Recruit, etc.) with broad ecosystem",
    overview:
      "Zoho offers modular HR products (Zoho People for HRMS; Zoho Recruit for ATS) that integrate with the broader Zoho ecosystem. Use it when you want modular adoption and strong integration with Zoho’s stack.",
    bestFor: ["Teams already on Zoho ecosystem", "Modular rollout (HRMS or ATS first)", "Budget-conscious buyers"],
    notFor: ["Buyers needing India payroll depth as the primary requirement (validate fit)", "Highly customized workflows without configuration"],
    modules: ["HRMS (Zoho People)", "ATS (Zoho Recruit)", "Payroll (validate by region)", "Analytics/Reports"],
    indiaReadiness: {
      summary: "Validate India payroll/compliance needs carefully if payroll is in-scope.",
      checklist: ["Payroll statutory coverage", "GST invoicing", "Support SLAs", "Data residency / security docs"],
    },
    implementation: {
      summary: "Typically quick for HRMS/ATS basics; complexity comes from workflows and integrations.",
      timeline: "Typically 1–6 weeks depending on scope",
      whatToValidate: ["Workflow approvals", "Data import", "Integration with accounting/email"],
    },
    integrations: {
      summary: "Strong within Zoho; validate external connectors if you rely on them.",
      common: ["Zoho Books", "Zoho CRM", "Google Workspace", "Microsoft 365"],
    },
    faqs: [
      { q: "People vs Recruit — do I need both?", a: "Use People for HRMS (employee lifecycle). Use Recruit for ATS (hiring pipeline)." },
    ],
    evidence: [
      { kind: "Other", label: "Zoho People", url: "https://www.zoho.com/people/" },
      { kind: "Other", label: "Zoho Recruit", url: "https://www.zoho.com/recruit/" },
      { kind: "Pricing", label: "Zoho People Pricing", url: "https://www.zoho.com/people/pricing.html" },
      { kind: "Pricing", label: "Zoho Recruit Pricing", url: "https://www.zoho.com/recruit/pricing.html" },
      { kind: "Support", label: "Support", url: "https://www.zoho.com/support/" },
    ],
  },

  greythr: {
    slug: "greythr",
    displayName: "greytHR",
    descriptor: "HRMS + Payroll for Indian SMEs",
    overview:
      "greytHR is a common choice for Indian SMEs seeking HRMS with payroll/compliance fundamentals. Use it when you want a stable payroll+HR foundation without buying an enterprise suite.",
    bestFor: ["20–1000 employees", "Payroll & compliance fundamentals", "HRMS + employee self-serve"],
    notFor: ["Enterprise talent suite requirements", "Very bespoke payroll rules without standardization"],
    modules: ["Core HR", "Payroll & Compliance", "Leave/Attendance", "Employee self-serve"],
    indiaReadiness: {
      summary: "India-first positioning; validate your multi-state and edge cases.",
      checklist: ["PT/LWF per state", "Statutory reports", "FnF and arrears handling"],
    },
    implementation: {
      summary: "Implementation complexity depends on payroll structures and attendance source.",
      timeline: "Typically 2–6 weeks",
      whatToValidate: ["Attendance integration", "Historical payroll migration", "Approvals and audit"],
    },
    integrations: {
      summary: "Confirm accounting exports and any biometric/attendance integrations.",
      common: ["Tally", "Biometric devices", "Email/SSO (if needed)"],
    },
    faqs: [{ q: "Is greytHR enough for payroll + compliance?", a: "Often yes for SMEs; validate your statutory complexity and reporting needs." }],
    evidence: [
      { kind: "Other", label: "Website", url: "https://www.greythr.com/" },
      { kind: "Pricing", label: "Pricing", url: "https://www.greythr.com/pricing/" },
      { kind: "Support", label: "Support", url: "https://www.greythr.com/support/" },
    ],
  },

  peoplestrong: {
    slug: "peoplestrong",
    displayName: "PeopleStrong",
    descriptor: "Enterprise HRMS + talent suite with India depth",
    overview:
      "PeopleStrong is an enterprise HR platform often shortlisted for HRMS plus talent modules. Use it when you need suite coverage and enterprise workflows.",
    bestFor: ["Mid-market to enterprise", "Suite evaluation (HRMS + talent)", "Workflow-heavy orgs"],
    notFor: ["Small teams needing a lightweight HRMS", "Single-module buyers with minimal process"],
    modules: ["Core HR", "Payroll (validate)", "Recruitment", "Performance", "Learning"],
    indiaReadiness: {
      summary: "Commonly evaluated in India; validate payroll coverage, residency, and implementation model.",
      checklist: ["Compliance coverage", "Audit/RBAC", "Implementation plan", "Support SLAs"],
    },
    implementation: {
      summary: "Implementation is typically phased and depends on module scope.",
      timeline: "Typically 6–16+ weeks",
      whatToValidate: ["Scope and integrations", "Data migration", "Approvals/audit"],
    },
    integrations: {
      summary: "Confirm ERP/SSO/IDP integrations early.",
      common: ["SSO/SAML", "ERP connectors", "Email/calendar"],
    },
    faqs: [{ q: "Is PeopleStrong primarily HRMS or a full suite?", a: "It’s often positioned as a suite; confirm which modules are included in your proposal." }],
    evidence: [
      { kind: "Other", label: "Website", url: "https://www.peoplestrong.com/" },
      { kind: "Support", label: "Contact", url: "https://www.peoplestrong.com/contact-us/" },
    ],
  },

  factohr: {
    slug: "factohr",
    displayName: "factoHR",
    descriptor: "HRMS + payroll with India SME focus",
    overview:
      "factoHR is commonly evaluated by Indian SMEs for HRMS + payroll basics. Use it when you want a suite-like experience without enterprise overhead.",
    bestFor: ["SMEs", "Payroll + attendance needs", "Mobile-first workflows"],
    notFor: ["Very complex enterprise HR programs", "Highly customized payroll without standardization"],
    modules: ["Core HR", "Payroll", "Attendance", "Performance (validate)", "Recruitment (validate)"],
    indiaReadiness: {
      summary: "Validate statutory reporting and multi-state requirements with your sample payroll.",
      checklist: ["Statutory compliance", "GST invoicing", "Support responsiveness"],
    },
    implementation: {
      summary: "Implementation typically driven by payroll data and attendance sources.",
      timeline: "Typically 2–8 weeks",
      whatToValidate: ["Attendance integrations", "Payroll edge cases", "Reports and exports"],
    },
    integrations: {
      summary: "Confirm accounting exports and biometric integrations.",
      common: ["Tally", "Biometrics", "Email"],
    },
    faqs: [{ q: "Does factoHR support India compliance?", a: "It targets India SMEs; validate your exact statutory needs and reports." }],
    evidence: [
      { kind: "Other", label: "Website", url: "https://www.factohr.com/" },
      { kind: "Pricing", label: "Pricing", url: "https://www.factohr.com/pricing/" },
      { kind: "Support", label: "Contact", url: "https://www.factohr.com/contact-us/" },
    ],
  },

  freshteam: {
    slug: "freshteam",
    displayName: "Freshteam (Freshworks)",
    descriptor: "ATS + onboarding for SMEs",
    overview:
      "Freshteam is typically evaluated as an ATS + onboarding tool for hiring teams. Use it when your priority is recruitment pipeline, interviews, and onboarding tasks rather than payroll depth.",
    bestFor: ["Hiring teams", "ATS + onboarding", "Freshworks ecosystem buyers"],
    notFor: ["Payroll/compliance-first evaluations", "Deep HRMS suite needs"],
    modules: ["ATS", "Onboarding", "Basic HR directory (validate)", "Offer workflows"],
    indiaReadiness: {
      summary: "Great for recruiting workflows; India payroll/compliance is not its primary scope.",
      checklist: ["Offer approvals", "Data export", "Support SLAs"],
    },
    implementation: {
      summary: "Usually quick to set up for hiring workflows.",
      timeline: "Typically 1–3 weeks",
      whatToValidate: ["Email/calendar integrations", "Scorecards and approvals", "Data retention"],
    },
    integrations: {
      summary: "Confirm integrations with your calendar/email and HR stack.",
      common: ["Google Workspace", "Microsoft 365", "Slack", "Freshworks suite"],
    },
    faqs: [{ q: "Is Freshteam an HRMS?", a: "It’s primarily ATS + onboarding. Use a dedicated HRMS/payroll tool for full employee lifecycle + payroll." }],
    evidence: [
      { kind: "Other", label: "Product page", url: "https://www.freshworks.com/hrms/freshteam/" },
      { kind: "Pricing", label: "Pricing", url: "https://www.freshworks.com/hrms/freshteam/pricing/" },
      { kind: "Support", label: "Support", url: "https://support.freshteam.com/" },
    ],
  },
};

export function getResearchedVendorProfile(slug: string): VendorResearch | null {
  return PROFILES[slug] ?? null;
}
