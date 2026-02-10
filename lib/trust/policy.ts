export type TrustLevel = "verified" | "partial" | "unverified";

export type TrustMeta = {
  trustLevel: TrustLevel;
  sourcesCount?: number | null;
  lastCheckedAt?: Date | string | null;
  /** Optional rating value; if missing, rating row is omitted entirely. */
  ratingValue?: number | null;
  ratingCount?: number | null;
};

export function normalizeSourcesCount(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  if (n <= 0) return null;
  return Math.floor(n);
}

export function normalizeLastCheckedAt(v: unknown): Date | null {
  if (!v) return null;
  if (v instanceof Date) return Number.isFinite(v.getTime()) ? v : null;
  const s = String(v);
  const d = new Date(s);
  return Number.isFinite(d.getTime()) ? d : null;
}

export function formatYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
