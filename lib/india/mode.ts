export function indiaOnlyFromSearchParams(sp: { india?: string } | null | undefined): boolean {
  // Default ON
  return sp?.india !== "0";
}

export function clampCsv(raw: string | null | undefined, max: number) {
  if (!raw) return [] as string[];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}
