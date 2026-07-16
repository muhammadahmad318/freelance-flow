/**
 * src/features/projects/types/project.ts
 *
 * Domain entities and Data Transfer Objects (DTOs) for the Project module.
 * Maps strictly to the backend schema while ensuring frontend camelCase conventions.
 */

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'on_hold';

/**
 * Base Project Interface
 * Represents the complete project record as consumed by the UI.
 */
export interface Project {
  id: string;
  userId: string;
  clientId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  createdAt: string;
  updatedAt: string;
  clients?: {
    name: string;
    company: string | null;
  };
}

/**
 * Data Transfer Object for Creating a Project
 */
export type CreateProjectDTO = Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'clients'>;

/**
 * Data Transfer Object for Updating a Project
 */
export type UpdateProjectDTO = Partial<CreateProjectDTO>;

/**
 * Query parameters accepted by the Project service layer for fetching records.
 */
export interface ProjectQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus | 'all';
  clientId?: string;
}
