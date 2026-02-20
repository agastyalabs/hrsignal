"use client";

import Link from "next/link";

export default function VendorError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] px-5 py-16 text-[var(--text-main)]">
      <div className="mx-auto max-w-xl radius-card border border-slate-200 bg-white p-8 shadow-soft">
        <div className="text-xs font-bold uppercase tracking-wide text-rose-600">Something broke</div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Vendor page failed to load</h1>
        <p className="mt-2 text-sm text-slate-600">No white-screen. You can retry or go back.</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="h-11 radius-pill bg-[var(--primary-blue)] px-5 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
          >
            Retry
          </button>
          <Link
            href="/vendors"
            className="h-11 inline-flex items-center radius-pill border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to vendors
          </Link>
        </div>

        <pre className="mt-6 overflow-x-auto rounded-xl bg-slate-50 p-4 text-xs text-slate-600">{error.message}</pre>
      </div>
    </div>
  );
}
