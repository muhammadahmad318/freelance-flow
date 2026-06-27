/**
 * src/features/clients/pages/ClientsPage.tsx
 *
 * Main page view for client management.
 * Integrates server-side pagination, debounced searching, and the creation modal.
 */
import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { useClients } from "@/features/clients/hooks/useClients";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientList, ClientListSkeleton } from "../components/ClientList";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { ClientModal } from "@/features/clients/components/ClientModal";
import { useToast } from "@/contexts/ToastContext";

export const ClientsPage: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { toast } = useToast();
  
  const { data, isLoading, isFetching, isError, error } = useClients({ page, limit, search: debouncedSearch, });
  
  const clients = data?.data || [];
  const meta = data?.meta;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (isError) {
      toast({
        type: "error",
        title: "Failed to load clients",
        description: error instanceof Error ? error.message : "An unknown network error occurred.",
      });
    }
  }, [isError, error, toast]);



  return (
    <div className="mx-auto max-w-7xl">

      {/* Flattened Header Section */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A list of all your clients including their name, contact details,
            and organization.
          </p>
        </div>
        <Button onClick={openModal} className="w-full sm:w-auto">
          Add Client
        </Button>
      </header>

      {/* Flattened Search Toolbar */}
      <div className="relative mb-6 max-w-md">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
        {isFetching && searchTerm !== debouncedSearch && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

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

      {/* Empty State (No Search Results) */}
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

      {/* Data Table with Integrated Pagination */}
      {!isError && clients.length > 0 && (
        <ClientList
          clients={clients}
          meta={meta}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isFetching={isFetching}
        />
      )}

      <ClientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};
