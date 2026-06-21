/**
 * src/features/clients/components/EditClientModal.tsx
 *
 * Handles the modification of an existing client record.
 */
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema } from "@/features/clients/validation/clientSchema";
import type { Client, CreateClientDTO } from "@/features/clients/types/client";
import { useUpdateClient } from "@/features/clients/hooks/useClients";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  const { mutateAsync: updateClient } = useUpdateClient();

  // FIX: Use CreateClientDTO here to perfectly align with createClientSchema.
  // This guarantees name and email remain strictly required during editing.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientDTO>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { name: "", email: "", phone: "", company: "" },
  });

  // Hydrate the form with the selected client's data when the modal opens
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

  // FIX: data is strictly typed as CreateClientDTO, which safely satisfies the
  // UpdateClientDTO (Partial) requirement of the updateClient mutation.
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
            <div className="mb-6">
              <h3
                className="text-lg font-semibold leading-6 text-foreground"
                id="modal-title"
              >
                Edit Client
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the contact details for {client.name}.
              </p>
            </div>

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

              <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <Button
                  type="submit"
                  className="sm:col-start-2 w-full"
                  isLoading={isSubmitting}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 sm:col-start-1 sm:mt-0 w-full"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
