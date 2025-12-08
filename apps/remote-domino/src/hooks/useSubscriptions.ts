/**
 * useSubscriptions Hook
 *
 * Fetches subscriptions with optional pagination
 */

import { useAuthenticatedQuery } from "./useAuthenticatedQuery";
import { fetchSubscriptions } from "../api";
import type {
  PaginatedSubscriptionsResponse,
  FetchSubscriptionsParams,
} from "../api";

/**
 * Hook to fetch subscriptions
 *
 * @param params - Optional pagination parameters
 * @returns React Query result with subscriptions data
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useSubscriptions({
 *   pageNumber: 1,
 *   pageSize: 10
 * });
 * ```
 */
export function useSubscriptions(params?: FetchSubscriptionsParams) {
  return useAuthenticatedQuery<PaginatedSubscriptionsResponse>(
    ["subscriptions", params],
    (token) => fetchSubscriptions(token, params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes - subscriptions don't change often
      retry: 2,
    },
  );
}
