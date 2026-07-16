/**
 * src/features/projects/pages/ProjectsPage.tsx
 *
 * The primary container (Smart Component) for the Projects domain.
 * Responsible for orchestrating domain state (pagination, search, filtering),
 * managing data fetching via TanStack Query, and passing strictly controlled 
 * data down to the presentation layer.
 */
import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { ProjectList } from "@/features/projects/components/ProjectList";
import type { ProjectStatus } from "@/features/projects/types/project";
import { useDebounce } from "@/hooks/useDebounce";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

/**
 * Static configuration for the status filter dropdown.
 * Declared outside the component lifecycle to prevent memory reallocation on re-renders.
 */
const STATUS_OPTIONS: SelectOption[] = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on_hold" },
];

export const ProjectsPage: React.FC = () => {
  // --- Domain State Management ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");

  /**
   * Delays the search state update by 300ms.
   * Prevents database spam by waiting for the user to stop typing before fetching.
   */
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  /**
   * UX Guardrail: Reset pagination to the first page whenever search or filters change.
   * This prevents users from being stranded on an out-of-bounds empty page (e.g., 
   * filtering for "Drafts" while currently on page 5 of "All Statuses").
   */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, statusFilter, limit]);

  /**
   * Server State Connection: Automatically fires network requests and manages caching 
   * whenever the controlled dependencies (page, limit, search, status) change.
   */
  const { data, isFetching } = useProjects({
    page,
    limit,
    search: debouncedSearchTerm,
    status: statusFilter,
  });

  return (
    <div className="space-y-6">

      {/* --- Page Header & Actions --- */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your project pipeline, timelines, and budgets.
          </p>
        </div>
        <Button
          onClick={() => alert("Create project modal coming soon.")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </header>

      {/* --- Filter & Search Toolbar --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-40">
          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as ProjectStatus | "all")}
            clearable={false}
            searchable={false}
          />
        </div>
      </div>

      {/* --- Presentation Layer (Dumb Component) --- */}
      <ProjectList
        projects={data?.data || []}
        meta={data?.meta}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        isFetching={isFetching}
        searchQuery={debouncedSearchTerm}
        onAddProject={() => alert("Create project modal coming soon.")}
      />

    </div>
  );
};