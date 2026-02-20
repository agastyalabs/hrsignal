"use client";

import { useMemo, useState } from "react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function ShortlistModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => isValidEmail(email) && size && status !== "sending", [email, size, status]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-black/35" aria-label="Close" onClick={onClose} />

      <div className="relative w-full max-w-lg radius-card glass-panel p-6 shadow-float">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-600">Get my shortlist</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">A tailored shortlist in 60 seconds</div>
            <div className="mt-2 text-sm text-slate-600">No spam. No vendor blasting. Just signal.</div>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center radius-pill border border-slate-200 bg-white/70 text-slate-700 hover:bg-white"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            if (!canSubmit) {
              setError("Enter a valid work email and pick a company size.");
              return;
            }
            setStatus("sending");

            const resp = await fetch("/api/leads", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                type: "shortlist",
                email,
                metadata: {
                  source: "shortlist_modal",
                  name: name || undefined,
                  companySize: size,
                  companyName: "Unknown",
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
            window.setTimeout(() => onClose(), 700);
          }}
        >
          <div>
            <label className="text-sm font-semibold text-slate-900">Name</label>
            <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900">Work email</label>
            <input className="input mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-900">Company size</label>
            <select className="input mt-2" value={size} onChange={(e) => setSize(e.target.value)} required>
              <option value="">Select</option>
              <option value="20-200">20–200</option>
              <option value="201-500">201–500</option>
              <option value="501-1000">501–1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>

          {error ? <div className="text-sm font-semibold text-rose-600">{error}</div> : null}
          {status === "sent" ? <div className="text-sm font-semibold text-emerald-700">Sent. Check your inbox.</div> : null}

          <button
            type="submit"
            className={
              "h-11 w-full radius-pill px-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 " +
              (canSubmit ? "bg-[#6F42C1] hover:bg-[#5E2FDE] shadow-[0_18px_52px_rgba(111,66,193,0.18)]" : "bg-slate-300")
            }
            disabled={!canSubmit}
          >
            {status === "sending" ? "Submitting…" : "Get my shortlist"}
          </button>

          <p className="text-center text-xs text-slate-500">We’ll email you next steps. Privacy-first.</p>
        </form>
      </div>
    </div>
  );
}
