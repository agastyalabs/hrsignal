"use client";

import { useState } from "react";

import RecommendInner from "@/components/recommend/RecommendInner";

export function RecommendTabs() {
  const [mode, setMode] = useState<"quick" | "detailed">("quick");

  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#111827] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-[#F9FAFB]">Recommendation mode</div>
          <div className="mt-1 text-sm text-[#CBD5E1]">
            Choose quick for a fast shortlist, or detailed for more tailored match reasons.
          </div>
        </div>

        <div className="inline-flex rounded-xl border border-[#1F2937] bg-[#0F172A] p-1">
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
              mode === "quick" ? "bg-[#7441F2] text-[#F9FAFB]" : "text-[#CBD5E1] hover:text-[#F9FAFB]"
            }`}
            aria-pressed={mode === "quick"}
          >
            Quick
          </button>
          <button
            type="button"
            onClick={() => setMode("detailed")}
            className={`h-9 rounded-lg px-3 text-sm font-medium transition-colors ${
              mode === "detailed" ? "bg-[#7441F2] text-[#F9FAFB]" : "text-[#CBD5E1] hover:text-[#F9FAFB]"
            }`}
            aria-pressed={mode === "detailed"}
          >
            Detailed
          </button>
        </div>
      </div>

      <div className="mt-5">
        {mode === "quick" ? (
          <div className="space-y-4">
            <div className="text-sm text-[#CBD5E1]">
              Answer a couple of questions. We’ll recommend 3–5 best‑fit tools with clear match reasons.
            </div>

            <form className="space-y-4" action="/recommend/submit" method="post">
              <div>
                <label className="text-sm font-medium text-[#CBD5E1]">Company name</label>
                <input className="input mt-1" name="companyName" required placeholder="Acme Pvt Ltd" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#CBD5E1]">Work email</label>
                <input className="input mt-1" type="email" name="buyerEmail" required placeholder="you@company.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#CBD5E1]">Role (optional)</label>
                <input className="input mt-1" name="buyerRole" placeholder="Founder / HR / Ops" />
              </div>

              <button className="h-11 w-full rounded-lg bg-[#7441F2] px-4 text-sm font-medium text-[#F9FAFB] hover:bg-[#825AE0]">
                Continue
              </button>

              <p className="text-center text-xs leading-relaxed text-[#94A3B8]">
                Privacy-first: we don’t share your details without consent.
              </p>
            </form>
          </div>
        ) : (
          <RecommendInner mode="recommend" embedded />
        )}
      </div>
    </div>
  );
}
