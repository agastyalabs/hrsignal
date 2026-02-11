export type PricingType =
  | "per_employee_month"
  | "per_company_month"
  | "one_time"
  | "quote_based";

export function pricingTypeLabel(type: PricingType): string {
  switch (type) {
    case "per_employee_month":
      return "PEPM";
    case "per_company_month":
      return "Per company / month";
    case "one_time":
      return "One-time";
    case "quote_based":
      return "Quote-based";
  }
}

export function pricingTypeKey(type: PricingType): string {
  // URL-safe / filter-friendly.
  return type;
}

export type DeploymentHint = "CLOUD" | "ONPREM" | "HYBRID" | null | undefined;

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function pricingTypeFromNote(note: string | null | undefined, deployment?: DeploymentHint): PricingType {
  const n = note ? norm(note) : "";

  // If note explicitly calls it out, trust it.
  if (/(pepm|per\s*employee|employee\s*\/\s*month|employee\s*per\s*month)/i.test(n)) return "per_employee_month";

  // Sometimes vendors price as a fixed monthly platform fee.
  if (/(per\s*company|per\s*org|per\s*tenant|company\s*\/\s*month|org\s*\/\s*month)/i.test(n)) return "per_company_month";

  // If we only see per-user/seat, treat it as per-employee/month for UI consistency.
  if (/(per\s*user|user\s*\/\s*month|per\s*seat|seat\s*\/\s*month)/i.test(n)) return "per_employee_month";

  if (/(one[-\s]*time|perpetual\s*license|license\s*fee|one\s*off)/i.test(n)) return "one_time";
  if (/(quote|contact\s*(sales|vendor)|custom\s*pricing|pricing\s*on\s*request)/i.test(n)) return "quote_based";

  // Otherwise infer from deployment.
  if (deployment === "ONPREM") return "one_time";

  // Cloud/Hybrid defaults should be quote-based unless unit is known.
  return "quote_based";
}

export function normalizePricingText(note: string | null | undefined, type: PricingType): string {
  const raw = note?.trim();
  if (!raw) {
    return type === "quote_based" ? "Contact vendor / request quote" : "Info pending";
  }

  // Ensure we never show ambiguous units without a label.
  const n = raw.toLowerCase();
  const mentionsUnit = /(employee|user|seat|company|org|tenant|month|year|annual|one-time|license|maintenance|quote)/i.test(n);

  if (mentionsUnit) return raw;

  // If price exists but unit doesn't, add a minimal clarifier.
  if (/[₹$€]|\b(inr|usd|eur)\b/i.test(n)) {
    return `${raw} (${pricingTypeLabel(type)})`;
  }

  return raw;
}
