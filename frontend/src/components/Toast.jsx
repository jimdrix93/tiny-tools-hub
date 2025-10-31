import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const hide = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const show = useCallback((message, opts = {}) => {
    const id = ++idRef.current;
    const toast = {
      id,
      message,
      variant: opts.variant || "success", // "success" | "info" | "error"
      duration: opts.duration ?? 1800,
    };
    setToasts((t) => [...t, toast]);
    // auto-dismiss
    window.setTimeout(() => hide(id), toast.duration);
  }, [hide]);

  const api = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      {/* Región accesible para anuncios cortos */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100]"
      >
        <div className="mx-auto w-full max-w-sm px-4">
          {toasts.map((t) => (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto mb-2 rounded-lg border p-3 text-sm shadow-sm
                ${t.variant === "error"
                  ? "border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200"
                  : t.variant === "info"
                  ? "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                  : "border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-200"
                }`}
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
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
