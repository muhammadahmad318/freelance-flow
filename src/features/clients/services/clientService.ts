/**
 * src/features/clients/services/clientService.ts
 *
 * Service layer for the Client domain.
 * Encapsulates all external API/Database calls to keep components pure.
 */

import type { Client, CreateClientDTO } from "../types/client";
import { supabase } from "@/lib/supabase";

export const clientService = {
  /**
   * Fetches all clients for the authenticated user.
   * Relies on Supabase RLS for tenant isolation.
   *
   * @returns {Promise<Client[]>} Array of mapped Client objects
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
      console.error("[clientService] Error fetching clients:", error.message);
      throw new Error(error.message);
    }

    return data as Client[];
  },

  /**
   * Creates a new client record in the database.
   * Supabase automatically handles the user_id injection via RLS policies.
   *
   * @param {CreateClientDTO} payload - The validated client data
   * @returns {Promise<Client>} The newly created client record mapped to camelCase
   */
  async createClient(payload: CreateClientDTO): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .insert(payload) // Payload keys (name, email, phone, company) perfectly match DB columns
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
      .single(); // Guarantees we return a single object, not an array

    if (error) {
      console.error("[clientService] Error creating client:", error.message);
      // Throwing standard Error allows React Query/Hook Form to catch and display it
      throw new Error(error.message);
    }

    return data as Client;
  },
};
