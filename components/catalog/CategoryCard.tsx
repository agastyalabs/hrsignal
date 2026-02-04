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
  indiaReady,
}: {
  slug: CategorySlug;
  name: string;
  description: string;
  indiaReady?: boolean;
}) {
  const Icon = iconBySlug[slug];
  return (
    <Link href={`/tools?category=${encodeURIComponent(slug)}`}>
      <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-zinc-50 p-2 text-zinc-800">
              <Icon size={18} />
            </div>
            <div>
              <div className="text-base font-semibold text-zinc-900">{name}</div>
              <div className="mt-1 text-sm leading-6 text-zinc-600">{description}</div>
            </div>
          </div>
          {indiaReady ? <Badge variant="verified">India-ready</Badge> : null}
        </div>
        <div className="mt-4 text-sm font-medium text-indigo-700">Explore →</div>
      </Card>
    </Link>
  );
}
