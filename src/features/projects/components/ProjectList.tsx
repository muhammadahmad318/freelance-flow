/**
 * src/features/projects/components/ProjectList.tsx
 *
 * Presentation component (Dumb Component) for the Project domain.
 * Responsible strictly for rendering the tabular data grid, managing row-level
 * interactions (Edit/Delete modals), and displaying contextual empty states.
 * * Architecture Note: Uses `table-fixed` to strictly lock column widths,
 * preventing layout shifts when transitioning between empty states and live data.
 */
import React, { useState } from "react";
import type { Project } from "@/features/projects/types/project";
import { useDeleteProject } from "@/features/projects/hooks/useProjects";
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

/**
 * Expected props mapped directly from the parent Smart Component (ProjectsPage).
 */
interface ProjectListProps {
  projects: Project[];
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
  onAddProject?: () => void;
}

// Single-instance formatters to prevent reallocation on every render
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/**
 * Static configuration map for status badges.
 * Prevents memory reallocation of style strings during list mapping.
 */
const STATUS_CONFIG: Record<
  Project["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  completed: {
    label: "Completed",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  on_hold: {
    label: "On Hold",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
};

/**
 * Renders a standardized, color-coded badge based on the Project Status.
 */
const StatusBadge: React.FC<{ status: Project["status"] }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};

/**
 * Layout configuration for the table grid.
 * `width` properties are strictly enforced by the `<Table className="table-fixed">` wrapper.
 */
const tableHeaders = [
  {
    id: "name",
    label: "Project Details",
    width: "20%",
    className: "pl-4 sm:pl-6",
  },
  {
    id: "client",
    label: "Client",
    width: "20%",
    className: "",
  },
  {
    id: "status",
    label: "Status",
    width: "15%",
    className: "",
  },
  {
    id: "timeline",
    label: "Timeline",
    width: "20%",
    className: "",
  },
  {
    id: "budget",
    label: "Budget",
    width: "10%",
    className: "",
  },
  {
    id: "actions",
    label: "Actions",
    width: "15%",
    className: "pr-4 sm:pr-6 text-right",
    srOnly: true,
  },
];

/**
 * Project List Component
 */
export const ProjectList: React.FC<ProjectListProps> = ({ projects, meta, limit, onPageChange, onLimitChange, isFetching, searchQuery, onAddProject, }) => {

  // Local state for managing the Delete confirmation modal
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useDeleteProject();

  /**
   * Evaluates the contextual empty state (Search vs. No Data).
   * Passed down to `<TableBody>` to render the `<TableEmptyState>` primitive.
   */
  const activeEmptyState = searchQuery
    ? {
      colSpan: tableHeaders.length,
      icon: <Search className="h-6 w-6 text-muted-foreground" />,
      title: "No matching projects",
      description: `No projects match your search for "${searchQuery}".`,
      className: "mb-25",
    }
    : {
      colSpan: tableHeaders.length,
      icon: <Inbox className="h-6 w-6 text-muted-foreground" />,
      title: "No projects found",
      description: "Get started by creating your first project.",
      className: "mb-15",
      action: onAddProject && (
        <Button variant="outline" onClick={onAddProject} className="mt-2">
          + New Project
        </Button>
      ),
    };

  /**
   * Executes the deletion mutation and closes the modal upon success.
   * Note: Errors are handled globally by the hook interceptor.
   */
  const confirmDeletion = async () => {
    if (!projectToDelete) return;
    await deleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  return (
    <>
      {/* Table Wrapper (Handles loading opacity) */}
      <div
        className={`flex flex-col h-112.5 w-full rounded-lg border border-border shadow-sm overflow-hidden transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}
      >
        <Table
          wrapperClassName="flex-1"
          className={`table-fixed w-full ${projects.length === 0 ? "h-full" : ""}`}
          isFetching={isFetching}
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {tableHeaders.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.className}
                  style={{ width: header.width }}
                >
                  {header.srOnly ? (
                    <span className="sr-only">{header.label}</span>
                  ) : (
                    header.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody
            isEmpty={projects.length === 0 && !isFetching}
            emptyState={activeEmptyState}
          >
            {projects.map((project) => (
              <TableRow key={project.id}>

                {/* Project Details */}
                <TableCell className="pl-4 sm:pl-6 overflow-hidden">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground truncate">
                      {project.name}
                    </span>
                    {project.description && (
                      <span className="mt-0.5 text-xs text-muted-foreground truncate">
                        {project.description}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Relational Client Data */}
                <TableCell className="overflow-hidden">
                  {project.clients?.name ? (
                    <div className="flex flex-col">
                      <span className="text-foreground truncate">
                        {project.clients.name}
                      </span>
                      {project.clients.company && (
                        <span className="mt-0.5 text-xs text-muted-foreground truncate">
                          {project.clients.company}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="italic opacity-50">Unknown Client</span>
                  )}
                </TableCell>

                {/* Status Badge */}
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>

                {/* Timeline */}
                <TableCell>
                  <div className="flex flex-col text-xs text-muted-foreground truncate">
                    <span>
                      {project.startDate
                        ? dateFormatter.format(new Date(project.startDate))
                        : "TBD"}
                    </span>
                    <span className="my-0.5 text-[10px] uppercase opacity-70">
                      to
                    </span>
                    <span>
                      {project.endDate
                        ? dateFormatter.format(new Date(project.endDate))
                        : "TBD"}
                    </span>
                  </div>
                </TableCell>

                {/* Budget */}
                <TableCell>
                  {project.budget != null ? (
                    <span className="font-medium text-foreground">
                      {currencyFormatter.format(project.budget)}
                    </span>
                  ) : (
                    <span className="italic opacity-50">N/A</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-4 sm:pr-6 text-right font-medium space-x-4">
                  <button
                    onClick={() => alert("Edit modal coming soon.")}
                    className="text-primary hover:text-primary/80 transition-colors outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setProjectToDelete(project)}
                    className="text-destructive hover:text-destructive/80 transition-colors outline-none"
                  >
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

      <ActionModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Delete Project"
        description={`Are you sure you want to delete ${projectToDelete?.name}? This action cannot be undone.`}
        actionLabel="Delete"
        variant="destructive"
        onAction={confirmDeletion}
        isProcessing={isDeleting}
      />
    </>
  );
};
