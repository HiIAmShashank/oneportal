/**
 * useEvents Hook
 *
 * Fetches paginated events with optional filtering
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchEvents } from "../api";
import type { PaginatedEventsResponse, FetchEventsParams } from "../api";

/**
 * Hook to fetch events with pagination and filtering
 *
 * @param params - Optional pagination and filter parameters
 * @returns React Query result with events data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useEvents({
 *   pageNumber: 1,
 *   pageSize: 10,
 *   applicationId: 'app-123'
 * });
 * ```
 */
export function useEvents(params?: FetchEventsParams) {
  return useAuthenticatedQuery<PaginatedEventsResponse>(
    ["events", params],
    (token) => fetchEvents(token, params),
    {
      staleTime: 30 * 1000, // 30 seconds
      retry: 2,
    },
  );
}
