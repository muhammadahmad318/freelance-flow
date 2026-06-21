/**
 * src/components/ui/ActionModal.tsx
 *
 * A highly scalable, configuration-driven modal for standard user actions
 * (e.g., Confirmations, Warnings, simple text prompts).
 */
import React from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void | Promise<void>;
  isProcessing?: boolean;
  variant?: "default" | "destructive";
  extraButtons?: React.ReactNode;
}

/**
 * Standardized modal for confirming user actions.
 * Wraps the base Modal compound components into a single, easy-to-consume API.
 */
export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  actionLabel,
  onAction,
  isProcessing = false,
  variant = "default",
  extraButtons,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>{description}</ModalDescription>
      </ModalHeader>

      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="w-full sm:w-auto disabled:cursor-not-allowed"
        >
          Cancel
        </Button>

        {/* Renders any extra buttons passed in between Cancel and the main Action */}
        {extraButtons}

        <Button
          type="button"
          onClick={onAction}
          isLoading={isProcessing}
          variant={variant}
          className="w-full sm:w-auto disabled:cursor-not-allowed"
        >
          {actionLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
