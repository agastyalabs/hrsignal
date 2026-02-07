export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-zinc-200" />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="h-72 animate-pulse rounded-2xl bg-white border border-zinc-200" />
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-white border border-zinc-200" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
