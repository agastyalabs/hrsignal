"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CompareActions({ tools }: { tools: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [copied, setCopied] = useState(false);

  const diffOnly = sp.get("diff") === "1";

  const url = useMemo(() => {
    const params = new URLSearchParams(sp.toString());
    params.set("tools", tools.join(","));
    // keep diff param as-is
    return `${typeof window !== "undefined" ? window.location.origin : ""}${pathname}?${params.toString()}`;
  }, [pathname, sp, tools]);

  function setDiff(next: boolean) {
    const params = new URLSearchParams(sp.toString());
    params.set("tools", tools.join(","));
    if (next) params.set("diff", "1");
    else params.delete("diff");
    router.replace(`${pathname}?${params.toString()}`);
  }

  async function copyLink() {
    const toCopy = url || (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = toCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  async function share() {
    const toShare = url || (typeof window !== "undefined" ? window.location.href : "");
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as unknown as { share: (d: { title?: string; url?: string }) => Promise<void> }).share({
          title: "HRSignal – Compare tools",
          url: toShare,
        });
      } catch {
        // ignore
      }
      return;
    }
    await copyLink();
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
        onClick={() => setDiff(!diffOnly)}
        aria-pressed={diffOnly}
        aria-label={diffOnly ? "Show all rows" : "Show differences only"}
      >
        {diffOnly ? "Show all rows" : "Show differences only"}
      </button>

      <button
        type="button"
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
        onClick={copyLink}
        aria-label="Copy compare link"
      >
        {copied ? "Copied" : "Copy link"}
      </button>

      <button
        type="button"
        className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
        onClick={share}
        aria-label="Share compare link"
      >
        Share
      </button>
    </div>
  );
}
