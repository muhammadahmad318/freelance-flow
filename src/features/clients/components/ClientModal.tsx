/**
 * src/features/clients/components/ClientModal.tsx
 *
 * Unified modal for both Creating and Editing client records.
 * Implements strict disabled states and partial DTO payload generation
 * to optimize network traffic and prevent concurrent data overwrites.
 */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema } from "@/features/clients/validation/clientSchema";
import type { Client, CreateClientDTO } from "@/features/clients/types/client";
import {
  useCreateClient,
  useUpdateClient,
} from "@/features/clients/hooks/useClients";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/Modal";

/**
 * Props for the ClientModal component.
 */
interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
}

/**
 * Renders the Client Modal for both creating and editing client records.
 */
export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, client, }) => {

  const isEditMode = !!client;
  const { mutateAsync: createClient } = useCreateClient();
  const { mutateAsync: updateClient } = useUpdateClient();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isValid, isDirty, dirtyFields }, } = useForm<CreateClientDTO>({
    resolver: zodResolver(createClientSchema),
    mode: "onChange",
    defaultValues: { name: "", email: "", phone: "", company: "" },
  });

  /**
   * Dynamically populate or clear the form based on mode
   */
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && client) {
        reset({
          name: client.name,
          email: client.email,
          phone: client.phone || "",
          company: client.company || "",
        });
      } else {
        reset({ name: "", email: "", phone: "", company: "" });
      }
    }
  }, [isOpen, client, isEditMode, reset]);

  /**
   * Handles form submission with conditional mutation logic.
   */
  const onSubmit = async (data: CreateClientDTO) => {
    try {
      if (isEditMode && client) {
        const changedFields: Partial<CreateClientDTO> = {};
        const dirtyKeys = Object.keys(dirtyFields) as Array<
          keyof CreateClientDTO
        >;

        dirtyKeys.forEach((key) => {
          changedFields[key] = data[key];
        });

        if (Object.keys(changedFields).length > 0) {
          await updateClient({ id: client.id, payload: changedFields });
        }
      } else {
        await createClient(data);
      }
      onClose();
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} client:`,
        error,
      );
    }
  };

  /**
   * Determine the disabled state of the submit button.
   */
  const isButtonDisabled = !isValid || (isEditMode && !isDirty) || isSubmitting;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>{isEditMode ? "Edit Client" : "Add New Client"}</ModalTitle>
        <ModalDescription>
          {isEditMode
            ? `Update the contact details for ${client.name}.`
            : "Fill in the details below to add a new client to your workspace."}
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
            disabled={isButtonDisabled}
            className="w-full sm:w-auto disabled:cursor-not-allowed"
          >
            {isEditMode ? "Save Changes" : "Save Client"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
