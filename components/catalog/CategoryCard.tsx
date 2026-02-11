import Link from "next/link";
import * as React from "react";
import {
  Briefcase,
  Calculator,
  Clock,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Target,
  UserSearch,
  HeartHandshake,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type CategorySlug = string;

const iconBySlug: Record<string, React.ComponentType<{ size?: number }>> = {
  hrms: Briefcase,
  payroll: Calculator,
  attendance: Clock,
  ats: UserSearch,
  performance: Target,
  bgv: ShieldCheck,
  lms: GraduationCap,
  engagement: HeartHandshake,
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
  const Icon = iconBySlug[slug] ?? Sparkles;

  return (
    <Link href={`/categories/${encodeURIComponent(slug)}`} className="block">
      <Card className="h-full p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-2.5 text-[var(--text)]">
              <Icon size={18} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-[var(--text)]">{name}</div>
              <div className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">{description}</div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            {typeof toolCount === "number" ? (
              <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]">
                {toolCount} tools
              </span>
            ) : null}
            {indiaReady ? (
              <span className="rounded-full border border-[rgba(39,211,188,0.35)] bg-[rgba(39,211,188,0.10)] px-2.5 py-1 text-xs font-semibold text-[var(--text)]">
                India-ready
              </span>
            ) : null}
            {!indiaReady ? <Badge variant="verified">Directory</Badge> : null}
          </div>
        </div>

        <div className="mt-5 text-sm font-semibold text-[color:var(--accent)]">Explore →</div>
      </Card>
    </Link>
  );
}
