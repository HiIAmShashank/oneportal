/**
 * Revoke Feature Role Mutation Hook
 *
 * React Query mutation hook for revoking feature-level roles from users.
 * Handles authentication token acquisition and cache invalidation.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { revokeFeatureRole } from "../../../api/client";
import { toast } from "@one-portal/ui";

/**
 * Hook for revoking a user's feature-level role
 *
 * Features:
 * - Automatic token acquisition via MSAL
 * - Automatic cache invalidation on success
 * - Error handling with toast notifications
 *
 * @returns Mutation object with mutate, mutateAsync, and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useRevokeFeatureRole();
 *
 * const handleRevoke = (userId: string, featureId: string) => {
 *   mutate({ userIdentifier: userId, featureIdentifier: featureId }, {
 *     onSuccess: () => console.log("Feature role revoked!"),
 *   });
 * };
 * ```
 */
export function useRevokeFeatureRole() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (
      token,
      {
        userIdentifier,
        featureIdentifier,
      }: { userIdentifier: string; featureIdentifier: string },
    ) => revokeFeatureRole(token, userIdentifier, featureIdentifier),
    {
      onSuccess: (_result, variables) => {
        // Invalidate user's feature roles query
        queryClient.invalidateQueries({
          queryKey: ["user-feature-roles", variables.userIdentifier],
        });

        toast.success("Feature role revoked successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to revoke feature role. Please try again.",
        );
      },
    },
  );
}
