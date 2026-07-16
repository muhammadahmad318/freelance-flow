/**
 * src/features/clients/pages/ClientsPage.tsx
 *
 * The primary container (Smart Component) for the Client domain.
 * Orchestrates domain state (pagination, search), manages data fetching 
 * via TanStack Query, and passes strictly controlled data to the presentation layer.
 */
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useClients } from "@/features/clients/hooks/useClients";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientList } from "../components/ClientList";
import { Button } from "@/components/ui/Button";
import { ClientModal } from "@/features/clients/components/ClientModal";

export const ClientsPage: React.FC = () => {
  // --- Domain State Management ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // Standardized to match ProjectsPage

  /**
   * Delays the search state update by 300ms.
   * Prevents database spam by waiting for the user to stop typing before fetching.
   */
  const debouncedSearch = useDebounce(searchTerm, 300);

  /**
   * UX Guardrail: Reset pagination to the first page whenever search changes.
   * Prevents users from being stranded on out-of-bounds empty pages.
   */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /**
   * Server State Connection: Automatically fires network requests and manages 
   * caching whenever the controlled dependencies (page, limit, search) change.
   * Note: Errors are handled globally by the hook interceptor.
   */
  const { data, isFetching } = useClients({
    page,
    limit,
    search: debouncedSearch
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* --- Page Header & Actions --- */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Clients
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A list of all your clients including their name, contact details, and organization.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          Add Client
        </Button>
      </header>

      {/* --- Filter & Search Toolbar --- */}
      <div className="relative w-full sm:max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      {/* --- Presentation Layer (Dumb Component) --- */}
      <ClientList
        clients={data?.data || []}
        meta={data?.meta}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        isFetching={isFetching}
        searchQuery={debouncedSearch}
        onAddClient={() => setIsModalOpen(true)}
      />

      <ClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};