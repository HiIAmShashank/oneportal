/**
 * useApplications Hook
 *
 * Fetches all applications for filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchApplications } from "../api";
import type { PaginatedApplicationsResponse } from "../api";

/**
 * Hook to fetch applications
 *
 * @returns React Query result with applications data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useApplications();
 * ```
 */
export function useApplications() {
  return useAuthenticatedQuery<PaginatedApplicationsResponse>(
    ["applications"],
    (token) => fetchApplications(token),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes - applications don't change often
      retry: 2,
    },
  );
}
