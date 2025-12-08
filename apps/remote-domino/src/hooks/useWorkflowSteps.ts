/**
 * useWorkflowSteps Hook
 *
 * Fetches all workflow steps for filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchWorkflowSteps } from "../api";
import type {
  PaginatedWorkflowStepsResponse,
  FetchWorkflowStepsParams,
} from "../api";

/**
 * Hook to fetch workflow steps with optional pagination
 *
 * @param params - Optional pagination parameters
 * @returns React Query result with workflow steps data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useWorkflowSteps({ pageNumber: 1, pageSize: 100 });
 * ```
 */
export function useWorkflowSteps(params?: FetchWorkflowStepsParams) {
  return useAuthenticatedQuery<PaginatedWorkflowStepsResponse>(
    ["workflowSteps", params],
    (token) => fetchWorkflowSteps(token, params),
    {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  );
}
