import fs from "node:fs/promises";
import path from "node:path";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { MDXRemote } from "next-mdx-remote/rsc";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";

import { complianceMdxComponents } from "@/components/compliance/mdx-components";
import { COMPLIANCE_GUIDES, guideBySlug, isComplianceGuideSlug } from "@/lib/compliance/guides";

export const dynamic = "force-static";

function extractToc(mdx: string): Array<{ depth: 2 | 3; text: string; id: string }> {
  const lines = mdx.split(/\r?\n/);
  const out: Array<{ depth: 2 | 3; text: string; id: string }> = [];

  let inFence = false;
  const used = new Map<string, number>();

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }

    if (inFence) continue;

    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;

    const depth = m[1].length as 2 | 3;
    const text = m[2].replace(/`/g, "").trim();
    if (!text) continue;

    let id = slugify(text);
    const seen = used.get(id) ?? 0;
    used.set(id, seen + 1);
    if (seen > 0) id = `${id}-${seen + 1}`;

    out.push({ depth, text, id });
  }

  return out;
}

async function loadGuide(slug: string) {
  if (!isComplianceGuideSlug(slug)) return null;

  const file = path.join(process.cwd(), "content", "compliance", `${slug}.mdx`);
  const mdx = await fs.readFile(file, "utf8").catch(() => null);
  if (!mdx) return null;

  // Very light frontmatter extraction (title/description) for safety; content still renders.
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(mdx);
  const front = fm?.[1] ?? "";
  const title = /\ntitle:\s*(.+)\n/.exec(`\n${front}\n`)?.[1]?.trim();
  const description = /\ndescription:\s*(.+)\n/.exec(`\n${front}\n`)?.[1]?.trim();

  const body = fm ? mdx.slice(fm[0].length) : mdx;
  const toc = extractToc(body);

  return { body, toc, title, description };
}

export async function generateStaticParams() {
  return COMPLIANCE_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isComplianceGuideSlug(slug)) return {};
  const base = guideBySlug(slug);
  const loaded = await loadGuide(slug);

  const title = loaded?.title ? `${loaded.title} | HR Signal` : `${base.title} | HR Signal`;
  const description = loaded?.description ?? base.description;

  return {
    title,
    description,
    alternates: {
      canonical: `/compliance/${slug}`,
    },
  };
}

export default async function ComplianceGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const base = isComplianceGuideSlug(slug) ? guideBySlug(slug) : null;
  const loaded = await loadGuide(slug);
  if (!base || !loaded) return notFound();

  const toc = loaded.toc;
  const related = COMPLIANCE_GUIDES.filter((g) => g.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main className="py-10 sm:py-14">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Sidebar */}
            <aside className="lg:col-span-3">
              <div className="sticky top-20 space-y-4">
                <Card className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[var(--text)]">Table of contents</div>
                    {slug === "pf-compliance-guide" ? (
                      <Link
                        href="/compliance"
                        className="text-xs font-semibold text-violet-200 underline decoration-[rgba(124,77,255,0.35)] underline-offset-4 hover:text-violet-100 hover:decoration-[rgba(124,77,255,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      >
                        View all guides
                      </Link>
                    ) : null}
                  </div>

                  <div className="mt-3 space-y-2">
                    {toc.length ? (
                      toc.map((t) => (
                        <a
                          key={`${t.depth}-${t.id}`}
                          href={`#${t.id}`}
                          className={`block text-sm text-[var(--text-muted)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                            t.depth === 3 ? "pl-4" : ""
                          }`}
                        >
                          {t.text}
                        </a>
                      ))
                    ) : (
                      <div className="text-sm text-[var(--text-muted)]">No headings found.</div>
                    )}
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="text-sm font-semibold text-[var(--text)]">Ask a question</div>
                  <div className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                    Get my shortlist + validation checklist for your payroll setup.
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/recommend?mode=detailed&source=compliance&prefill=${encodeURIComponent(slug)}`}
                      className="inline-flex h-11 w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(111,66,193,0.32)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_rgba(111,66,193,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      Ask about my setup
                    </Link>
                  </div>
                </Card>
              </div>
            </aside>

            {/* Content */}
            <article className="lg:col-span-9">
              <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 sm:p-8">
                <div className="text-xs font-semibold tracking-[0.12em] text-[var(--text-muted)]">COMPLIANCE GUIDE</div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
                  {loaded.title ?? base.title}
                </h1>
                <p className="mt-3 text-[18px] leading-8 text-[var(--text-muted)]">
                  {loaded.description ?? base.description}
                </p>

                <div className="mt-8 compliance-mdx">
                  <MDXRemote
                    source={loaded.body}
                    components={complianceMdxComponents}
                    options={{
                      mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeSlug],
                      },
                    }}
                  />
                </div>
              </div>

              {/* Related guides */}
              <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
                <div className="text-base font-semibold text-[var(--text)]">Related guides</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">More compliance deep-dives for payroll buyers.</div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {related.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/compliance/${g.slug}`}
                      className="group rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4 transition-all duration-200 hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      <div className="text-sm font-semibold text-[var(--text)]">{g.title}</div>
                      <div className="mt-1 text-sm leading-7 text-[var(--text-muted)]">{g.description}</div>
                      <div className="mt-2 text-sm font-semibold text-violet-200 group-hover:text-violet-100">
                        Read →
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <style
                // scoped-ish: classname wrapper
                dangerouslySetInnerHTML={{
                  __html: `
                    .compliance-mdx {
                      font-size: 18px;
                      line-height: 1.75;
                    }
                    .compliance-mdx h2 {
                      margin-top: 2.25rem;
                      font-size: 1.25rem;
                      font-weight: 800;
                      letter-spacing: -0.01em;
                      color: var(--text);
                    }
                    .compliance-mdx h3 {
                      margin-top: 1.25rem;
                      font-size: 1.05rem;
                      font-weight: 700;
                      color: var(--text);
                    }
                    .compliance-mdx p { margin-top: 0.85rem; color: var(--text-muted); }
                    .compliance-mdx ul { margin-top: 0.85rem; padding-left: 1.25rem; color: var(--text-muted); }
                    .compliance-mdx li { margin-top: 0.35rem; }
                    .compliance-mdx pre {
                      margin-top: 1rem;
                      overflow: auto;
                      border-radius: 12px;
                      border: 1px solid rgba(255,255,255,0.10);
                      background: rgba(2, 6, 23, 0.65);
                      padding: 14px;
                    }
                    .compliance-mdx pre code {
                      background: transparent;
                      border: 0;
                      padding: 0;
                    }
                    .compliance-mdx input[type=checkbox] { accent-color: var(--primary); }
                  `,
                }}
              />
            </article>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </div>
  );
}
