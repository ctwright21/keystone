"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 rounded-md min-w-[300px] animate-in slide-in-from-right"
            style={{
              backgroundColor: t.type === "success" ? '#10B981' : t.type === "error" ? '#EF4444' : '#12121A',
              border: t.type === "info" ? '1px solid #3A3A48' : 'none',
              boxShadow: t.type === "success"
                ? '0 0 15px rgba(16, 185, 129, 0.4), 0 4px 6px rgba(0, 0, 0, 0.4)'
                : t.type === "error"
                ? '0 0 15px rgba(239, 68, 68, 0.4), 0 4px 6px rgba(0, 0, 0, 0.4)'
                : '0 4px 6px rgba(0, 0, 0, 0.4)',
            }}
          >
            {t.type === "success" && <CheckCircle className="w-5 h-5 text-white" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-white" />}
            {t.type === "info" && <Info className="w-5 h-5" style={{ color: '#00F0FF' }} />}
            <span className="flex-1" style={{ color: t.type === "info" ? '#F0F0F5' : '#FFFFFF' }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 transition-colors"
              style={{ color: t.type === "info" ? 'rgba(160, 160, 176, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = t.type === "info" ? '#F0F0F5' : '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = t.type === "info" ? 'rgba(160, 160, 176, 0.7)' : 'rgba(255, 255, 255, 0.7)';
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
