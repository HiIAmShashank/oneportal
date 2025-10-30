/**
 * Roles Data Fetching Hook
 *
 * Fetches all available roles from the OnePortal Admin API.
 * Roles include Reader, Editor, and Admin with their respective levels.
 */

import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchRoles } from "../../../api/client";
import type { ApiRole } from "../../../api/types";

/**
 * Hook to fetch all available roles with authentication
 *
 * @returns React Query result with roles array, loading, and error states
 *
 * @example
 * ```tsx
 * function RoleSelector() {
 *   const { data: roles, isLoading } = useRoles();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <Select>
 *       {roles?.map(role => (
 *         <SelectItem key={role.roleIdentifier} value={role.roleIdentifier}>
 *           {role.roleName}
 *         </SelectItem>
 *       ))}
 *     </Select>
 *   );
 * }
 * ```
 */
export function useRoles() {
  return useAuthenticatedQuery<ApiRole[]>(["roles"], fetchRoles, {
    // Cache roles for 1 hour (they rarely change)
    staleTime: 60 * 60 * 1000,
    // Keep in cache for 24 hours
    gcTime: 24 * 60 * 60 * 1000,
  });
}
