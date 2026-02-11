# Freshteam (Freshworks)

## Page metadata (internal)
- **Vendor**: Freshworks Inc.
- **Product**: Freshteam
- **Category**: ATS + onboarding (with basic employee directory/time off)
- **Primary geography lens**: India HR buyer
- **Last reviewed (UTC)**: 2026-02-11
- **Freshness label**: Fresh (≤90 days)
- **Confidence**: Medium (official support docs verified; marketing/pricing pages need validation)

## Intro (what it is)
- Freshteam is a cloud SaaS product focused on **recruiting/ATS and onboarding workflows**.
- Also includes **employee records/directory** and **time-off policy** configuration based on support documentation.
- Not positioned (in checked sources) as a full India HRMS with payroll/statutory processing.
- Deployment: cloud SaaS (web).
- Typical users: recruiters, hiring managers, HR admins.
- Not to be confused with Freshservice (HR service delivery workflows).

## Fit summary (who it’s for)
### Best-fit
- SMB to mid-market companies with recurring hiring.
- Teams that want structured pipelines, interview coordination, and onboarding tasking.
- Organizations okay with payroll/statutory handled in a separate India payroll system.

### Not ideal when
- Buyer requires built-in India payroll and statutory compliance (PF/ESI/PT/TDS) in the same system.
- Buyer requires verified India data residency and product-specific compliance attestations immediately.

## Modules & capabilities (what you actually get)
### Recruiting / ATS (from support portal)
- Career site setup and customization.
- Job creation and publishing; job embeds to external company site.
- Hiring workflow configuration (stages/sub-stages), interview scorecards.
- Interview scheduling + notifications.
- Candidate intake: manual add, CSV import, careers inbox capture; job boards/social distribution referenced at a high level.
- Role-based access: Account Admin, Admin, HR Partner, Recruiter, Hiring Manager, Employee.

### Onboarding (from support portal)
- Onboarding documents and kits; multi-team onboarding checklists with reminders.
- E-sign for onboarding documents via integration.

### Employee records / directory
- Employee profiles/records; custom fields/sections; bulk import.

### Time off (leave)
- Leave types, holiday calendar, workweek/half-day settings; policy setup; leave balance import.

### Known constraints
- No verified evidence (in checked sources) of built-in India payroll/statutory modules.

## Pricing model (how it’s charged)
- **Plan structure** (from Freshteam support): Free, Growth, Pro, Enterprise.
- **Pricing metric (evidence)**
  - Subscription management uses “Total Employee count”; Free-plan downgrade requires setting employee count to exactly 50.
  - Indicates **employee-count-based licensing**.
- **Commercial notes for India**
  - Currency can be changed during trial; post-trial currency changes require contacting billing/support.
- **Needs validation**
  - Published price points and whether pricing is expressed explicitly as PEPM.
  - INR availability and GST invoicing specifics.

## Integrations (how it connects)
- **Email** (verified via support)
  - Gmail mailbox sync.
  - Microsoft Office 365 / Outlook mail integration.
- **Directory / provisioning adjacent** (support references)
  - CSV import; references to Google Workspace (G Suite) and Office 365 directory integration.
- **E-sign** (verified via support)
  - SignEasy integration for onboarding documents (SignEasy premium plan requirement noted).
- **India payroll adjacency**
  - Treat payroll/statutory as separate unless verified otherwise; confirm integration method during evaluation.
- **Needs validation**
  - API/webhooks availability; SSO/SAML/SCIM details.
  - Verified marketplace/integrations catalog.

## Compliance & security (India buyer lens)
- **Vendor-level security controls** (Freshworks security page)
  - TLS 1.2 in transit; AES-256 at rest (as stated).
  - High-level references to IAM controls, 2FA, and audit trails.
- **India HR compliance scope**
  - Payroll/statutory: not evidenced in checked Freshteam sources.
- **Needs validation**
  - Freshteam-specific SOC 2 / ISO scope.
  - India data residency for Freshteam.
  - Plan-tier availability for audit logs/SSO.

## Evidence links (what we checked)
**Freshness (UTC)**: 2026-02-11

- **Official product docs**: https://support.freshteam.com/support/solutions
- **Subscription/plans workflow**: https://support.freshteam.com/support/solutions/articles/19000140639-managing-your-freshteam-account-subscription
- **Billing/account admin info**: https://support.freshteam.com/support/solutions/articles/19000050931-managing-account-and-billing-information
- **Currency change note**: https://support.freshteam.com/support/solutions/articles/19000140662-how-to-change-the-currency-for-my-subscription
- **Gmail sync**: https://support.freshteam.com/support/solutions/articles/19000070840-syncing-gmail-with-freshteam
- **Office 365 mail integration**: https://support.freshteam.com/support/solutions/articles/19000104586-how-to-integrate-freshteam-with-outlook-office-365-mail-
- **E-sign for onboarding (SignEasy)**: https://support.freshteam.com/support/solutions/articles/19000105716-how-to-activate-e-sign-for-onboarding-
- **Security / Trust (vendor-level)**: https://www.freshworks.com/security/
- **Official pricing**: Needs validation
- **Integrations / Marketplace**: Needs validation
- **Public reviews**:
  - G2: Needs validation
  - Capterra: Needs validation

## Data gaps
- Published price points, billing metric expression (PEPM vs per-user) and add-on structure.
- Definitive integration catalog (marketplace listing, APIs/webhooks, SSO/SCIM support).
- Product-specific compliance attestations and data residency options (including India).
- Review platform ratings and qualitative themes.

## Decision checklist (India HR buyer)
- Confirm ATS workflow requirements: stages, scorecards, interview scheduling.
- Confirm onboarding needs: checklists, doc collection, e-sign.
- Decide system-of-record for employee data (Freshteam vs downstream HRIS/payroll).
- If payroll/statutory is required, shortlist an India payroll system and confirm integration approach.
- Request Freshteam-specific attestations (SOC 2/ISO) and scope.
- Confirm SSO/audit log availability and which plan tier includes them.
- Confirm data residency options if required by policy.
- Confirm pricing metric and minimums.
- Confirm INR/GST invoice requirements.

## FAQs
- **Does it include India payroll and statutory compliance?**
  - Not evidenced in the sources reviewed; assume separate payroll/statutory system unless verified.
- **Does it support India data residency?**
  - Needs validation; requires vendor confirmation/contractual review.
- **What’s the pricing metric?**
  - Support docs indicate employee-count-based licensing; published rate card needs validation.
- **What integrations are confirmed?**
  - Gmail sync, Office 365 mail integration, SignEasy for e-sign (per support docs).
- **What company size is it best for?**
  - Typically SMB to mid-market with recurring hiring and structured onboarding needs.
