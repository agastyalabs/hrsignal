export type PricingType = "PEPM" | "Per user/month" | "One-time" | "Quote-based";

export type DeploymentHint = "CLOUD" | "ONPREM" | "HYBRID" | null | undefined;

function norm(s: string) {
  return s.trim().toLowerCase();
}

export function pricingTypeFromNote(note: string | null | undefined, deployment?: DeploymentHint): PricingType {
  const n = note ? norm(note) : "";

  // If note explicitly calls it out, trust it.
  if (/(pepm|per\s*employee|employee\s*\/\s*month|employee\s*per\s*month)/i.test(n)) return "PEPM";
  if (/(per\s*user|user\s*\/\s*month|per\s*seat|seat\s*\/\s*month)/i.test(n)) return "Per user/month";
  if (/(one[-\s]*time|perpetual\s*license|license\s*fee|one\s*off)/i.test(n)) return "One-time";
  if (/(quote|contact\s*(sales|vendor)|custom\s*pricing|pricing\s*on\s*request)/i.test(n)) return "Quote-based";

  // Otherwise infer from deployment.
  if (deployment === "ONPREM") return "One-time";

  // Cloud/Hybrid defaults should be quote-based unless unit is known.
  return "Quote-based";
}

export function normalizePricingText(note: string | null | undefined, type: PricingType): string {
  const raw = note?.trim();
  if (!raw) {
    return type === "Quote-based" ? "Contact vendor / request quote" : "Info pending";
  }

  // Ensure we never show ambiguous units without a label.
  const n = raw.toLowerCase();
  const mentionsUnit = /(employee|user|seat|month|year|annual|one-time|license|maintenance|quote)/i.test(n);

  if (mentionsUnit) return raw;

  // If price exists but unit doesn't, add a minimal clarifier.
  if (/[₹$€]|\b(inr|usd|eur)\b/i.test(n)) {
    if (type === "PEPM") return `${raw} (PEPM)`;
    if (type === "Per user/month") return `${raw} (per user/month)`;
    if (type === "One-time") return `${raw} (one-time)`;
    return `${raw} (quote-based)`;
  }

  return raw;
}
