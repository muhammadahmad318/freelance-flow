/**
 * src/features/clients/components/ClientList.tsx
 *
 * Renders the tabular data for Clients.
 * Implements native Intl for performant date formatting without external libraries.
 */
import type { Client } from "../types/client";

interface ClientListProps {
  clients: Client[];
}

// Enterprise Standard: Cache the formatter to prevent recreation on every render
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function ClientList({ clients }: ClientListProps) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Contact
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Company
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Added
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {client.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <div className="flex flex-col">
                  <span>{client.email}</span>
                  {client.phone && (
                    <span className="text-xs text-gray-400">
                      {client.phone}
                    </span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {client.company || (
                  <span className="italic text-gray-400">N/A</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {dateFormatter.format(new Date(client.createdAt))}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  aria-label={`Edit ${client.name}`}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Renders a placeholder skeleton matching the table structure.
 */
export function ClientListSkeleton() {
  const rows = Array.from({ length: 5 }); // Display 5 skeleton rows

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg animate-pulse">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </th>
            <th scope="col" className="px-3 py-3.5">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </th>
            <th scope="col" className="px-3 py-3.5">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </th>
            <th scope="col" className="px-3 py-3.5">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {rows.map((_, idx) => (
            <tr key={idx}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </td>
              <td className="whitespace-nowrap px-3 py-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </td>
              <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                <div className="h-4 bg-gray-200 rounded w-10 ml-auto"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
