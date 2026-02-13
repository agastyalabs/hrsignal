import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

const VENDORS = [
  { slug: "keka", name: "Keka", href: "/vendors/keka" },
  { slug: "greythr", name: "greytHR", href: "/vendors/greythr" },
  { slug: "darwinbox", name: "Darwinbox", href: "/vendors/darwinbox" },
  { slug: "peoplestrong", name: "PeopleStrong", href: "/vendors/peoplestrong" },
  { slug: "pocket-hrms", name: "Pocket HRMS", href: "/vendors/pocket-hrms" },
  { slug: "freshteam", name: "Freshteam", href: "/vendors/freshteam" },
] as const;

export function VendorLogoStrip({
  title = "Popular vendors",
  subtitle = "A few commonly evaluated vendors in the India-first HR stack.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-[var(--text)]">{title}</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</div>
        </div>
        <Link className="text-sm font-medium text-[var(--link)] hover:opacity-90" href="/vendors">
          Browse vendors →
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {VENDORS.map((v) => (
          <Link
            key={v.slug}
            href={v.href}
            className="group flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            aria-label={v.name}
          >
            <Image
              src={`/vendor-logos/${v.slug}.png`}
              alt={v.name}
              width={96}
              height={96}
              className="h-8 w-auto opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="sr-only">{v.name}</span>
          </Link>
        ))}
      </div>

      <div className="mt-4 text-xs text-[var(--text-muted)]">Logos are shown for quick recognition; always validate fit using evidence and last-checked dates.</div>
    </Card>
  );
}
