/**
 * React Query hook for checking SuperUser status
 *
 * Uses TanStack Query to fetch and cache the user's admin privileges.
 * The result is cached for 5 minutes to avoid unnecessary API calls.
 *
 * @example Basic usage
 * ```typescript
 * function AdminPanel() {
 *   const { data: isSuperUser, isLoading } = useSuperUser();
 *
 *   if (isLoading) return <Spinner />;
 *   if (!isSuperUser) return <AccessDenied />;
 *   return <AdminDashboard />;
 * }
 * ```
 *
 * @example With error handling
 * ```typescript
 * function AdminPanel() {
 *   const { data: isSuperUser, isLoading, error, refetch } = useSuperUser();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage onRetry={refetch} />;
 *   if (!isSuperUser) return <AccessDenied />;
 *   return <AdminDashboard />;
 * }
 * ```
 */

import { checkSuperUser } from "../api";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";

/**
 * Hook to check if the current user has SuperUser privileges
 *
 * @returns Query result with:
 *   - data: boolean | undefined - true if superuser, false otherwise, undefined while loading
 *   - isLoading: boolean - true while fetching
 *   - error: Error | null - error if request failed
 *   - refetch: () => void - function to manually refetch
 */
export function useSuperUser() {
  return useAuthenticatedQuery(
    ["superuser"],
    (token) => checkSuperUser(token),
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      retry: false, // Don't retry on auth errors
    },
  );
}
