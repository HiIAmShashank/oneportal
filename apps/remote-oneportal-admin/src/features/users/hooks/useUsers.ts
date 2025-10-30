/**
 * Users Data Fetching Hook
 *
 * Fetches the list of users from the OnePortal Admin API
 * with automatic authentication token handling.
 */

import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchUsers } from "../../../api/client";
import type { ApiUser } from "../../../api/types";

/**
 * Hook to fetch users list with authentication
 *
 * @returns React Query result with users array, loading, and error states
 *
 * @example
 * ```tsx
 * function UsersPage() {
 *   const { data, isLoading, error } = useUsers();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return <UserTable users={data} />;
 * }
 * ```
 */
export function useUsers() {
  return useAuthenticatedQuery<ApiUser[]>(["users"], fetchUsers, {
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Retry once on failure
    retry: 1,
  });
}
