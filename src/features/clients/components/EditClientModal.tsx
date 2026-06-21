/**
 * src/features/clients/components/EditClientModal.tsx
 *
 * Handles the modification of an existing client record.
 * Utilizes the global Modal infrastructure and React Hook Form for validation.
 */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema } from "@/features/clients/validation/clientSchema";
import type { Client, CreateClientDTO } from "@/features/clients/types/client";
import { useUpdateClient } from "@/features/clients/hooks/useClients";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

/**
 * Modal interface for updating client details.
 * Enforces the same strict Zod validation schema used during client creation
 * to guarantee database integrity.
 */
export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { mutateAsync: updateClient } = useUpdateClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientDTO>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { name: "", email: "", phone: "", company: "" },
  });

  useEffect(() => {
    if (isOpen && client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone || "",
        company: client.company || "",
      });
    }
  }, [isOpen, client, reset]);

  const onSubmit = async (data: CreateClientDTO) => {
    if (!client) return;
    try {
      await updateClient({ id: client.id, payload: data });
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  if (!isOpen || !client) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Edit Client</ModalTitle>
        <ModalDescription>
          Update the contact details for {client.name}.
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8 pb-4">
          <Input
            id="edit-name"
            type="text"
            label="Full Name *"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="edit-email"
            type="email"
            label="Email Address *"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            id="edit-phone"
            type="text"
            label="Phone Number"
            autoComplete="tel"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            id="edit-company"
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
            Save Changes
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
