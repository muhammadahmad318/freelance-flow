/**
 * src/features/clients/services/clientService.ts
 *
 * Service layer for the Client domain.
 * Encapsulates all external Supabase database calls, handling pagination,
 * search filtering, and data transformation.
 */
import type {
  Client,
  CreateClientDTO,
  UpdateClientDTO,
  ClientQueryOptions,
  PaginatedResponse,
} from "@/features/clients/types/client";
import { supabase } from "@/lib/supabase";

export const clientService = {
  /**
   * Fetches a paginated and optionally filtered list of clients for the authenticated user.
   *
   * @param options - Configuration object containing page, limit, and search parameters.
   * @returns A structured payload containing the mapped data array and calculation metadata.
   */
  async getClients({
    page = 1,
    limit = 10,
    search = "",
  }: ClientQueryOptions = {}): Promise<PaginatedResponse<Client>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Initialize query requesting exact count for accurate pagination metadata
    let query = supabase.from("clients").select(
      `
        id,
        name,
        email,
        phone,
        company,
        createdAt:created_at,
        updatedAt:updated_at
      `,
      { count: "exact" },
    );

    // Dynamically append GIN-indexed wildcard search if a term is provided
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(
        `name.ilike.${searchTerm},email.ilike.${searchTerm},company.ilike.${searchTerm}`,
      );
    }

    // Execute paginated and ordered query
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("CRITICAL: Failed to fetch clients.", error.message);
      throw new Error(error.message);
    }

    // Safely calculate pagination metadata
    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: (data as Client[]) || [],
      meta: {
        totalRecords,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  /**
   * Creates a new client record in the database.
   *
   * @param payload - The validated client data transfer object.
   * @returns The newly created client record, mapped to camelCase.
   */
  async createClient(payload: CreateClientDTO): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .insert(payload)
      .select(
        `
        id,
        name,
        email,
        phone,
        company,
        createdAt:created_at,
        updatedAt:updated_at
      `,
      )
      .single();

    if (error) {
      console.error("CRITICAL: Failed to create client.", error.message);
      throw new Error(error.message);
    }

    return data as Client;
  },

  /**
   * Updates an existing client record.
   *
   * @param id - The unique UUID of the client to update.
   * @param payload - The partial client data payload.
   * @returns The fully updated client record, mapped to camelCase.
   */
  async updateClient(id: string, payload: UpdateClientDTO): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .update(payload)
      .eq("id", id)
      .select(
        `
        id,
        name,
        email,
        phone,
        company,
        createdAt:created_at,
        updatedAt:updated_at
      `,
      )
      .single();

    if (error) {
      console.error("CRITICAL: Failed to update client.", error.message);
      throw new Error(error.message);
    }

    return data as Client;
  },

  /**
   * Permanently deletes a client record from the database.
   * Cascading deletes are handled by PostgreSQL.
   *
   * @param id - The unique UUID of the client to delete.
   */
  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      console.error("CRITICAL: Failed to delete client.", error.message);
      throw new Error(error.message);
    }
  },
};
