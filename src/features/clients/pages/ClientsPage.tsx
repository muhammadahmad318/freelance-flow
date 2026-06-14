/**
 * src/features/clients/pages/ClientsPage.tsx
 *
 * Main page view for client management.
 */
import React, { useState } from "react";
import { useClients } from "../hooks/useClients";
import { ClientList, ClientListSkeleton } from "../components/ClientList";
import { EmptyState } from "@/components/EmptyState";
import { CreateClientModal } from "../components/CreateClientModal";
import { Button } from "@/components/ui/Button";

export const ClientsPage: React.FC = () => {
  const { data: clients, isLoading, isError, error } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A list of all your clients including their name, contact details,
            and organization.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={openModal}>Add Client</Button>
        </div>
      </div>

      {/* Conditional Rendering Logic */}
      {isError && (
        <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20 text-sm text-destructive animate-in fade-in duration-300">
          Error loading clients:{" "}
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </div>
      )}

      {isLoading && <ClientListSkeleton />}

      {!isLoading && !isError && clients && clients.length === 0 && (
        <EmptyState
          title="No clients found"
          description="Get started by adding your first client to the system."
          action={
            <Button variant="outline" onClick={openModal}>
              + Add Client
            </Button>
          }
        />
      )}

      {!isLoading && !isError && clients && clients.length > 0 && (
        <ClientList clients={clients} />
      )}

      {/* Modals */}
      <CreateClientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ClientsPage;
