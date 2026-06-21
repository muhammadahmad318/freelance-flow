/**
 * src/features/clients/pages/ClientsPage.tsx
 *
 * Main page view for client management.
 * Integrates server-side pagination, debounced searching, and the creation modal.
 */
import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useClients } from "../hooks/useClients";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientList, ClientListSkeleton } from "../components/ClientList";
import { EmptyState } from "@/components/EmptyState";
import { CreateClientModal } from "../components/CreateClientModal";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";

export const ClientsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Debounce search input by 300ms to prevent API thrashing
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Reset to page 1 whenever a new search query is executed
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // Fetch paginated data from the backend
  const { data, isLoading, isFetching, isError, error } = useClients({
    page,
    limit,
    search: debouncedSearch,
  });

  const clients = data?.data || [];
  const meta = data?.meta;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
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

      {/* Search Toolbar */}
      <div className="mb-6 flex items-center max-w-md">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border border-border bg-background py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
          {/* Subtle spinner while background fetch happens for search */}
          {isFetching && searchTerm !== debouncedSearch && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20 text-sm text-destructive">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}

      {/* Initial Load Skeleton */}
      {isLoading && !clients.length && <ClientListSkeleton />}

      {/* Empty State (No records at all) */}
      {!isLoading && !isError && clients.length === 0 && !debouncedSearch && (
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

      {/* No Search Results */}
      {!isLoading && !isError && clients.length === 0 && debouncedSearch && (
        <div className="py-12 text-center border border-border rounded-lg border-dashed">
          <p className="text-sm text-muted-foreground">
            No clients match your search for "{debouncedSearch}".
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-2 text-sm text-primary hover:underline outline-none"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Data Table & Pagination Composition */}
      {!isError && clients.length > 0 && (
        <div
          className={`${
            isFetching ? "opacity-60" : "opacity-100"
          } transition-opacity duration-200`}
        >
          {/* The data table now natively handles internal scrolling while keeping the header sticky */}
          <ClientList clients={clients} />

          {/* The advanced pagination controls synced perfectly to the backend metadata */}
          {meta && (
            <Pagination
              currentPage={meta.currentPage}
              totalPages={meta.totalPages}
              totalRecords={meta.totalRecords}
              limit={limit}
              hasNextPage={meta.hasNextPage}
              hasPreviousPage={meta.hasPreviousPage}
              onPageChange={setPage}
              onLimitChange={setLimit}
              isFetching={isFetching}
            />
          )}
        </div>
      )}

      <CreateClientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};
