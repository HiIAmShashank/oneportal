/**
 * User Feature Roles Data Fetching Hook
 *
 * Fetches feature-level roles for a specific user.
 */

import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchUserFeatureRoles } from "../../../api/client";
import type { UserFeatureRole } from "../../../api/types";

/**
 * Hook to fetch feature-level roles for a specific user
 *
 * @param userIdentifier - User's unique identifier
 * @returns React Query result with user's feature roles array
 *
 * @example
 * ```tsx
 * function UserFeatureRoles({ userId }: { userId: string }) {
 *   const { data: featureRoles, isLoading } = useUserFeatureRoles(userId);
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   return (
 *     <Table>
 *       {featureRoles?.map(role => (
 *         <TableRow key={role.featureIdentifier}>
 *           <TableCell>{role.featureIdentifier}</TableCell>
 *           <TableCell>{role.role.roleName}</TableCell>
 *         </TableRow>
 *       ))}
 *     </Table>
 *   );
 * }
 * ```
 */
export function useUserFeatureRoles(userIdentifier: string | undefined) {
  return useAuthenticatedQuery<UserFeatureRole[]>(
    ["user-feature-roles", userIdentifier],
    (token) => fetchUserFeatureRoles(token, userIdentifier!),
    {
      enabled: !!userIdentifier,
      staleTime: 30 * 1000, // 30 seconds
    },
  );
}
