/**
 * src/features/clients/services/clientService.ts
 *
 * Service layer for the Client domain.
 * Encapsulates all external API and Database calls.
 */
import type {
  Client,
  CreateClientDTO,
  UpdateClientDTO,
} from "@/features/clients/types/client";
import { supabase } from "@/lib/supabase";

export const clientService = {
  /**
   * Fetches all clients for the authenticated user.
   *
   * @returns Array of mapped Client objects.
   */
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from("clients")
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("CRITICAL: Failed to fetch clients.", error.message);
      throw new Error(error.message);
    }

    return data as Client[];
  },

  /**
   * Creates a new client record in the database.
   *
   * @param payload - The validated client data.
   * @returns The newly created client record.
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
   * @param id - The unique identifier of the client to update.
   * @param payload - The partial client data to update.
   * @returns The updated client record.
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
   * Deletes a client record from the database.
   *
   * @param id - The unique identifier of the client to delete.
   */
  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      console.error("CRITICAL: Failed to delete client.", error.message);
      throw new Error(error.message);
    }
  },
};
