/**
 * Revoke Application Role Mutation Hook
 *
 * React Query mutation hook for revoking application-level roles from users.
 * Handles authentication token acquisition and cache invalidation.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { revokeApplicationRole } from "../../../api/client";
import { toast } from "@one-portal/ui";

/**
 * Hook for revoking a user's application-level role
 *
 * Features:
 * - Automatic token acquisition via MSAL
 * - Automatic cache invalidation on success
 * - Error handling with toast notifications
 * - Cascades to revoke all feature roles for that application
 *
 * @returns Mutation object with mutate, mutateAsync, and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useRevokeApplicationRole();
 *
 * const handleRevoke = (userId: string, appId: string) => {
 *   mutate({ userIdentifier: userId, applicationIdentifier: appId }, {
 *     onSuccess: () => console.log("Role revoked!"),
 *   });
 * };
 * ```
 */
export function useRevokeApplicationRole() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (
      token,
      {
        userIdentifier,
        applicationIdentifier,
      }: { userIdentifier: string; applicationIdentifier: string },
    ) => revokeApplicationRole(token, userIdentifier, applicationIdentifier),
    {
      onSuccess: (_result, variables) => {
        // Invalidate user's application roles query
        queryClient.invalidateQueries({
          queryKey: ["user-application-roles", variables.userIdentifier],
        });

        // Also invalidate feature roles since they cascade
        queryClient.invalidateQueries({
          queryKey: ["user-feature-roles", variables.userIdentifier],
        });

        toast.success("Application role revoked successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to revoke application role. Please try again.",
        );
      },
    },
  );
}
