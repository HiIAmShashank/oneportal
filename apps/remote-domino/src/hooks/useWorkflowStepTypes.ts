/**
 * useWorkflowStepTypes Hook
 *
 * Fetches all workflow step types for filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchWorkflowStepTypes } from "../api";
import type {
  PaginatedWorkflowStepTypesResponse,
  FetchWorkflowStepTypesParams,
} from "../api";

/**
 * Hook to fetch workflow step types with optional pagination
 *
 * @param params - Optional pagination parameters
 * @returns React Query result with workflow step types data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useWorkflowStepTypes({ pageNumber: 1, pageSize: 100 });
 * ```
 */
export function useWorkflowStepTypes(params?: FetchWorkflowStepTypesParams) {
  return useAuthenticatedQuery<PaginatedWorkflowStepTypesResponse>(
    ["workflowStepTypes", params],
    (token) => fetchWorkflowStepTypes(token, params),
    {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  );
}
