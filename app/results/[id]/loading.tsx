export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-zinc-200" />
        <div className="mt-3 h-4 w-96 animate-pulse rounded bg-zinc-200" />

        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
          ))}
        </div>

        <div className="mt-10 h-52 animate-pulse rounded-2xl border border-zinc-200 bg-white" />
      </div>
    </div>
  );
}
