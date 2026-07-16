/**
 * src/features/clients/components/ClientList.tsx
 *
 * Presentation component (Dumb Component) for the Client domain.
 * Responsible strictly for rendering the tabular data grid, managing row-level 
 * interactions (Edit/Delete modals), and displaying contextual empty states.
 * * Architecture Note: Uses `table-fixed` to strictly lock column widths, 
 * preventing layout shifts when transitioning between empty states and live data.
 */
import React, { useState } from "react";
import type { Client } from "@/features/clients/types/client";
import { useDeleteClient } from "@/features/clients/hooks/useClients";
import { ActionModal } from "@/components/ui/ActionModal";
import { Button } from "@/components/ui/Button";
import { Inbox, Search } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/Table";
import { ClientModal } from "./ClientModal";

/**
 * Expected props mapped directly from the parent Smart Component (ClientsPage).
 */
interface ClientListProps {
  clients: Client[];
  meta?: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
  };
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isFetching?: boolean;
  searchQuery?: string;
  onAddClient?: () => void;
}

// Single-instance formatter to prevent reallocation on every render
const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" });

/**
 * Layout configuration for the table grid.
 * `width` properties are strictly enforced by the `<Table className="table-fixed">` wrapper.
 */
const tableHeaders = [
  {
    id: "name",
    label: "Name",
    width: "25%",
    className: "pl-4 sm:pl-6"
  },
  {
    id: "contact",
    label: "Contact",
    width: "30%",
    className: ""
  },
  {
    id: "company",
    label: "Company",
    width: "20%",
    className: ""
  },
  {
    id: "added",
    label: "Added",
    width: "15%",
    className: ""
  },
  {
    id: "actions",
    label: "Actions",
    width: "10%",
    className: "pr-4 sm:pr-6 text-right",
    srOnly: true
  },
];

/**
 * Client List Component
 */
export const ClientList: React.FC<ClientListProps> = ({ clients, meta, limit, onPageChange, onLimitChange, isFetching, searchQuery, onAddClient, }) => {

  // Local state for managing modals
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const { mutateAsync: deleteClient, isPending: isDeleting } = useDeleteClient();

  /**
   * Evaluates the contextual empty state (Search vs. No Data).
   * Passed down to `<TableBody>` to render the `<TableEmptyState>` primitive.
   */
  const activeEmptyState = searchQuery
    ? {
      colSpan: tableHeaders.length,
      icon: <Search className="h-6 w-6 text-muted-foreground" />,
      title: "No matching clients",
      description: `No clients match your search for "${searchQuery}".`,
      className: "mb-25"
    }
    : {
      colSpan: tableHeaders.length,
      icon: <Inbox className="h-6 w-6 text-muted-foreground" />,
      title: "No clients found",
      description: "Get started by adding your first client to the system.",
      className: "mb-15",
      action: onAddClient && (
        <Button variant="outline" onClick={onAddClient} className="mt-2">
          + Add Client
        </Button>
      ),
    };

  /**
   * Executes the deletion mutation and closes the modal upon success.
   * Note: Errors are handled globally by the hook interceptor.
   */
  const confirmDeletion = async () => {
    if (!clientToDelete) return;
    await deleteClient(clientToDelete.id);
    setClientToDelete(null);
  };

  return (
    <>
      <div className={`flex flex-col h-112.5 w-full rounded-lg border border-border shadow-sm overflow-hidden transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>

        {/* Table Wrapper (Handles fixed layout and loading lines) */}
        <Table
          wrapperClassName="flex-1"
          className={`table-fixed w-full ${clients.length === 0 ? "h-full" : ""}`}
          isFetching={isFetching}
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {tableHeaders.map((header) => (
                <TableHead key={header.id} className={header.className} style={{ width: header.width }}>
                  {header.srOnly ? <span className="sr-only">{header.label}</span> : header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody isEmpty={clients.length === 0 && !isFetching} emptyState={activeEmptyState}>
            {clients.map((client) => (
              <TableRow key={client.id}>

                {/* Name */}
                <TableCell className="pl-4 sm:pl-6 overflow-hidden">
                  <span className="font-medium text-foreground truncate block">
                    {client.name}
                  </span>
                </TableCell>

                {/* Contact */}
                <TableCell className="overflow-hidden">
                  <div className="flex flex-col">
                    <span className="truncate block">{client.email}</span>
                    {client.phone && (
                      <span className="mt-0.5 text-xs opacity-70 truncate block">
                        {client.phone}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Company */}
                <TableCell className="overflow-hidden">
                  {client.company ? (
                    <span className="truncate block">{client.company}</span>
                  ) : (
                    <span className="italic opacity-50">N/A</span>
                  )}
                </TableCell>

                {/* Added Date */}
                <TableCell className="overflow-hidden">
                  <span className="truncate block">
                    {dateFormatter.format(new Date(client.createdAt))}
                  </span>
                </TableCell>

                {/* Actions Column */}
                <TableCell className="pr-4 sm:pr-6 text-right font-medium space-x-4">
                  <button onClick={() => setEditingClient(client)} className="text-primary hover:text-primary/80 transition-colors outline-none">
                    Edit
                  </button>
                  <button onClick={() => setClientToDelete(client)} className="text-destructive hover:text-destructive/80 transition-colors outline-none">
                    Delete
                  </button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        {meta && limit && onPageChange && onLimitChange && (
          <TablePagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            totalRecords={meta.totalRecords}
            limit={limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            isFetching={isFetching}
          />
        )}
      </div>

      {/* --- Modals --- */}
      <ClientModal
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient}
      />

      <ActionModal
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        title="Delete Client"
        description={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone.`}
        actionLabel="Delete"
        variant="destructive"
        onAction={confirmDeletion}
        isProcessing={isDeleting}
      />
    </>
  );
};