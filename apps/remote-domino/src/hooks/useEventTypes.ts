/**
 * useEventTypes Hook
 *
 * Fetches all event types for filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchEventTypes } from "../api";
import type { PaginatedEventTypesResponse } from "../api";

/**
 * Hook to fetch event types
 *
 * @returns React Query result with event types data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useEventTypes();
 * ```
 */
export function useEventTypes() {
  return useAuthenticatedQuery<PaginatedEventTypesResponse>(
    ["eventTypes"],
    (token) => fetchEventTypes(token),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes - event types don't change often
      retry: 2,
    },
  );
}
