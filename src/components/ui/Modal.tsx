/**
 * src/components/ui/Modal.tsx
 *
 * Global Modal infrastructure utilizing the Electric Pulse design system.
 * Built using the Compound Component pattern for scalable composition.
 */
import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Base wrapper for modal overlays. Handles backdrop, positioning, and global close actions.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-foreground/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-xl bg-background border border-border px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="absolute right-4 top-4">
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground hover:cursor-pointer transition-colors outline-none"
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Container for the modal title and description. Includes padding to prevent overlap with the close button.
 */
export const ModalHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`mb-6 pr-8 ${className}`}>{children}</div>
);

/**
 * Primary heading for the modal context.
 */
export const ModalTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h3
    className="text-lg font-semibold leading-6 text-foreground"
    id="modal-title"
  >
    {children}
  </h3>
);

/**
 * Secondary text providing additional context or instructions below the title.
 */
export const ModalDescription: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <p className="mt-1 text-sm text-muted-foreground">{children}</p>;

/**
 * Container for modal actions. Reverses column order on mobile and aligns right on desktop.
 */
export const ModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-y-3 sm:gap-y-0 ${className}`}
  >
    {children}
  </div>
);
