import * as React from "react";
import { ShieldCheck, Sparkles, FileText, MapPin } from "lucide-react";

import { Card } from "@/components/ui/Card";

const items = [
  {
    title: "Verified listings",
    description: "Freshness cues and transparent listing details.",
    icon: ShieldCheck,
    tone: "purple",
  },
  {
    title: "Explainable recommendations",
    description: "See why a tool matches your needs — no black box.",
    icon: Sparkles,
    tone: "teal",
  },
  {
    title: "Privacy-first",
    description: "We don’t share your details without consent.",
    icon: FileText,
    tone: "slate",
  },
  {
    title: "India-first SME fit",
    description: "Compliance and integrations that matter locally.",
    icon: MapPin,
    tone: "teal",
  },
] as const;

function iconClass(tone: (typeof items)[number]["tone"]) {
  switch (tone) {
    case "purple":
      return "bg-[color:var(--primary)]/12 text-[color:var(--primary)]";
    case "teal":
      return "bg-[color:var(--accent)]/12 text-[color:var(--accent)]";
    default:
      return "bg-[var(--surface-2)] text-[var(--text)]";
  }
}

export function TrustStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <Card key={it.title} className="border border-[var(--border)] bg-[var(--surface-2)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 rounded-xl p-2 ${iconClass(it.tone)}`}>
              <it.icon size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">{it.title}</div>
              <div className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{it.description}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
