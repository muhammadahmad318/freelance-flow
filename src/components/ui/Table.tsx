/**
 * src/components/ui/Table.tsx
 *
 * Consolidated, reusable Table primitives.
 * Utilizes native HTML sections (thead, tbody, tfoot) with sticky positioning
 * to create a seamless, internally scrolling data table with integrated pagination.
 */
import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Props for the main Table wrapper.
 */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
}

/**
 * Props for the Pagination component.
 */
interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isFetching?: boolean;
}

/**
 * Main Table wrapper.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = "", wrapperClassName = "", ...props }, ref) => (
    <div
      className={`relative w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${wrapperClassName}`}
    >
      <table
        ref={ref}
        className={`min-w-full divide-y divide-border ${className}`}
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

/**
 * TableHeader component.
 */
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <thead
    ref={ref}
    className={`sticky top-0 bg-muted ${className}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

/**
 * TableHead component.
 */
export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className = "", ...props }, ref) => (
  <th
    ref={ref}
    className={`px-3 py-3 text-left text-sm font-semibold text-foreground ${className}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/**
 * TableBody component.
 */
export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <tbody
    ref={ref}
    className={`divide-y divide-border bg-background ${className}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/**
 * TableRow component.
 */
export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={`hover:bg-muted/50 transition-colors ${className}`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/**
 * TableCell component.
 */
export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className = "", ...props }, ref) => (
  <td
    ref={ref}
    className={`whitespace-nowrap px-3 py-4 text-sm text-muted-foreground ${className}`}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/**
 * TableFooter component.
 */
export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`sticky bottom-0 z-20 bg-muted backdrop-blur ${className}`}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/**
 * TablePagination component.
 */
export const TablePagination = React.forwardRef<
  HTMLDivElement,
  TablePaginationProps
>(
  (
    {
      currentPage,
      totalPages,
      totalRecords,
      limit,
      onPageChange,
      onLimitChange,
      isFetching,
      className = "",
      ...props
    },
    ref,
  ) => {
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPages;
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1;
    const endRecord = Math.min(currentPage * limit, totalRecords);

    if (totalRecords === 0) return null;

    return (
      <div
        ref={ref}
        className={`px-4 py-3 text-sm text-muted-foreground bg-muted border-t border-border ${className}`}
        {...props}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Record Count */}
          <div>
            Showing{" "}
            <span className="font-medium text-foreground">{startRecord}</span>{" "}
            to <span className="font-medium text-foreground">{endRecord}</span>{" "}
            of{" "}
            <span className="font-medium text-foreground">{totalRecords}</span>{" "}
            entries
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Rows per page</span>
              <select
                value={limit}
                onChange={(e) => {
                  onLimitChange(Number(e.target.value));
                  onPageChange(1);
                }}
                disabled={isFetching}
                className="bg-transparent border border-border rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              >
                {[5, 10, 25, 50].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => onPageChange(1)}
                disabled={!hasPrev || isFetching}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrev || isFetching}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-medium">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext || isFetching}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={!hasNext || isFetching}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
TablePagination.displayName = "TablePagination";
