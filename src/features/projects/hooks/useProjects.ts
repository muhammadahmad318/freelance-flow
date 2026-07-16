/**
 * src/features/projects/hooks/useProjects.ts
 *
 * Custom hooks to manage server state for the Project domain.
 * Utilizes TanStack Query for caching, pagination, and error interception.
 */
import { projectService } from "@/features/projects/services/projectService";
import type {
  CreateProjectDTO,
  UpdateProjectDTO,
  ProjectQueryOptions,
} from "@/features/projects/types/project";
import { parseSupabaseError } from "@/lib/errorMapper";
import { useToast } from "@/contexts/ToastContext";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

/** Base query key for all project-related cache entries */
export const PROJECTS_QUERY_KEY = ["projects"] as const;

/**
 * Hook to fetch and cache the paginated list of projects.
 */
export function useProjects(options: ProjectQueryOptions = {}) {
  return useQuery({
    queryKey: [
      ...PROJECTS_QUERY_KEY,
      options.page,
      options.limit,
      options.search,
      options.status,
      options.clientId,
    ],
    queryFn: () => projectService.getProjects(options),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to create a new project.
 * Shows translated toast on error.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (newProject: CreateProjectDTO) =>
      projectService.createProject(newProject),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast({ title: "Project created successfully.", type: "success" });
    },
    onError: (error) => {
      const message = parseSupabaseError(error);
      toast({ title: message, type: "error" });
    },
  });
}

/**
 * Hook to update an existing project record.
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProjectDTO }) =>
      projectService.updateProject(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast({ title: "Project updated successfully.", type: "success" });
    },
    onError: (error) => {
      const message = parseSupabaseError(error);
      toast({ title: message, type: "error" });
    },
  });
}

/**
 * Hook to permanently delete a project record.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      toast({ title: "Project deleted successfully.", type: "success" });
    },
    onError: (error) => {
      const message = parseSupabaseError(error);
      toast({ title: message, type: "error" });
    },
  });
}
