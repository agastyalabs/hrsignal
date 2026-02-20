"use client";

import { useEffect, useState } from "react";

export function UpvoteButton({ toolId, initial }: { toolId: string; initial: number }) {
  const [count, setCount] = useState(initial);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    setCount(initial);
  }, [initial]);

  return (
    <button
      type="button"
      className={
        "group inline-flex items-center gap-2 radius-pill border px-3 py-2 text-xs font-bold transition-all hover:scale-[1.05] " +
        (anim
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_18px_52px_rgba(16,185,129,0.18)]"
          : "border-slate-200 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700")
      }
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // optimistic
        setCount((c) => c + 1);
        setAnim(true);
        window.setTimeout(() => setAnim(false), 650);

        const resp = await fetch(`/api/tools/${encodeURIComponent(toolId)}/upvote`, {
          method: "POST",
        }).catch(() => null);

        if (!resp || !resp.ok) {
          // best-effort rollback
          setCount((c) => Math.max(0, c - 1));
        }
      }}
      aria-label="Upvote"
    >
      <span className="text-emerald-600">▲</span>
      <span>{count}</span>
      <span className="hidden text-slate-500 group-hover:text-emerald-700 sm:inline">upvote</span>
    </button>
  );
}
