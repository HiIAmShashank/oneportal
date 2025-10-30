/**
 * Grant Feature Role Mutation Hook
 *
 * React Query mutation hook for granting feature-level roles to users.
 * Handles authentication token acquisition and cache invalidation.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { grantFeatureRole } from "../../../api/client";
import type { GrantFeatureRoleRequest } from "../../../api/types";
import { toast } from "@one-portal/ui";

/**
 * Hook for granting a feature-level role to a user
 *
 * Features:
 * - Automatic token acquisition via MSAL
 * - Automatic cache invalidation on success
 * - Error handling with toast notifications
 * - Idempotent (replaces existing role if present)
 * - Validates that user has application-level role first (API enforces this)
 *
 * @returns Mutation object with mutate, mutateAsync, and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useGrantFeatureRole();
 *
 * const handleSubmit = (data: GrantFeatureRoleRequest) => {
 *   mutate({ data }, {
 *     onSuccess: () => console.log("Feature role granted!"),
 *   });
 * };
 * ```
 */
export function useGrantFeatureRole() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (token, { data }: { data: GrantFeatureRoleRequest }) =>
      grantFeatureRole(token, data),
    {
      onSuccess: (_result, variables) => {
        // Invalidate user's feature roles query
        queryClient.invalidateQueries({
          queryKey: ["user-feature-roles", variables.data.userIdentifier],
        });

        toast.success("Feature role granted successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to grant feature role. Please try again.",
        );
      },
    },
  );
}
