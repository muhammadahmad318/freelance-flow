/**
 * src/features/clients/hooks/useClients.ts
 *
 * Custom hooks to manage server state for the Client domain.
 * Utilizes TanStack Query for caching, pagination, and optimistic invalidation.
 */
import { clientService } from "@/features/clients/services/clientService";
import type {
  CreateClientDTO,
  UpdateClientDTO,
  ClientQueryOptions,
} from "@/features/clients/types/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

/** Base query key for all client-related cache entries */
export const CLIENTS_QUERY_KEY = ["clients"] as const;

/**
 * Hook to fetch and cache the paginated list of clients.
 * Keeps previous data visible while fetching the next page to prevent UI flashing.
 *
 * @param options - Pagination and search filters mapped to the backend endpoint.
 */
export function useClients(options: ClientQueryOptions = {}) {
  return useQuery({
    queryKey: [
      ...CLIENTS_QUERY_KEY,
      options.page,
      options.limit,
      options.search,
    ],
    queryFn: () => clientService.getClients(options),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to create a new client.
 * Automatically invalidates the client cache to trigger a UI refresh upon success.
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newClient: CreateClientDTO) =>
      clientService.createClient(newClient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
}

/**
 * Hook to update an existing client record.
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClientDTO }) =>
      clientService.updateClient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
}

/**
 * Hook to permanently delete a client record.
 */
export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
}
