// HRSignal Filters & Taxonomy v1
// Implements safe, schema-compatible mappings + backward-compatible URL param normalization.

export type SizeBucketV1 = "smb" | "mid" | "enterprise";
export type PricingMetricV1 = "pepm" | "one_time" | "quote_based" | "per_company_month";
export type DeploymentV1 = "cloud" | "onprem" | "hybrid";
export type EvidenceV1 = "verified" | "needs_validation";

export function sizeLabel(bucket: SizeBucketV1): string {
  if (bucket === "smb") return "20–200";
  if (bucket === "mid") return "201–1000";
  return "1001+";
}

export function normalizeSizeParam(raw: string | null | undefined): SizeBucketV1 | null {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v) return null;

  // Canonical values
  if (v === "smb" || v === "20-200" || v === "20–200") return "smb";
  if (v === "mid" || v === "201-1000" || v === "201–1000") return "mid";
  if (v === "enterprise" || v === "1001+" || v === "1001" || v === "1000+") return "enterprise";

  // Legacy buckets used across the app previously.
  // Map to best-fitting taxonomy bucket.
  if (["1-10", "11-50", "51-200", "20-200"].includes(v)) return "smb";
  if (["201-500", "501-1000", "201-1000"].includes(v)) return "mid";
  if (["1001-5000", "5001-10000", "10000+"].includes(v)) return "enterprise";

  return null;
}

export function mapSizeBucketToLegacyBands(bucket: SizeBucketV1): string[] {
  // Stable mapping to current Prisma BuyerSizeBand enum.
  if (bucket === "smb") return ["EMP_20_200"];
  if (bucket === "mid") return ["EMP_100_1000"];

  // Enterprise is not representable with current schema.
  // Best-effort: match the largest available legacy band.
  return ["EMP_100_1000"];
}

export function normalizeDeploymentParam(raw: string | null | undefined): DeploymentV1 | null {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v) return null;
  if (v === "cloud" || v === "saas") return "cloud";
  if (v === "onprem" || v === "on-prem" || v === "on_prem" || v === "onpremise" || v === "on-premise") return "onprem";
  if (v === "hybrid") return "hybrid";

  // Prisma enum values sometimes appear in URLs
  if (v === "cloud" || v === "cloud") return "cloud";
  if (v === "onprem") return "onprem";
  if (v === "hybrid") return "hybrid";

  if (v === "cloud" || v === "c") return "cloud";
  return null;
}

export function deploymentToPrismaEnum(d: DeploymentV1): "CLOUD" | "ONPREM" | "HYBRID" {
  if (d === "onprem") return "ONPREM";
  if (d === "hybrid") return "HYBRID";
  return "CLOUD";
}

export function normalizePricingMetricParam(raw: string | null | undefined): PricingMetricV1 | null {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v) return null;

  // Canonical
  if (v === "pepm") return "pepm";
  if (v === "one_time" || v === "one-time" || v === "onetime") return "one_time";
  if (v === "quote_based" || v === "quote-based" || v === "quote") return "quote_based";
  if (v === "per_company_month" || v === "per-company" || v === "company_month") return "per_company_month";

  // Legacy values from earlier UI
  if (v === "per_employee_month" || v === "per employee" || v === "per employee/month") return "pepm";
  if (v === "one time" || v === "license") return "one_time";

  return null;
}

export function pricingMetricLabel(metric: PricingMetricV1): string {
  if (metric === "pepm") return "PEPM";
  if (metric === "one_time") return "One-time";
  if (metric === "per_company_month") return "Per company / month";
  return "Quote-based";
}

export function pricingTypeToMetric(type: string | null | undefined): PricingMetricV1 {
  const t = String(type ?? "").toLowerCase();
  if (t === "per_employee_month") return "pepm";
  if (t === "one_time") return "one_time";
  if (t === "per_company_month") return "per_company_month";
  return "quote_based";
}

export function normalizeEvidenceParam(raw: string | null | undefined): EvidenceV1 | null {
  const v = String(raw ?? "").trim().toLowerCase();
  if (!v) return null;
  if (v === "verified") return "verified";
  if (v === "needs_validation" || v === "needs-validation" || v === "unverified") return "needs_validation";
  if (v === "1" || v === "true") return "verified";
  if (v === "0" || v === "false") return "needs_validation";
  return null;
}

export function buildRedirectIfNormalized(args: {
  basePath: string;
  sp: Record<string, string | undefined>;
  normalize: (k: string, v: string | undefined) => string | null;
}): string | null {
  const url = new URL("http://local" + args.basePath);
  let changed = false;

  for (const [k, v] of Object.entries(args.sp)) {
    if (typeof v !== "string" || !v) continue;
    const norm = args.normalize(k, v);
    if (norm && norm !== v) {
      url.searchParams.set(k, norm);
      changed = true;
    } else {
      url.searchParams.set(k, v);
    }
  }

  return changed ? (url.pathname + "?" + url.searchParams.toString()) : null;
}
