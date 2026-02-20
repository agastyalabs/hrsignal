"use client";

import { useEffect, useMemo, useState } from "react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function LeadMagnetPopup() {
  const storageKey = "hrsignal_leadmagnet_top10_2025_dismissed_v1";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => isValidEmail(email) && status !== "sending", [email, status]);

  useEffect(() => {
    // Don’t show repeatedly
    try {
      if (localStorage.getItem(storageKey) === "1") return;
    } catch {}

    let shown = false;

    const show = () => {
      if (shown) return;
      shown = true;
      setOpen(true);
    };

    // 60% scroll
    const onScroll = () => {
      if (shown) return;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      if (height <= 0) return;
      if (scrollTop / height >= 0.6) show();
    };

    // exit intent (desktop)
    const onMouseOut = (e: MouseEvent) => {
      if (shown) return;
      if (e.clientY <= 0) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  if (!open) return null;

  const dismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/30" aria-label="Close" onClick={dismiss} />

      <div className="relative w-full max-w-lg radius-card glass-panel p-6 shadow-float">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Free PDF</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              Top 10 HR Tools India 2025
            </div>
            <div className="mt-2 text-sm text-slate-600">One email. No name. No spam.</div>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center radius-pill border border-slate-200 bg-white/70 text-slate-700 hover:bg-white"
            aria-label="Close"
            onClick={dismiss}
          >
            ×
          </button>
        </div>

        <form
          className="mt-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            if (!canSubmit) {
              setError("Enter a valid work email.");
              return;
            }

            setStatus("sending");
            const resp = await fetch("/api/leads", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                type: "generic",
                email,
                metadata: {
                  source: "lead_magnet_top10_2025",
                },
              }),
            }).catch(() => null);

            if (!resp || !resp.ok) {
              const msg = resp ? await resp.json().catch(() => null) : null;
              setError(msg?.error || "Could not submit. Please retry.");
              setStatus("error");
              return;
            }

            setStatus("sent");
            try {
              localStorage.setItem(storageKey, "1");
            } catch {}
          }}
        >
          <label className="text-sm font-semibold text-slate-900">Work email</label>
          <input
            className="input mt-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
          />

          {error ? <div className="mt-2 text-sm font-semibold text-rose-600">{error}</div> : null}
          {status === "sent" ? (
            <div className="mt-2 text-sm font-semibold text-emerald-700">Done. Check your inbox shortly.</div>
          ) : null}

          <button
            type="submit"
            className={
              "mt-4 h-11 w-full radius-pill px-4 text-sm font-semibold text-white transition-colors " +
              (canSubmit ? "bg-[var(--primary-blue)] hover:bg-[var(--primary-dark)]" : "bg-slate-300")
            }
            disabled={!canSubmit}
          >
            Get the PDF
          </button>

          <div className="mt-3 text-xs text-slate-500">By downloading, you agree to receive one email with the PDF.</div>
        </form>
      </div>
    </div>
  );
}
