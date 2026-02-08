import fs from "node:fs";
import path from "node:path";

export type ResourceArticle = {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  author: string;
  tags: string[];
  category: string;
  readingTime: string;
  content: string;
  featured?: boolean;
};

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const trimmed = raw.replace(/\r\n/g, "\n");
  if (!trimmed.startsWith("---\n")) return { meta: {}, body: trimmed };

  const end = trimmed.indexOf("\n---\n", 4);
  if (end === -1) return { meta: {}, body: trimmed };

  const fm = trimmed.slice(4, end).trim();
  const body = trimmed.slice(end + "\n---\n".length);

  const meta: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^([a-zA-Z0-9_\-]+):\s*(.*)\s*$/);
    if (!m) continue;
    meta[m[1]] = m[2].trim();
  }
  return { meta, body };
}

function parseCsvList(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function wordCount(s: string) {
  return s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#\-*`]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function readingTimeFromWords(words: number) {
  const mins = Math.max(3, Math.round(words / 200));
  return `${mins} min`;
}

export function loadResourceArticles(): ResourceArticle[] {
  const root = process.cwd();
  const dir = path.join(root, "content", "resources");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .sort();

  const out: ResourceArticle[] = [];

  for (const file of files) {
    const slug = file.replace(/\.(md|mdx)$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { meta, body } = parseFrontmatter(raw);

    const title = meta.title ?? slug;
    const summary = meta.summary ?? "";
    const date = meta.date ?? "2026-02-08";
    const category = meta.category ?? "Guide";
    const tags = parseCsvList(meta.tags);
    const author = meta.author ?? "HRSignal";
    const featured = (meta.featured ?? "").toLowerCase() === "true";

    const words = wordCount(body);

    out.push({
      slug,
      title,
      summary,
      date,
      author,
      category,
      tags,
      readingTime: readingTimeFromWords(words),
      content: body.trim(),
      featured,
    });
  }

  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}
