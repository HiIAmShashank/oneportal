/**
 * User Application Roles Data Fetching Hook
 *
 * Fetches application-level roles for a specific user.
 */

import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchUserApplicationRoles } from "../../../api/client";
import type { UserApplicationRole } from "../../../api/types";

/**
 * Hook to fetch application-level roles for a specific user
 *
 * @param userIdentifier - User's unique identifier
 * @returns React Query result with user's application roles array
 *
 * @example
 * ```tsx
 * function UserApplicationRoles({ userId }: { userId: string }) {
 *   const { data: appRoles, isLoading } = useUserApplicationRoles(userId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <Table>
 *       {appRoles?.map(role => (
 *         <TableRow key={role.applicationIdentifier}>
 *           <TableCell>{role.applicationIdentifier}</TableCell>
 *           <TableCell>{role.role.roleName}</TableCell>
 *         </TableRow>
 *       ))}
 *     </Table>
 *   );
 * }
 * ```
 */
export function useUserApplicationRoles(userIdentifier: string | undefined) {
  return useAuthenticatedQuery<UserApplicationRole[]>(
    ["user-application-roles", userIdentifier],
    (token) => fetchUserApplicationRoles(token, userIdentifier!),
    {
      enabled: !!userIdentifier,
      staleTime: 30 * 1000, // 30 seconds
    },
  );
}
