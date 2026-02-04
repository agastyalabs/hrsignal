import * as React from "react";
import { Card } from "@/components/ui/Card";

const testimonials = [
  {
    quote:
      "We narrowed down payroll tools in one sitting. The shortlist was practical and India-compliance focused.",
    name: "HR Manager",
    company: "Manufacturing SME",
  },
  {
    quote:
      "The ‘why this tool’ reasons made it easy to explain our choice internally.",
    name: "Founder",
    company: "Services company",
  },
  {
    quote:
      "We shared requirements once and got a clean next step — no spammy vendor blast.",
    name: "Finance lead",
    company: "Retail business",
  },
] as const;

export function TestimonialStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.quote} className="p-5">
          <p className="text-sm leading-6 text-zinc-700">“{t.quote}”</p>
          <div className="mt-4 text-xs font-medium text-zinc-900">
            {t.name} · <span className="text-zinc-600">{t.company}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
