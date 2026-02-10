export default function VendorCompareLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="h-8 w-64 animate-pulse rounded-xl bg-[var(--surface-2)]" />
        <div className="mt-3 h-4 w-[30rem] max-w-full animate-pulse rounded bg-[var(--surface-2)]" />
        <div className="mt-8 h-80 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-1)]" />
      </div>
    </div>
  );
}
