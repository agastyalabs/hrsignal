import { promises as fs } from "fs";
import path from "path";

export type VendorBrief = {
  slug: string;
  exists: boolean;
  updatedAt: Date | null;
  raw: string | null;
  sections: Record<string, string>; // keyed by normalized heading
};

function slugify(name: string) {
  return String(name)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function normalizeHeading(h: string) {
  return h
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function splitMarkdownByH2(markdown: string): Record<string, string> {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: Record<string, string> = {};

  let currentKey: string | null = null;
  let buf: string[] = [];

  const flush = () => {
    if (!currentKey) return;
    const text = buf.join("\n").trim();
    if (text) out[currentKey] = text;
    buf = [];
  };

  for (const line of lines) {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (m) {
      flush();
      currentKey = normalizeHeading(m[1]);
      continue;
    }

    // Ignore top-level H1 (title) lines so sections stay clean.
    if (/^#\s+/.test(line)) continue;

    if (currentKey) buf.push(line);
  }
  flush();

  return out;
}

export async function getVendorBrief(input: {
  vendorName: string;
  vendorSlug?: string | null;
  toolSlugs?: string[];
  // If you already have the URL slug (e.g., /vendors/<slug>), pass it here.
  urlSlug?: string | null;
}): Promise<VendorBrief> {
  const base = input.urlSlug?.trim()
    ? slugify(input.urlSlug)
    : input.vendorSlug?.trim()
      ? slugify(input.vendorSlug)
      : slugify(input.vendorName);

  // Special case: Freshteam should resolve to freshteam.
  const toolSlugs = new Set((input.toolSlugs ?? []).map((s) => String(s).toLowerCase()));
  const slug = toolSlugs.has("freshteam") || base.includes("freshteam") ? "freshteam" : base;

  const filePath = path.join(process.cwd(), "docs", "vendors", `${slug}.md`);

  try {
    const [raw, stat] = await Promise.all([fs.readFile(filePath, "utf8"), fs.stat(filePath)]);
    return {
      slug,
      exists: true,
      updatedAt: stat.mtime,
      raw,
      sections: splitMarkdownByH2(raw),
    };
  } catch {
    return {
      slug,
      exists: false,
      updatedAt: null,
      raw: null,
      sections: {},
    };
  }
}
