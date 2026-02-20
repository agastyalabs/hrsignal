import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function LoadingTools() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <div className="h-8 w-56 rounded bg-slate-100 animate-pulse" />
        <div className="mt-2 h-4 w-96 rounded bg-slate-100 animate-pulse" />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4 radius-card border border-slate-200 bg-white p-4 shadow-soft">
            <div className="h-5 w-40 rounded bg-slate-100 animate-pulse" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 w-full rounded bg-slate-100 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="radius-card border border-slate-200 bg-white p-5 shadow-soft">
                  <div className="h-5 w-48 rounded bg-slate-100 animate-pulse" />
                  <div className="mt-3 h-4 w-full rounded bg-slate-100 animate-pulse" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
                  <div className="mt-6 h-10 w-full rounded bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
