import Link from "next/link";
import Image from "next/image";
import * as React from "react";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export type ToolCardModel = {
  slug: string;
  name: string;
  vendorName?: string;
  categories: string[];
  tagline?: string;
  verified?: boolean;
};

export function ToolCard({ tool }: { tool: ToolCardModel }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="block">
      <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-50">
              <Image src="/placeholders/tool.svg" alt="" width={24} height={24} className="opacity-70" />
            </div>
            <div>
              <div className="text-base font-semibold text-zinc-900">{tool.name}</div>
              {tool.vendorName ? <div className="mt-1 text-sm text-zinc-600">by {tool.vendorName}</div> : null}
            </div>
          </div>
          {tool.verified ? <Badge variant="verified">Verified</Badge> : null}
        </div>

        {tool.tagline ? <div className="mt-3 text-sm leading-6 text-zinc-700">{tool.tagline}</div> : null}

        {tool.categories?.length ? (
          <div className="mt-4 text-xs text-zinc-600">{tool.categories.join(" • ")}</div>
        ) : null}

        <div className="mt-4 text-sm font-medium text-indigo-700">View details →</div>
      </Card>
    </Link>
  );
}
