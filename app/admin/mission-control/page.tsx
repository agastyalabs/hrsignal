export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { missionControlAllowed } from "@/lib/internal/missionControl";

export default async function AdminMissionControlPage() {
  if (!missionControlAllowed()) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Mission Control</h1>
            <p className="mt-1 text-sm text-zinc-600">Local-only admin console (dev + LAN-safe).</p>
          </div>
          <a className="rounded-md border border-zinc-300 bg-white px-4 py-2" href="/admin">
            Back to Admin
          </a>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-700">
            Mission Control route is active. If you reached this page from an iPad on LAN, the local-only gate is working.
          </div>
          <div className="mt-3 text-xs text-zinc-500">
            Note: Hosted production domains remain hard-disabled (404). LAN access is allowed only for private RFC1918
            hosts/IPs.
          </div>
        </div>
      </div>
    </div>
  );
}
