/**
 * src/components/ui/Table.tsx
 *
 * Global, reusable Table primitives utilizing the Electric Pulse design system.
 * Built with React.forwardRef to ensure DOM nodes can be accessed by parent components.
 * Implements a bounded scroll container with sticky headers for large datasets.
 */
import React from "react";

/**
 * Primary wrapper for the table layout.
 * Establishes the bounded scroll area (max-h-[600px]) to enable sticky headers,
 * alongside standard border and shadow definitions.
 */
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className = "", ...props }, ref) => (
  <div className="relative w-full max-h-[371px] overflow-auto shadow-sm border border-border rounded-lg">
    <table
      ref={ref}
      className={`min-w-full divide-y divide-border ${className}`}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/**
 * Container for the table's column headers.
 * Fixed to the top of the scroll container via sticky positioning.
 * Utilizes a solid background to prevent scrolling content from bleeding through.
 */
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <thead
    ref={ref}
    className={`sticky top-0 z-10 bg-muted [&_tr]:border-b ${className}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

/**
 * Container for the table's data rows.
 * Enforces vertical dividers between rows via the border token.
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
 * Represents a single row of data or headers.
 * Includes interactive hover state transitions for data rows.
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
 * Represents a structural header cell (th).
 * Enforces semantic font weights and foreground text colors.
 */
export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className = "", ...props }, ref) => (
  <th
    ref={ref}
    className={`px-3 py-3.5 text-left text-sm font-semibold text-foreground ${className}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/**
 * Represents a standard data cell (td).
 * Prevents text wrapping by default and uses the muted foreground color.
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
