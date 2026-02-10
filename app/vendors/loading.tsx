export default function VendorsLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="h-9 w-48 animate-pulse rounded-xl bg-[var(--surface-2)]" />
        <div className="mt-3 h-4 w-[32rem] max-w-full animate-pulse rounded bg-[var(--surface-2)]" />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]" />
          ))}
        </div>
      </div>
    </div>
  );
}
