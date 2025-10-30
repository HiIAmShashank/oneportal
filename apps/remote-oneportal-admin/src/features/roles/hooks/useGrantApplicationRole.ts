/**
 * Grant Application Role Mutation Hook
 *
 * React Query mutation hook for granting application-level roles to users.
 * Handles authentication token acquisition and cache invalidation.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { grantApplicationRole } from "../../../api/client";
import type { GrantApplicationRoleRequest } from "../../../api/types";
import { toast } from "@one-portal/ui";

/**
 * Hook for granting an application-level role to a user
 *
 * Features:
 * - Automatic token acquisition via MSAL
 * - Automatic cache invalidation on success
 * - Error handling with toast notifications
 * - Idempotent (replaces existing role if present)
 *
 * @returns Mutation object with mutate, mutateAsync, and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useGrantApplicationRole();
 *
 * const handleSubmit = (data: GrantApplicationRoleRequest) => {
 *   mutate({ data }, {
 *     onSuccess: () => console.log("Role granted!"),
 *   });
 * };
 * ```
 */
export function useGrantApplicationRole() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (token, { data }: { data: GrantApplicationRoleRequest }) =>
      grantApplicationRole(token, data),
    {
      onSuccess: (_result, variables) => {
        // Invalidate user's application roles query
        queryClient.invalidateQueries({
          queryKey: ["user-application-roles", variables.data.userIdentifier],
        });

        toast.success("Application role granted successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to grant application role. Please try again.",
        );
      },
    },
  );
}
