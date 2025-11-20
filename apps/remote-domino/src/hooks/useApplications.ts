/**
 * useApplications Hook
 *
 * Fetches all applications for filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchApplications } from "../api";
import type {
  PaginatedApplicationsResponse,
  FetchApplicationsParams,
} from "../api";

/**
 * Hook to fetch applications with optional pagination
 *
 * @param params - Optional pagination parameters
 * @returns React Query result with applications data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useApplications({ pageNumber: 1, pageSize: 100 });
 * ```
 */
export function useApplications(params?: FetchApplicationsParams) {
  return useAuthenticatedQuery<PaginatedApplicationsResponse>(
    ["applications", params],
    (token) => fetchApplications(token, params),
    {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  );
}
