## Overview
- **Vendor**: Freshworks Inc.
- **Product**: Freshteam
- **Type**: ATS (recruiting) + onboarding + basic HR ops (employee directory/records, time off)
- **Primary users**: Recruiters, hiring managers, HR admins, employees (limited self-service)
- Not to be confused with Freshservice (HR service delivery workflows).
- **Primary sources used**: Freshteam official support portal (product capabilities) + Freshworks security/privacy pages (vendor-level).
- **Info pending**:
  - Official Freshteam product page on freshworks.com (currently 404/redirect in this environment)

## Key modules / features
- **Recruiting / ATS**
  - Career site setup and customization (hosted career portal)
  - Job creation and publishing
  - Job embeds for publishing roles on an external company site
  - Hiring workflow configuration (pipeline stages/sub-stages)
  - Interview scorecards
  - Interview scheduling + notifications
  - Candidate intake channels
    - Manual add
    - CSV import
    - Careers inbox → candidate profiles
    - Job boards/social distribution mentioned at a high level in support guidance
  - Role-based access (Account Admin, Admin, HR Partner, Recruiter, Hiring Manager, Employee)
- **Onboarding**
  - New-hire forms and documents
  - Onboarding kits / welcome kits (support guidance)
  - Multi-team onboarding checklists (tasks + reminders)
  - E-sign support via integration (see Integrations)
- **Employee records / directory**
  - Employee profiles/records
  - Custom fields/sections in employee records
  - Bulk employee import (CSV)
  - Reference to directory integration with Google Workspace / Office 365
- **Time off (leave)**
  - Leave types, holiday calendars, workweek/half-day settings
  - Policy setup
  - Leave balance import
- **Info pending**:
  - Native payroll processing module (no evidence found in checked sources)
  - India statutory workflows (PF/ESI/PT/TDS) within Freshteam (no evidence found in checked sources)

## Pricing model
- **Plan tiers (from Freshteam support)**: Free, Growth, Pro, Enterprise
- **Licensing indicator (from subscription support docs)**
  - Subscription management uses a **“Total Employee count”** input
  - Free-plan downgrade flow requires setting total employee count to **exactly 50**
  - Support references buying additional licenses via Freshworks unified billing
- **Billing operations (from support)**
  - Managed via Freshworks “Unified Billing Platform”
  - Currency choice can be changed during trial; post-trial currency changes require contacting billing/support
- **Info pending**:
  - Published price points by tier
  - Metric expression on pricing page (explicit PEPM vs per-user wording)
  - India pricing/INR availability and GST invoicing specifics

## Integrations
- **Email**
  - Gmail mailbox sync (candidate conversations + Gmail label flow for adding candidates)
  - Microsoft Office 365 / Outlook mail integration
- **Directory / provisioning adjacent**
  - Employee import via CSV
  - Support references employee directory integration with Google Workspace (G Suite) / Office 365
- **E-sign (onboarding documents)**
  - SignEasy integration enabled from Settings → Productivity → Integrations
  - Support notes SignEasy premium trial/plan requirement
- **Info pending**:
  - Verified list of other prebuilt integrations (job boards, assessments, background checks, HRIS/payroll)
  - API availability, webhooks
  - SSO/SAML and SCIM details by plan

## Compliance & security
- **Vendor-level security (Freshworks security resources page)**
  - Encryption: TLS 1.2 in transit; AES-256 at rest (as stated)
  - Described controls: IAM-based role controls, 2FA, audit trails (high level)
  - Resiliency: multi-AZ architecture concepts, backups, monitoring (high level)
  - “Trust Center” referenced as location for certifications/attestations
- **Privacy (Freshworks privacy notice)**
  - Describes controller/processor framing and cross-border processing at Freshworks group level
  - Lists India group company entity details
- **Info pending**:
  - Freshteam-specific compliance attestations and scope (e.g., SOC 2 / ISO 27001 applicability to Freshteam)
  - India data residency option for Freshteam
  - Product controls for India HR data governance (audit logs, retention, DLP) by plan

## Deployment & implementation
- **Deployment**: Cloud SaaS (web)
- **Typical setup steps (from support portal)**
  - Company profile + locations/time zones
  - Departments/teams and user roles
  - Career site configuration + embeds
  - Careers inbox + email sync (Gmail/O365)
  - Hiring workflow configuration (stages, scorecards, automations)
  - Employee import (CSV; directory references)
  - Onboarding checklists + e-sign integration
  - Time-off policies + balances
- **Info pending**:
  - Verified implementation timelines and admin effort ranges
  - Data migration tooling beyond CSV (connectors, APIs)

## Best-fit company size
- **Best fit**: SMB to mid-market with regular hiring and structured onboarding needs
- **Practical fit signals**
  - Centralize recruiting workflow + hiring manager collaboration
  - Basic employee records + leave policies are sufficient
  - Payroll/statutory handled elsewhere
- **Less ideal when**
  - Buyer expects a full India HRMS (payroll + statutory compliance) within the same system of record
  - Enterprise-scale requirements for complex identity governance and deep integrations without verified support
- **Info pending**:
  - Verified customer segment distribution from public review platforms (blocked in this environment)

## India-first context
- **India buyer positioning (based on verified functional scope)**
  - Treat Freshteam primarily as **ATS + onboarding + basic HR ops**
  - For India compliance outcomes (PF/ESI/PT/TDS, payroll), plan for a separate India payroll/statutory system and define master-data ownership
- **Key evaluation checks for India deployments**
  - Data residency options and contractual commitments (India vs other regions)
  - Controls for HR data access, auditability, and retention
  - Integration path to India payroll/statutory vendor (API/flat-file/manual)
  - Billing currency and invoicing expectations (INR/GST)
- **Info pending**:
  - Confirmed India-region hosting for Freshteam
  - Confirmed integrations to India payroll/statutory vendors
  - Confirmed INR pricing + GST invoice workflow

## Public review platforms (G2, Capterra)
- **G2**: Access blocked by JS/anti-bot in this environment
- **Capterra**: Access blocked by Cloudflare in this environment
- **Info pending**:
  - Current ratings, review themes, and segment distribution from G2/Capterra

## Sources checked (direct URLs)
- Freshteam (official support portal)
  - https://support.freshteam.com/support/solutions
  - https://support.freshteam.com/support/solutions/articles/19000140639-managing-your-freshteam-account-subscription
  - https://support.freshteam.com/support/solutions/articles/19000050931-managing-account-and-billing-information
  - https://support.freshteam.com/support/solutions/articles/19000140662-how-to-change-the-currency-for-my-subscription
  - https://support.freshteam.com/support/solutions/articles/19000070840-syncing-gmail-with-freshteam
  - https://support.freshteam.com/support/solutions/articles/19000104586-how-to-integrate-freshteam-with-outlook-office-365-mail-
  - https://support.freshteam.com/support/solutions/articles/19000105716-how-to-activate-e-sign-for-onboarding-
- Freshworks (vendor-level)
  - https://www.freshworks.com/security/
  - https://www.freshworks.com/privacy/
- Freshworks Freshteam marketing URLs attempted (not accessible in this environment)
  - https://www.freshworks.com/freshteam/ (404)
  - https://www.freshworks.com/hrms/freshteam/ (redirected to Freshservice business teams)
  - https://www.freshworks.com/hrms/ (redirected to Freshservice business teams)

## Data gaps (explicit)
- Freshworks Freshteam official product/pricing pages accessible content: **Info pending** (404/redirects in this environment)
- Verified rate card and billing metric wording (PEPM vs per-user): **Info pending**
- Freshteam-specific compliance attestations and India data residency: **Info pending**
- API/webhooks, SSO/SAML, SCIM and broader integrations catalog: **Info pending**
- G2/Capterra ratings and review themes: **Info pending**
