import React, { useMemo, useState } from "react";
import { ToastCtx, type Toast, type ToastAPI } from "./toast-context";

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const api = useMemo<ToastAPI>(
    () => ({
      show: ({ durationMs = 3000, ...t }) => {
        const id = crypto.randomUUID();
        const toast: Toast = { id, ...t };
        setItems((prev) => [...prev, toast]);
        window.setTimeout(() => {
          setItems((prev) => prev.filter((x) => x.id !== id));
        }, durationMs);
      },
      remove: (id) => setItems((prev) => prev.filter((x) => x.id !== id)),
    }),
    []
  );

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 space-y-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] rounded-xl border px-4 py-3 shadow-md text-sm bg-white dark:bg-zinc-900
            ${t.variant === "success" ? "border-emerald-300" :
               t.variant === "error" ? "border-rose-300" :
               "border-gray-200"}`}
          >
            <div className="font-medium">{t.title}</div>
            {t.description && (
              <div className="mt-0.5 text-gray-600 dark:text-gray-300">{t.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
