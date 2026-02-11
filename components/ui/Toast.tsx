"use client";

import { useEffect } from "react";

export type ToastModel = {
  id: string;
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
  durationMs?: number;
};

export function Toast({ toast, onDone }: { toast: ToastModel; onDone: (id: string) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDone(toast.id), toast.durationMs ?? 4500);
    return () => clearTimeout(t);
  }, [toast.durationMs, toast.id, onDone]);

  const tone = toast.type ?? "info";
  const styles =
    tone === "success"
      ? "border-[rgba(39,211,188,0.35)] bg-[rgba(39,211,188,0.12)] text-[var(--text)]"
      : tone === "error"
        ? "border-[rgba(244,63,94,0.35)] bg-[rgba(244,63,94,0.12)] text-[var(--text)]"
        : "border-[var(--border-soft)] bg-[var(--surface-1)] text-[var(--text)]";

  return (
    <div className={`w-[min(92vw,420px)] rounded-[var(--radius-lg)] border px-4 py-3 shadow-[var(--shadow-md)] ${styles}`}>
      <div className="text-sm font-semibold">{toast.title}</div>
      {toast.description ? <div className="mt-1 text-sm opacity-90">{toast.description}</div> : null}
    </div>
  );
}

export function ToastViewport({ toasts, dismiss }: { toasts: ToastModel[]; dismiss: (id: string) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-3">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDone={dismiss} />
      ))}
    </div>
  );
}
