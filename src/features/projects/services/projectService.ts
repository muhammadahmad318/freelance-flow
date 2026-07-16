/**
 * src/features/projects/services/projectService.ts
 *
 * Service layer for the Project domain.
 * Encapsulates all external Supabase database calls, handling pagination,
 * search filtering, relational data fetching, and mapping.
 */
import type {
  Project,
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectQueryOptions,
} from "@/features/projects/types/project";
import type { PaginatedResponse } from "@/features/clients/types/client";
import { supabase } from "@/lib/supabase";

export const projectService = {
  /**
   * Fetches a paginated, filtered, and relationally joined list of projects.
   */
  async getProjects({ page = 1, limit = 10, search = "", status, clientId }: ProjectQueryOptions = {}): Promise<PaginatedResponse<Project>> {

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Relational Fetching: Eagerly load the client's name and company
    let query = supabase.from("projects").select(
      `
        id,
        userId:user_id,
        clientId:client_id,
        name,
        description,
        status,
        startDate:start_date,
        endDate:end_date,
        budget,
        createdAt:created_at,
        updatedAt:updated_at,
        clients (
          name,
          company
        )
      `,
      { count: "exact" },
    );

    // Apply Status Filter
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Apply Client Filter
    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    // Apply Search Filter (GIN Index Optimized)
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`);
    }

    // Execute paginated and ordered query
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      if (error.code === "PGRST103") {
        return {
          data: [],
          meta: {
            totalRecords: count || 0,
            currentPage: page,
            totalPages: Math.ceil((count || 0) / limit),
            hasNextPage: false,
            hasPreviousPage: page > 1,
          },
        };
      }
      console.error("CRITICAL: Failed to fetch projects.", error.message);
      throw error;
    }

    // Safely calculate pagination metadata
    const totalRecords = count || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: (data as unknown as Project[]) || [],
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
   * Creates a new project record in the database.
   */
  async createProject(payload: CreateProjectDTO): Promise<Project> {

    const { data, error } = await supabase
      .from("projects")
      .insert({
        client_id: payload.clientId,
        name: payload.name,
        description: payload.description,
        status: payload.status,
        start_date: payload.startDate,
        end_date: payload.endDate,
        budget: payload.budget,
      })
      .select(
        `
        id,
        userId:user_id,
        clientId:client_id,
        name,
        description,
        status,
        startDate:start_date,
        endDate:end_date,
        budget,
        createdAt:created_at,
        updatedAt:updated_at
      `,
      )
      .single();

    if (error) {
      console.error("CRITICAL: Failed to create project.", error.message);
      throw error; // Throw raw error for errorMapper to catch
    }

    return data as unknown as Project;
  },

  /**
   * Updates an existing project record.
   */
  async updateProject(id: string, payload: UpdateProjectDTO): Promise<Project> {
    const updatePayload: Record<string, any> = {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.startDate !== undefined && { start_date: payload.startDate }),
      ...(payload.endDate !== undefined && { end_date: payload.endDate }),
      ...(payload.budget !== undefined && { budget: payload.budget }),
      ...(payload.clientId !== undefined && { client_id: payload.clientId }),
    };

    const { data, error } = await supabase
      .from("projects")
      .update(updatePayload)
      .eq("id", id)
      .select(
        `
        id,
        userId:user_id,
        clientId:client_id,
        name,
        description,
        status,
        startDate:start_date,
        endDate:end_date,
        budget,
        createdAt:created_at,
        updatedAt:updated_at
      `,
      )
      .single();

    if (error) {
      console.error("CRITICAL: Failed to update project.", error.message);
      throw error;
    }

    return data as unknown as Project;
  },

  /**
   * Permanently deletes a project record from the database.
   */
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      console.error("CRITICAL: Failed to delete project.", error.message);
      throw error;
    }
  },
};
