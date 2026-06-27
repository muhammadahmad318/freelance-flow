/**
 * src/contexts/ToastContext.tsx
 *
 * Global state manager for application notifications (Snackbars/Toasts).
 * Provides a useToast hook to trigger non-blocking alerts from any component.
 */
import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextState {
  toasts: ToastMessage[];
  toast: (options: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextState | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /**
   * Instantly removes a toast from the DOM.
   */
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Triggers a new toast notification.
   * Automatically handles unique ID generation and garbage collection.
   */
  const toast = useCallback(
    ({
      type,
      title,
      description,
      duration = 5000,
    }: Omit<ToastMessage, "id">) => {
      const id = crypto.randomUUID();

      setToasts((prev) => [...prev, { id, type, title, description, duration }]);

      // Schedule automatic removal
      if (duration !== Infinity) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to trigger toasts from within any functional component.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};