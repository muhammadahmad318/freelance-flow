/**
 * src/features/clients/components/ClientList.tsx
 *
 * Renders the tabular data for Clients, loading skeletons, and row actions.
 * Utilizes the global Table infrastructure and configuration-driven headers.
 */
import React, { useState } from "react";
import type { Client } from "@/features/clients/types/client";
import { useDeleteClient } from "@/features/clients/hooks/useClients";
import { EditClientModal } from "@/features/clients/components/EditClientModal";
import { ActionModal } from "@/components/ui/ActionModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

interface ClientListProps {
  clients: Client[];
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

/**
 * Configuration array for table columns.
 * Acts as the single source of truth for rendering both data headers and skeleton loaders.
 */
const tableHeaders = [
  {
    id: "name",
    label: "Name",
    className: "pl-4 sm:pl-6",
    skeletonClass: "w-24",
  },
  {
    id: "contact",
    label: "Contact",
    className: "",
    skeletonClass: "w-32",
  },
  {
    id: "company",
    label: "Company",
    className: "",
    skeletonClass: "w-20",
  },
  {
    id: "added",
    label: "Added",
    className: "",
    skeletonClass: "w-16",
  },
  {
    id: "actions",
    label: "Actions",
    className: "relative pl-3 pr-4 sm:pr-6",
    srOnly: true,
    skeletonClass: "w-10 ml-auto",
  },
];

/**
 * Primary data table component for the Client module.
 * Handles inline editing triggers and destructive deletion workflows.
 */
export const ClientList: React.FC<ClientListProps> = ({ clients }) => {
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { mutateAsync: deleteClient, isPending: isDeleting } =
    useDeleteClient();

  /**
   * Executes the delete mutation for the staged client record.
   * Automatically clears the modal state upon successful execution.
   */
  const confirmDeletion = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient(clientToDelete.id);
      setClientToDelete(null);
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {tableHeaders.map((header) => (
              <TableHead key={header.id} className={header.className}>
                {header.srOnly ? (
                  <span className="sr-only">{header.label}</span>
                ) : (
                  header.label
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              {/* Name */}
              <TableCell className="pl-4 sm:pl-6 font-medium text-foreground">
                {client.name}
              </TableCell>

              {/* Contact */}
              <TableCell>
                <div className="flex flex-col">
                  <span>{client.email}</span>
                  {client.phone && (
                    <span className="text-xs opacity-70 mt-0.5">
                      {client.phone}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Company */}
              <TableCell>
                {client.company || (
                  <span className="italic opacity-50">N/A</span>
                )}
              </TableCell>

              {/* Added Date */}
              <TableCell>
                {dateFormatter.format(new Date(client.createdAt))}
              </TableCell>

              {/* Actions Column */}
              <TableCell className="text-right font-medium pr-4 sm:pr-6 space-x-4">
                <button
                  onClick={() => setEditingClient(client)}
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label={`Edit ${client.name}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setClientToDelete(client)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label={`Delete ${client.name}`}
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EditClientModal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
      />

      <ActionModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        title="Delete Client"
        description={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone and will permanently remove them from your database.`}
        actionLabel="Delete Client"
        variant="destructive"
        onAction={confirmDeletion}
        isProcessing={isDeleting}
      />
    </>
  );
};

/**
 * Placeholder table component matching the structural dimensions of the ClientList.
 * Utilizes the shared tableHeaders configuration to maintain visual alignment.
 */
export const ClientListSkeleton: React.FC = () => {
  const rows = Array.from({ length: 5 });

  return (
    <Table className="animate-pulse">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {tableHeaders.map((header) => (
            <TableHead
              key={`skel-head-${header.id}`}
              className={header.className}
            >
              <div
                className={`h-4 bg-muted rounded ${header.skeletonClass}`}
              ></div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((_, idx) => (
          <TableRow key={idx}>
            {tableHeaders.map((header) => (
              <TableCell
                key={`skel-cell-${idx}-${header.id}`}
                className={header.className}
              >
                <div
                  className={`h-4 bg-muted rounded ${header.skeletonClass}`}
                ></div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
