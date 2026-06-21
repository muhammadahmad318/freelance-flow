/**
 * src/features/clients/hooks/useClients.ts
 *
 * Custom hooks to manage server state for the Client domain.
 */
import { clientService } from "@/features/clients/services/clientService";
import type {
  CreateClientDTO,
  UpdateClientDTO,
} from "@/features/clients/types/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const CLIENTS_QUERY_KEY = ["clients"] as const;

/**
 * Hook to fetch and cache the list of clients.
 */
export function useClients() {
  return useQuery({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: clientService.getClients,
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
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
    },
  });
}

/**
 * Hook to update an existing client and invalidate the cache upon success.
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
 * Hook to delete a client and invalidate the cache upon success.
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
