import Link from "next/link";
import * as React from "react";
import { Briefcase, Calculator, Clock, UserSearch, Target } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type CategorySlug = "hrms" | "payroll" | "attendance" | "ats" | "performance";

const iconBySlug: Record<CategorySlug, React.ComponentType<{ size?: number }>> = {
  hrms: Briefcase,
  payroll: Calculator,
  attendance: Clock,
  ats: UserSearch,
  performance: Target,
};

export function CategoryCard({
  slug,
  name,
  description,
  toolCount,
  indiaReady,
}: {
  slug: CategorySlug;
  name: string;
  description: string;
  toolCount?: number;
  indiaReady?: boolean;
}) {
  const Icon = iconBySlug[slug];
  return (
    <Link href={`/tools?category=${encodeURIComponent(slug)}`} className="block">
      <Card className="h-full border border-[rgba(255,255,255,0.08)] bg-[#121634] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.14)] hover:shadow-md motion-reduce:transition-none">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="rounded-lg bg-[#171C3F] p-2 text-[#F5F7FF] ring-1 ring-[rgba(255,255,255,0.08)]">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-[#F5F7FF]">{name}</div>
              <div className="mt-1 text-sm leading-relaxed text-[#B6B9D8]">{description}</div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            {typeof toolCount === "number" ? (
              <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[#171C3F] px-2.5 py-1 text-xs font-semibold text-[#F5F7FF]">
                {toolCount} tools
              </span>
            ) : null}
            {indiaReady ? <Badge variant="verified">India-ready</Badge> : null}
          </div>
        </div>

        <div className="mt-4 text-sm font-medium text-[#8B5CF6]">Explore →</div>
      </Card>
    </Link>
  );
}
