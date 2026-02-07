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
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : tone === "error"
        ? "border-rose-200 bg-rose-50 text-rose-900"
        : "border-zinc-200 bg-white text-zinc-900";

  return (
    <div className={`w-[min(92vw,420px)] rounded-xl border px-4 py-3 shadow-sm ${styles}`}>
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
