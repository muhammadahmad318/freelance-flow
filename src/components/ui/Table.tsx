/**
 * src/components/ui/Table.tsx
 *
 * Global, reusable Table components utilizing the Electric Pulse design tokens.
 * Built with React.forwardRef to ensure DOM nodes can be accessed by parent components.
 */
import React from "react";

/**
 * Primary wrapper for the table layout.
 * Establishes the outer border, shadow, and hidden overflow to ensure rounded corners render correctly.
 */
export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className = "", ...props }, ref) => (
  <div className="overflow-hidden shadow-sm border border-border rounded-lg">
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
 * Applies the muted background token to distinguish the header from the data rows.
 */
export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className = "", ...props }, ref) => (
  <thead ref={ref} className={`bg-muted/50 ${className}`} {...props} />
));
TableHeader.displayName = "TableHeader";

/**
 * Container for the table's data rows.
 * Enforces vertical dividers between rows using the border token.
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
