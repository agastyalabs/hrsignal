import * as React from "react";
import { Card } from "@/components/ui/Card";

const testimonials = [
  {
    quote:
      "We narrowed down payroll tools in one sitting. The shortlist was practical and India-compliance focused.",
    name: "HR lead",
    company: "Manufacturing SME (early access feedback)",
  },
  {
    quote: "The ‘why this tool’ reasons made it easy to explain our choice internally.",
    name: "Founder",
    company: "Services company (early access feedback)",
  },
  {
    quote: "We shared requirements once and got a clean next step — no spammy vendor blast.",
    name: "Finance lead",
    company: "Retail business (early access feedback)",
  },
] as const;

export function TestimonialStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <Card key={t.quote} className="border border-[#1F2937] bg-[#111827] p-5">
          <p className="text-sm leading-6 text-[#CBD5E1]">“{t.quote}”</p>
          <div className="mt-4 text-xs font-medium text-[#F9FAFB]">
            {t.name} · <span className="text-[#94A3B8]">{t.company}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
