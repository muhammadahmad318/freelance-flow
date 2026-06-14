/**
 * src/features/clients/hooks/useClients.ts
 *
 * Custom hooks to manage server state for the Client domain.
 * Abstracts TanStack Query implementation details away from UI components.
 */

import { clientService } from "@/features/clients/services/clientService";
import type { CreateClientDTO } from "@/features/clients/types/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Centralized Query Key to prevent typo-induced cache bugs
export const CLIENTS_QUERY_KEY = ["clients"] as const;

/**
 * Hook to fetch and cache the list of clients.
 */
export function useClients() {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: clientService.getClients,
    // Enterprise configuration: data is considered fresh for 1 minute
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to create a new client and invalidate the cache upon success.
 */
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newClient: CreateClientDTO) =>
      clientService.createClient(newClient),
    onSuccess: () => {
      // Invalidate the cache to trigger an automatic background refetch,
      // ensuring the UI immediately reflects the newly added client.
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
}
