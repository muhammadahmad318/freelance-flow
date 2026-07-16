/**
 * src/components/ui/Table.tsx
 *
 * Consolidated, reusable Table primitives.
 * Utilizes Context to effortlessly pass global fetching states to the header,
 * ensuring a native, sticky progress bar without prop drilling.
 */
import React, { createContext, useContext } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Context to share the isFetching state internally within the Table tree.
 */
const TableContext = createContext<{ isFetching?: boolean }>({});

/**
 * Props for the main Table wrapper.
 */
export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  wrapperClassName?: string;
  isFetching?: boolean;
}

/**
 * Props for the TableBody component.
 */
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  isEmpty?: boolean;
  emptyState?: {
    colSpan: number;
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
  };
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
 * Props for the TableEmptyState Component
 */
interface TableEmptyStateProps extends React.HTMLAttributes<HTMLTableCellElement> {
  colSpan: number;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}


/**
 * Main Table wrapper.
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = "", wrapperClassName = "", isFetching, ...props }, ref) => (
    <TableContext.Provider value={{ isFetching }}>
      <div
        className={`relative w-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${wrapperClassName}`}
      >
        <table
          ref={ref}
          className={`min-w-full divide-y divide-border ${className}`}
          {...props}
        />
      </div>
    </TableContext.Provider>
  )
);
Table.displayName = "Table";

/**
 * TableHeader intercepts the fetching state to render an absolutely positioned,
 * sticky progress bar at its bottom edge. This prevents DOM layout shifts.
 */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className = "", children, ...props }, ref) => {
  const { isFetching } = useContext(TableContext);

  return (
    <thead
      ref={ref}
      className={`sticky top-0 bg-muted/95 backdrop-blur ${className}`}
      {...props}
    >
      {children}

      {/* Loading State */}
      {isFetching && (
        <tr>
          <th colSpan={100} className="p-0 m-0 border-none relative h-px bg-primary/20 overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-primary"
              style={{
                animation: "indeterminate-stretch 1.5s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite",
              }}
            />
          </th>
        </tr>
      )}
    </thead>
  );
});
TableHeader.displayName = "TableHeader";

/**
 * TableHead component.
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className = "", ...props }, ref) => (
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
export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className = "", isEmpty, emptyState, children, ...props }, ref) => (
    <tbody
      ref={ref}
      className={`divide-y divide-border bg-background ${className}`}
      {...props}
    >
      {isEmpty && emptyState ? (
        <TableEmptyState {...emptyState} />
      ) : (
        children
      )}
    </tbody>
  )
);
TableBody.displayName = "TableBody";

/**
 * TableRow component.
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className = "", ...props }, ref) => (
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
export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className = "", ...props }, ref) => (
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
export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className = "", ...props }, ref) => (
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
export const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(({ currentPage, totalPages, totalRecords, limit, onPageChange, onLimitChange, isFetching, className = "", ...props }, ref,) => {
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
        <div>
          Showing <span className="font-medium text-foreground">{startRecord}</span> to{" "}
          <span className="font-medium text-foreground">{endRecord}</span> of{" "}
          <span className="font-medium text-foreground">{totalRecords}</span> entries
        </div>

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
              className="bg-transparent border border-border rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition-opacity"
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
              className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrev || isFetching}
              className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext || isFetching}
              className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={!hasNext || isFetching}
              className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
);
TablePagination.displayName = "TablePagination";


/**
 * TableEmptyState Component
 */
export const TableEmptyState = React.forwardRef<HTMLTableCellElement, TableEmptyStateProps>(({ colSpan, icon, title, description, action, className = "", ...props }, ref) => (
  <TableRow className="hover:bg-transparent">
    <TableCell
      ref={ref}
      colSpan={colSpan}
      className={`align-middle text-center`}
      {...props}
    >
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
            {icon}
          </div>
        )}
        <div className="text-sm text-muted-foreground max-w-sm">
          <p className="font-medium text-foreground">{title}</p>
          {description && <p className="mt-1">{description}</p>}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </TableCell>
  </TableRow>
)
);
TableEmptyState.displayName = "TableEmptyState";