/**
 * src/features/clients/components/ClientList.tsx
 *
 * Renders the tabular data for Clients, loading skeletons, and row actions.
 */
import React, { useState } from "react";
import type { Client } from "@/features/clients/types/client";
import { useDeleteClient } from "@/features/clients/hooks/useClients";
import { EditClientModal } from "@/features/clients/components/EditClientModal";

interface ClientListProps {
  clients: Client[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const { mutateAsync: deleteClient } = useDeleteClient();

  /**
   * Executes a strict confirmation check before issuing the delete mutation.
   *
   * @param id - The client UUID.
   * @param name - The client name for the confirmation prompt.
   */
  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${name}? This action cannot be undone.`,
    );
    if (!isConfirmed) return;

    try {
      await deleteClient(id);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  return (
    <>
      <div className="overflow-hidden shadow-sm border border-border rounded-lg">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-foreground"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-foreground"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-foreground"
              >
                Added
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-muted/50 transition-colors"
              >
                {/* Name */}
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                  {client.name}
                </td>

                {/* Contact */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                  <div className="flex flex-col">
                    <span>{client.email}</span>
                    {client.phone && (
                      <span className="text-xs opacity-70 mt-0.5">
                        {client.phone}
                      </span>
                    )}
                  </div>
                </td>

                {/* Company */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                  {client.company || (
                    <span className="italic opacity-50">N/A</span>
                  )}
                </td>

                {/* Added Date */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                  {dateFormatter.format(new Date(client.createdAt))}
                </td>

                {/* Actions Column */}
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4">
                  <button
                    onClick={() => setEditingClient(client)}
                    className="text-primary hover:text-primary/80 transition-colors"
                    aria-label={`Edit ${client.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id, client.name)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                    aria-label={`Delete ${client.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal controlled by row state */}
      <EditClientModal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
      />
    </>
  );
};

export const ClientListSkeleton: React.FC = () => {
  const rows = Array.from({ length: 5 });

  return (
    /* Skeleton Container */
    <div className="overflow-hidden shadow-sm border border-border rounded-lg animate-pulse">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">
              <div className="h-4 bg-muted rounded w-24"></div>
            </th>
            <th scope="col" className="px-3 py-3.5">
              <div className="h-4 bg-muted rounded w-32"></div>
            </th>
            <th scope="col" className="px-3 py-3.5">
              <div className="h-4 bg-muted rounded w-20"></div>
            </th>
            <th scope="col" className="px-3 py-3.5">
              <div className="h-4 bg-muted rounded w-16"></div>
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-background">
          {rows.map((_, idx) => (
            <tr key={idx}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                <div className="h-4 bg-muted rounded w-32"></div>
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                <div className="h-4 bg-muted rounded w-40"></div>
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                <div className="h-4 bg-muted rounded w-24"></div>
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                <div className="h-4 bg-muted rounded w-20"></div>
              </td>
              <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                <div className="h-4 bg-muted rounded w-10 ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
