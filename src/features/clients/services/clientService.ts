/**
 * src/features/clients/services/clientService.ts
 *
 * Service layer for the Client domain.
 * Encapsulates all external API and Database calls.
 */
import type { Client, CreateClientDTO } from "../types/client";
import { supabase } from "@/lib/supabase";

export const clientService = {
  /**
   * Fetches all clients for the authenticated user.
   * Relies on Supabase RLS policies for tenant isolation.
   *
   * @returns Array of mapped Client objects.
   */
  async getClients(): Promise<Client[]> {
    console.log("clientService.getClients EXECUTING!");
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
};
