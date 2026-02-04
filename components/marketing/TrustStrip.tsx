import * as React from "react";
import { ShieldCheck, Sparkles, FileText, MapPin } from "lucide-react";

const items = [
  {
    title: "Verified listings",
    description: "Freshness cues and transparent listing details.",
    icon: ShieldCheck,
  },
  {
    title: "Explainable recommendations",
    description: "See why a tool matches your needs — no black box.",
    icon: Sparkles,
  },
  {
    title: "Privacy-first",
    description: "We don’t share your details without consent.",
    icon: FileText,
  },
  {
    title: "India-first SME fit",
    description: "Compliance and integrations that matter locally.",
    icon: MapPin,
  },
] as const;

export function TrustStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <div key={it.title} className="rounded-xl border border-zinc-200 bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-indigo-50 p-2 text-indigo-700">
              <it.icon size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-900">{it.title}</div>
              <div className="mt-1 text-sm leading-6 text-zinc-600">{it.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
