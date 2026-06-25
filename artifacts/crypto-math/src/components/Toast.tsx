import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

interface ToastItem { id: number; message: string; type: "success" | "error" | "info"; }

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type, id } = (e as CustomEvent).detail;
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
    };
    window.addEventListener("mmm-toast", handler);
    return () => window.removeEventListener("mmm-toast", handler);
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-slide-in-up max-w-xs ${
            t.type === "success" ? "bg-green-50 dark:bg-green-900/80 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200"
            : t.type === "error" ? "bg-red-50 dark:bg-red-900/80 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200"
            : "bg-blue-50 dark:bg-blue-900/80 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200"
          }`}
        >
          {t.type === "success" && <CheckCircle className="w-4 h-4 shrink-0" />}
          {t.type === "error" && <XCircle className="w-4 h-4 shrink-0" />}
          {t.type === "info" && <Info className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))}>
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
