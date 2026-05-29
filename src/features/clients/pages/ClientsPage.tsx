/**
 * src/features/clients/pages/ClientsPage.tsx
 */
import { useState } from "react";
import { useClients } from "../hooks/useClients";
import { ClientList, ClientListSkeleton } from "../components/ClientList";
import { EmptyState } from "@/components/EmptyState";
import { CreateClientModal } from "../components/CreateClientModal";

export function ClientsPage() {
  const { data: clients, isLoading, isError, error } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your clients including their name, contact details,
            and organization.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openModal}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            Add Client
          </button>
        </div>
      </div>

      {/* Render Logic */}
      {isError && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm text-red-700">
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
            <button
              onClick={openModal}
              className="text-indigo-600 font-medium hover:text-indigo-500"
            >
              + Add Client
            </button>
          }
        />
      )}

      {!isLoading && !isError && clients && clients.length > 0 && (
        <ClientList clients={clients} />
      )}

      {/* 5. Render Modal */}
      <CreateClientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
