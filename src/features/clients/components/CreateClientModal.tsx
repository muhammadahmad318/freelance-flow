/**
 * src/features/clients/components/CreateClientModal.tsx
 *
 * Handles the creation of a new client.
 * Integrates React Hook Form with Zod validation, React Query mutations,
 * and our global Atomic UI components.
 */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema } from "../validation/clientSchema";
import type { CreateClientDTO } from "../types/client";
import { useCreateClient } from "../hooks/useClients";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CreateClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateClientModal({ isOpen, onClose }: CreateClientModalProps) {
  // 1. Setup Form with Zod Resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientDTO>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
    },
  });

  // 2. Setup React Query Mutation
  const { mutateAsync: createClient } = useCreateClient();

  // 3. Reset form when modal closes to prevent stale data on reopen
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  // 4. Form Submission Handler
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
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Background backdrop using semantic foreground with opacity */}
      <div
        className="fixed inset-0 bg-foreground/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Modal Panel utilizing the new background and border tokens */}
          <div className="relative transform overflow-hidden rounded-xl bg-background border border-border px-4 pb-4 pt-5 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="mb-6">
              <h3
                className="text-lg font-semibold leading-6 text-foreground"
                id="modal-title"
              >
                Add New Client
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in the details below to add a new client to your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* space-y-8 provides exact clearance for floating error text */}
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

              {/* Actions */}
              <div className="mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <Button
                  type="submit"
                  className="sm:col-start-2 w-full"
                  isLoading={isSubmitting}
                >
                  Save Client
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
}
