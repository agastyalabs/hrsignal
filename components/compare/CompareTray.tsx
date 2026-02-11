"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useCompare } from "@/lib/compare/useCompare";
import { clearCompare } from "@/lib/compare/storage";

type ToolLite = {
  slug: string;
  name: string;
  vendorName: string | null;
};

function useToolsLite(slugs: string[]) {
  const [tools, setTools] = useState<ToolLite[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!slugs.length) {
        setTools([]);
        return;
      }

      try {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slugs }),
        });
        const json = (await res.json()) as unknown;
        if (cancelled) return;

        if (!res.ok || !json || typeof json !== "object" || !("ok" in json)) {
          setTools(slugs.map((s) => ({ slug: s, name: s, vendorName: null })));
          return;
        }

        const data = json as { ok: boolean; tools?: Array<{ slug: string; name: string; vendorName: string | null }> };
        if (!data.ok || !data.tools) {
          setTools(slugs.map((s) => ({ slug: s, name: s, vendorName: null })));
          return;
        }

        setTools(
          data.tools
            .filter(Boolean)
            .map((t) => ({ slug: t.slug, name: t.name, vendorName: t.vendorName ?? null }))
        );
      } catch {
        if (!cancelled) setTools(slugs.map((s) => ({ slug: s, name: s, vendorName: null })));
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [slugs]);

  return tools;
}

export function CompareTray() {
  const { slugs, count, set } = useCompare();
  const tools = useToolsLite(slugs);
  const selectionKey = slugs.join(",");
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const isDismissed = dismissedKey === selectionKey;

  const href = useMemo(() => {
    if (!slugs.length) return "/compare";
    return `/compare?tools=${encodeURIComponent(slugs.join(","))}`;
  }, [slugs]);

  if (!count || isDismissed) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-soft)] bg-[rgba(15,24,66,0.82)] text-[var(--text)] backdrop-blur"
      role="region"
      aria-label="Comparison tray"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-[var(--text)]">Compare</div>
            <span className="rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-semibold text-[var(--bg)]" aria-label={`${count} tools selected`}>
              {count}
            </span>
            <button
              type="button"
              className="ml-2 text-xs font-medium text-[var(--text-muted)] underline decoration-[rgba(255,255,255,0.25)] underline-offset-2 hover:text-[var(--text)]"
              onClick={() => {
                clearCompare();
              }}
              aria-label="Clear compare selection"
            >
              Clear
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {(tools ?? slugs.map((s) => ({ slug: s, name: s, vendorName: null }))).map((t) => (
              <span
                key={t.slug}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-1)] px-3 py-1 text-xs text-[var(--text)]"
              >
                <span className="truncate">
                  {t.name}
                  {t.vendorName ? <span className="text-[var(--text-muted)]"> · {t.vendorName}</span> : null}
                </span>
                <button
                  type="button"
                  className="rounded-full px-1 text-[var(--text-muted)] hover:text-[var(--text)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
                  onClick={() => set(slugs.filter((s) => s !== t.slug))}
                  aria-label={`Remove ${t.name} from compare`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="mt-2 text-xs text-[var(--text-muted)]">
            Tip: max 4 tools on mobile, 5 on desktop.
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={href}
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
            aria-label="Open compare page"
          >
            Compare now
          </Link>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-1)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
            onClick={() => {
              setDismissedKey(selectionKey);
            }}
            aria-label="Dismiss comparison tray"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
