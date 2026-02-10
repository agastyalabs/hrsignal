# Freshteam (Freshworks)

## Snapshot
- **Vendor**: Freshworks Inc.
- **Product**: Freshteam
- **Category**: SMB/mid-market **ATS (recruiting)** + **onboarding** + **employee directory / basic HR operations** (includes time-off)
- **Deployment**: Cloud SaaS (web application)
- **Primary users**: Recruiters, hiring managers, HR admins, employees (limited self-service)
- **Best-fit**: Growing companies that want one system for recruiting + onboarding (and some light HR admin), without needing full payroll/statutory HRMS

## What it does (feature summary)
Freshteam’s own support documentation shows coverage across recruiting setup, job publishing, candidate management, onboarding workflows, employee records, and time-off.

### Recruiting / ATS
From Freshteam’s setup and workflow guidance in its support portal:
- **Career site** setup and customization (branding assets; hosted career portal)
- **Job creation & publishing**; jobs published in Freshteam are visible on the Freshteam career site; support also describes **job embeds** for publishing to an organization site
- **Applicant tracking workflow configuration** including interview scorecards, sub-stages, and automation (Freshteam support refers to “autopilot workflows”)
- **Application forms** per job (drag/drop fields)
- **Candidate intake** via multiple channels including manual entry, bulk import (CSV), email inbox capture, and job boards/social sharing (support references channels like LinkedIn/Indeed and social distribution at a high level)
- **Interview scheduling** and interviewer/candidate notifications
- **Role-based access** for TA and stakeholders (Account Admin, Admin, HR Partner, Recruiter, Hiring Manager, Employee)

### Onboarding
From onboarding setup guidance in the support portal:
- **Pre-onboarding / onboarding** document workflows
- **Onboarding checklists** across teams (HR/IT/manager), task assignment, and reminders
- **E-signature enablement** for onboarding documents via an integration (see Integrations)

### Employee directory / records
- **Employee profiles / employee records**, including custom fields and sections
- **Bulk employee import** via CSV and directory integration options (Google Workspace / Microsoft 365 are referenced)

### Time off (leave)
Support documentation includes:
- Time-off **preferences** (leave types, holiday calendar, workweek, half-day leave)
- Time-off **policy setup** and **leave balance import**

## Pricing model
Freshteam’s marketing/pricing pages could not be retrieved reliably in this environment (Freshworks Freshteam URLs returned 404/redirects), but the Freshteam support portal documents plan structure and licensing mechanics.

- **Plan tiers**: **Free, Growth, Pro, Enterprise** (explicitly referenced in Freshteam subscription management documentation).
- **Licensing basis**: Subscription management references **“Total Employee count”** and **buying additional licenses**, and indicates Free-plan constraints (downgrade flow requires setting total employee count to **exactly 50**), which indicates **employee-count-based licensing**.
- **PEPM vs per-user**: **Info pending** (employee-count-based licensing is evidenced; published unit pricing and whether it is explicitly expressed as PEPM needs verification from an official pricing page).
- **Billing operations**: Managed via Freshworks’ “Unified Billing Platform”; account/billing communications are sent to the primary billing contact; changing billing currency after trial requires contacting billing/support (per Freshteam billing/currency articles).

## Integrations
Verified via Freshteam support articles:
- **Email sync**
  - **Gmail** mailbox sync (candidate conversations sync; a Gmail label is created for adding candidates from the inbox).
  - **Microsoft Office 365 / Outlook mail** integration option.
- **Directory / employee import**
  - Employee import via CSV; support also references integrating with employee directory via **Google Workspace (G Suite)** or **Office 365**.
- **E-sign for onboarding**
  - **SignEasy** integration for e-signing onboarding documents (Freshteam support notes SignEasy premium trial/plan requirement).

**Additional integrations catalog (marketplace), APIs/webhooks**: **Info pending** (needs verification via official Freshteam developer/marketplace pages).

## Compliance, security, and privacy
### Freshworks (vendor-level) security posture (public)
Freshworks’ public security resources page describes (vendor-level):
- Encryption in transit (**TLS 1.2**) and at rest (**AES-256**)
- Role-based access controls, 2FA, and audit trails (described at a high level)
- Operational security and resiliency measures (monitoring, backups, redundancy)

### Freshteam (product-specific) compliance
- **SOC 2 / ISO 27001 / GDPR / DPA**: **Info pending** (Freshworks indicates a “Trust Center”, but Freshteam-specific attestations and scope mapping could not be verified from accessible sources here).
- **SSO/SAML, SCIM, audit logs, data retention controls**: **Info pending** (often plan-dependent; not confirmed in retrieved Freshteam sources).
- **Data residency (including India region hosting)**: **Info pending**.

## Deployment & implementation
- **Deployment**: Cloud SaaS.
- **Implementation profile** (based on support-guided setup steps): configure company info, locations/time zones, departments/teams; set up career site; connect hiring inbox/email sync; define pipelines/scorecards; import employees; configure onboarding checklists and e-sign integration; configure time-off policies.
- **Time-to-value**: Likely days–weeks for SMB; **Info pending** for verified implementation timelines.

## Best-fit company size (analyst view)
- **Best fit**: SMB to mid-market organizations with ongoing hiring and a need for structured recruiting + onboarding.
- **Typical fit range**: ~20–1,000 employees (varies by hiring volume and process complexity).
- **India buyer fit notes (practical)**:
  - Freshteam appears best used as **ATS + onboarding + light HR ops**, and paired with a dedicated India payroll/statutory system when PF/ESI/PT/TDS compliance and payroll processing are in scope.
  - For India-first stacks, assess whether Freshteam is the “system of record” for employee master data or whether it feeds a payroll/HRIS downstream (integration specifics **Info pending**).

## India-first context
- **Vendor presence**: Freshworks has an India entity and a meaningful India footprint (useful for buyer confidence and potential local support alignment).
- India diligence questions (confirm during vendor evaluation):
  - **INR billing/GST invoicing**: Freshteam support indicates currency selection is editable during trial; post-trial currency changes require contacting billing/support. Whether INR is offered and GST invoicing mechanics are **Info pending**.
  - **India data residency**: **Info pending**.
  - **Payroll/statutory adjacency**: Freshteam sources reviewed do not evidence built-in India payroll/statutory modules; treat as **not in scope** unless verified otherwise.

## Public review platforms (G2, Capterra)
- **G2**: **Info pending** (blocked by JS/anti-bot in this environment).
- **Capterra**: **Info pending** (blocked by Cloudflare in this environment).

When access is available, recommended (non-verbatim) extraction points:
- Reported strengths (e.g., usability, pipeline visibility, email sync, onboarding workflow)
- Reported gaps (e.g., reporting depth, customization limits, integration breadth)
- Customer segment distribution (SMB vs mid-market)

## Sources checked (direct URLs)
- Freshteam support portal:
  - https://support.freshteam.com/support/solutions
  - Subscription/plans workflow: https://support.freshteam.com/support/solutions/articles/19000140639-managing-your-freshteam-account-subscription
  - Billing/account admin info: https://support.freshteam.com/support/solutions/articles/19000050931-managing-account-and-billing-information
  - Currency change note: https://support.freshteam.com/support/solutions/articles/19000140662-how-to-change-the-currency-for-my-subscription
  - Gmail sync: https://support.freshteam.com/support/solutions/articles/19000070840-syncing-gmail-with-freshteam
  - Office 365 mail integration: https://support.freshteam.com/support/solutions/articles/19000104586-how-to-integrate-freshteam-with-outlook-office-365-mail-
  - E-sign for onboarding (SignEasy): https://support.freshteam.com/support/solutions/articles/19000105716-how-to-activate-e-sign-for-onboarding-
- Freshworks security (vendor-level):
  - https://www.freshworks.com/security/

## Data gaps (explicit)
- Official Freshteam marketing site and pricing page content: **Info pending** (Freshworks Freshteam URLs returned 404/redirects; `freshteam.com` origin was not accessible during checks)
- Published price points, billing metric expression (PEPM vs per-user) and add-on structure: **Info pending**
- Definitive integration catalog (marketplace listing, APIs/webhooks, SSO/SCIM support): **Info pending**
- Product-specific compliance attestations and data residency options (including India): **Info pending**
- Review platform ratings and qualitative themes (G2/Capterra): **Info pending**
