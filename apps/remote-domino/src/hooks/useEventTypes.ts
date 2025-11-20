/**
 * useEventTypes Hook
 *
 * Fetches all event types for filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchEventTypes } from "../api";
import type {
  PaginatedEventTypesResponse,
  FetchEventTypesParams,
} from "../api";

/**
 * Hook to fetch event types with optional pagination
 *
 * @param params - Optional pagination parameters
 * @returns React Query result with event types data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useEventTypes({ pageNumber: 1, pageSize: 100 });
 * ```
 */
export function useEventTypes(params?: FetchEventTypesParams) {
  return useAuthenticatedQuery<PaginatedEventTypesResponse>(
    ["eventTypes", params],
    (token) => fetchEventTypes(token, params),
    {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  );
}
