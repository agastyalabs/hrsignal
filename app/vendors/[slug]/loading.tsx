import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function LoadingVendor() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="radius-card border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-slate-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-7 w-56 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-72 rounded bg-slate-100 animate-pulse" />
              </div>
            </div>
            <div className="h-24 w-44 rounded-xl bg-slate-100 animate-pulse" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="radius-card border border-slate-200 bg-white p-6 shadow-soft">
                <div className="h-5 w-48 rounded bg-slate-100 animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 lg:sticky lg:top-[96px] lg:self-start">
            <div className="radius-inner glass-panel p-5 shadow-soft">
              <div className="h-5 w-40 rounded bg-slate-100 animate-pulse" />
              <div className="mt-4 h-28 w-full rounded bg-slate-100 animate-pulse" />
            </div>
            <div className="radius-inner border border-slate-200 bg-white p-5 shadow-soft">
              <div className="h-5 w-48 rounded bg-slate-100 animate-pulse" />
              <div className="mt-4 h-44 w-full rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
