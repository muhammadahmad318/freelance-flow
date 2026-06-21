/**
 * src/features/clients/components/CreateClientModal.tsx
 *
 * Handles the creation of a new client record.
 * Integrates the global Modal infrastructure with React Hook Form and Zod validation.
 */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema } from "../validation/clientSchema";
import type { CreateClientDTO } from "../types/client";
import { useCreateClient } from "../hooks/useClients";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal interface for adding a new client.
 * Enforces strict client-side validation before dispatching the creation mutation.
 */
export const CreateClientModal: React.FC<CreateClientModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientDTO>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { name: "", email: "", phone: "", company: "" },
  });

  const { mutateAsync: createClient } = useCreateClient();

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateClientDTO) => {
    try {
      await createClient(data);
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Add New Client</ModalTitle>
        <ModalDescription>
          Fill in the details below to add a new client to your workspace.
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8 pb-4">
          <Input
            id="name"
            type="text"
            label="Full Name *"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="email"
            type="email"
            label="Email Address *"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="phone"
            type="text"
            label="Phone Number"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            id="company"
            type="text"
            label="Company / Organization"
            autoComplete="organization"
            error={errors.company?.message}
            {...register("company")}
          />
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full sm:w-auto disabled:cursor-not-allowed"
          >
            Save Client
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
