import * as React from "react";
import { Card } from "@/components/ui/Card";

export function FeatureGrid({
  features,
}: {
  features: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f) => (
        <Card key={f.title} className="p-5">
          <div className="text-base font-semibold text-zinc-900">{f.title}</div>
          <div className="mt-2 text-sm leading-6 text-zinc-600">{f.description}</div>
        </Card>
      ))}
    </div>
  );
}
