/**
 * Authenticated React Query Hook
 *
 * Eliminates token acquisition boilerplate by automatically:
 * - Acquiring access tokens via MSAL
 * - Handling authentication state
 * - Passing tokens to API functions
 * - Supporting all React Query options
 *
 * @example Basic usage
 * ```typescript
 * export function useEvents() {
 *   return useAuthenticatedQuery(
 *     ["events"],
 *     (token) => fetchEvents(token)
 *   );
 * }
 * ```
 *
 * @example With custom options
 * ```typescript
 * export function useEvents(params: FetchEventsParams) {
 *   return useAuthenticatedQuery(
 *     ["events", params],
 *     (token) => fetchEvents(token, params),
 *     {
 *       staleTime: 5 * 60 * 1000, // 5 minutes
 *       retry: 3,
 *     }
 *   );
 * }
 * ```
 */

import {
  useQuery,
  type UseQueryOptions,
  type QueryKey,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useAuth } from "@one-portal/auth/hooks";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";

/**
 * React Query hook that automatically handles token acquisition for authenticated API calls
 *
 * @template TData - The type of data returned by the API function
 * @template TError - The type of error that can be thrown (defaults to Error)
 *
 * @param queryKey - React Query key for caching and invalidation
 * @param apiFn - API function that takes an access token and returns a Promise
 * @param options - Optional React Query options (staleTime, retry, etc.)
 *
 * @returns Standard React Query result with data, isLoading, error, etc.
 *
 * @example
 * ```typescript
 * // Simple API call
 * const { data, isLoading, error } = useAuthenticatedQuery(
 *   ["events"],
 *   (token) => fetchEvents(token)
 * );
 *
 * // With filtering and pagination
 * const { data, refetch } = useAuthenticatedQuery(
 *   ["events", { pageNumber: 1, pageSize: 10 }],
 *   (token) => fetchEvents(token, { pageNumber: 1, pageSize: 10 }),
 *   {
 *     staleTime: 5 * 60 * 1000,
 *     retry: false,
 *   }
 * );
 * ```
 */
export function useAuthenticatedQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  apiFn: (token: string) => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, TError>,
    "queryKey" | "queryFn" | "enabled"
  > & {
    enabled?: boolean;
  },
): UseQueryResult<TData, TError> {
  const { state } = useAuth();
  const { isAuthenticated } = state;

  // Allow users to override enabled, but default to isAuthenticated
  const enabled =
    options?.enabled !== undefined ? options.enabled : isAuthenticated;

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      // Get the account from MSAL instance
      const accounts = msalInstance.getAllAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error("No MSAL account found") as TError;
      }

      // Get configured scopes from environment
      const authConfig = getAuthConfig();

      // Acquire access token using MSAL
      const result = await acquireToken({
        msalInstance,
        account,
        scopes: authConfig.scopes,
      });

      // Call the API function with the token
      return await apiFn(result.accessToken);
    },
    enabled,
    ...options,
  });
}
