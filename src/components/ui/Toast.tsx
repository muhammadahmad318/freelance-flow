/**
 * src/components/ui/Toast.tsx
 *
 * Visual presentation layer for the global ToastContext.
 * Renders a fixed container of animated, auto-dismissing notification cards.
 */
import React from "react";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
import { useToast, type ToastMessage } from "@/contexts/ToastContext";

/**
 * Maps toast status types to their respective semantic colors and icons.
 */
const TOAST_VARIANTS = {
  success: {
    icon: CheckCircle,
    colorClass: "text-emerald-500",
  },
  error: {
    icon: AlertCircle,
    colorClass: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    colorClass: "text-amber-500",
  },
  info: {
    icon: Info,
    colorClass: "text-blue-500",
  },
};

/**
 * Individual Toast Notification Component.
 * Handles its own enter animation, styling, and the shrinking timer bar.
 */
const Toast: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const { icon: Icon, colorClass } = TOAST_VARIANTS[toast.type];

  return (
    <div
      className="pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-lg border border-border bg-background shadow-lg animate-toast-in sm:w-96"
      role="alert"
    >
      <div className="flex items-start p-4">

        {/* Status Icon */}
        <div className={`shrink-0 ${colorClass}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Content Area */}
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium text-foreground">
            {toast.title}
          </p>
          {toast.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {toast.description}
            </p>
          )}
        </div>

        {/* Dismiss Button */}
        <div className="ml-4 flex shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md bg-background text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            onClick={() => onDismiss(toast.id)}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

      </div>

      {/* Animated Timer Bar */}
      {toast.duration !== Infinity && (
        <div
          className={`absolute bottom-0 left-0 h-1 opacity-20 animate-timer-shrink ${colorClass}`}
          style={{ "--toast-duration": `${toast.duration}ms` } as React.CSSProperties}
        >
          <div className="h-full w-full bg-current" />
        </div>
      )}
    </div>
  );
};

/**
 * Global Toast Container.
 * Fixed to the bottom-right viewport corner. Loops through active context state.
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end sm:justify-end h-full">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </div>
  );
};