// /**
//  * src/components/ui/Pagination.tsx
//  *
//  * Advanced, responsive pagination control component.
//  * Features limit selection, exact record counts, and boundary jump controls.
//  */
// import React from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { Button } from "./Button";

// interface PaginationProps {
//   /** The currently active page number */
//   currentPage: number;
//   /** Total number of pages available */
//   totalPages: number;
//   /** Total exact count of records in the database */
//   totalRecords: number;
//   /** Number of records displayed per page */
//   limit: number;
//   /** Boolean flag indicating if a subsequent page exists */
//   hasNextPage: boolean;
//   /** Boolean flag indicating if a preceding page exists */
//   hasPreviousPage: boolean;
//   /** Callback triggered to change the active page */
//   onPageChange: (page: number) => void;
//   /** Callback triggered to change the items-per-page limit */
//   onLimitChange: (limit: number) => void;
//   /** Disables navigation buttons while data is loading */
//   isFetching?: boolean;
// }

// export const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   totalRecords,
//   limit,
//   hasNextPage,
//   hasPreviousPage,
//   onPageChange,
//   onLimitChange,
//   isFetching = false,
// }) => {
//   // Calculate display boundaries (e.g., "Showing 11 to 20")
//   const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * limit + 1;
//   const endRecord = Math.min(currentPage * limit, totalRecords);

//   // Collapse completely if there is no data to paginate
//   if (totalRecords === 0) return null;

//   return (
//     <div className="flex items-center justify-between border-t border-border bg-background px-4 py-3 sm:px-6 mt-4 rounded-b-lg">
//       {/* Mobile Layout (Simplified Controls) */}
//       <div className="flex flex-1 items-center justify-between sm:hidden">
//         <Button
//           variant="outline"
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={!hasPreviousPage || isFetching}
//           className="disabled:cursor-not-allowed"
//         >
//           Previous
//         </Button>
//         <span className="text-sm font-medium text-muted-foreground">
//           {currentPage} / {totalPages}
//         </span>
//         <Button
//           variant="outline"
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={!hasNextPage || isFetching}
//           className="disabled:cursor-not-allowed"
//         >
//           Next
//         </Button>
//       </div>

//       {/* Desktop Layout (Advanced Controls) */}
//       <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
//         {/* Record Count Indicator */}
//         <div>
//           <p className="text-sm text-muted-foreground">
//             Showing{" "}
//             <span className="font-medium text-foreground">{startRecord}</span>{" "}
//             to <span className="font-medium text-foreground">{endRecord}</span>{" "}
//             of{" "}
//             <span className="font-medium text-foreground">{totalRecords}</span>{" "}
//             entries
//           </p>
//         </div>

//         {/* Interactive Controls Area */}
//         <div className="flex items-center space-x-6 lg:space-x-8">
//           {/* Items Per Page Selector */}
//           <div className="flex items-center space-x-2">
//             <p className="text-sm font-medium text-muted-foreground">
//               Rows per page
//             </p>
//             <select
//               value={limit}
//               onChange={(e) => {
//                 onLimitChange(Number(e.target.value));
//                 onPageChange(1); // Force reset to page 1 to prevent out-of-bounds errors
//               }}
//               disabled={isFetching}
//               className="h-8 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed"
//             >
//               {[5, 10, 25, 50].map((pageSize) => (
//                 <option key={pageSize} value={pageSize}>
//                   {pageSize}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Page Number Indicator */}
//           <div className="flex w-25 items-center justify-center text-sm font-medium text-muted-foreground">
//             Page {currentPage} of {totalPages}
//           </div>

//           {/* Jump Navigation Buttons */}
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               onClick={() => onPageChange(1)}
//               disabled={!hasPreviousPage || isFetching}
//               className="hidden h-8 w-8 p-0 lg:flex items-center justify-center disabled:cursor-not-allowed"
//               aria-label="Go to first page"
//             >
//               <ChevronsLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => onPageChange(currentPage - 1)}
//               disabled={!hasPreviousPage || isFetching}
//               className="h-8 w-8 p-0 flex items-center justify-center disabled:cursor-not-allowed"
//               aria-label="Go to previous page"
//             >
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => onPageChange(currentPage + 1)}
//               disabled={!hasNextPage || isFetching}
//               className="h-8 w-8 p-0 flex items-center justify-center disabled:cursor-not-allowed"
//               aria-label="Go to next page"
//             >
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => onPageChange(totalPages)}
//               disabled={!hasNextPage || isFetching}
//               className="hidden h-8 w-8 p-0 lg:flex items-center justify-center disabled:cursor-not-allowed"
//               aria-label="Go to last page"
//             >
//               <ChevronsRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
