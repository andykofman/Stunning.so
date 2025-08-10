"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Toast = { id: number; message: string };

type ToastContextValue = {
  toasts: Toast[];
  showToast: (message: string) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = useCallback((message: string) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message }]);
  }, []);
  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auto-dismiss after 4s
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), 4000));
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  const value = useMemo(() => ({ toasts, showToast, dismiss }), [toasts, showToast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-4">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="pointer-events-auto rounded-md border border-red-500/40 bg-red-600/90 p-3 text-sm text-white shadow-lg backdrop-blur-sm"
              role="status"
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


