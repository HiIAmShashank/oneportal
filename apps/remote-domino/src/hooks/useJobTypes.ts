/**
 * useJobTypes Hook
 *
 * Fetches all job types for filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchJobTypes } from "../api";
import type { PaginatedJobTypesResponse, FetchJobTypesParams } from "../api";

/**
 * Hook to fetch job types with optional pagination
 *
 * @param params - Optional pagination parameters
 * @returns React Query result with job types data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useJobTypes({ pageNumber: 1, pageSize: 100 });
 * ```
 */
export function useJobTypes(params?: FetchJobTypesParams) {
  return useAuthenticatedQuery<PaginatedJobTypesResponse>(
    ["jobTypes", params],
    (token) => fetchJobTypes(token, params),
    {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  );
}
