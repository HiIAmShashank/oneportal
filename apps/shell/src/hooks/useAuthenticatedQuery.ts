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
 * export function useSuperUser() {
 *   return useAuthenticatedQuery(
 *     ["superuser"],
 *     (token) => checkSuperUser(token)
 *   );
 * }
 * ```
 *
 * @example With custom options
 * ```typescript
 * export function useUserProfile() {
 *   return useAuthenticatedQuery(
 *     ["user", "profile"],
 *     (token) => getUserProfile(token),
 *     {
 *       staleTime: 10 * 60 * 1000, // 10 minutes
 *       retry: 3,
 *       onSuccess: (data) => console.log(data)
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
import { useMsal } from "@azure/msal-react";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { getAuthConfig } from "../auth/msalInstance";

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
 *   ["admin", "settings"],
 *   (token) => getAdminSettings(token)
 * );
 *
 * // With caching and custom error handling
 * const { data, refetch } = useAuthenticatedQuery(
 *   ["users", userId],
 *   (token) => getUser(token, userId),
 *   {
 *     staleTime: 5 * 60 * 1000,
 *     retry: false,
 *     onError: (error) => showToast(error.message)
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
  const { instance, accounts } = useMsal();
  const account = accounts[0];
  const isAuthenticated = accounts.length > 0;

  // Allow users to override enabled, but default to isAuthenticated
  const enabled =
    options?.enabled !== undefined ? options.enabled : isAuthenticated;

  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      if (!account) {
        throw new Error("No authenticated account") as TError;
      }

      // Get configured scopes from environment
      const authConfig = getAuthConfig();

      // Acquire access token using MSAL
      const result = await acquireToken({
        msalInstance: instance,
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
