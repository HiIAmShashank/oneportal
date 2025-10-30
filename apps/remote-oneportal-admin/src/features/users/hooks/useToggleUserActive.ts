/**
 * Toggle User Active Status Mutation Hook
 *
 * React Query mutation hook for activating/deactivating users.
 * Handles authentication token acquisition and cache invalidation.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { activateUser, deactivateUser } from "../../../api/client";
import type { ApiUser } from "../../../api/types";
import { toast } from "@one-portal/ui";

/**
 * Hook for toggling user active status
 *
 * Features:
 * - Automatic token acquisition via MSAL
 * - Idempotent activate/deactivate operations
 * - Optimistic cache updates
 * - Automatic cache invalidation on success
 * - Error handling with toast notifications
 *
 * @returns Mutation object with mutate, mutateAsync, and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useToggleUserActive();
 *
 * const handleToggle = (userIdentifier: string, shouldActivate: boolean) => {
 *   mutate({ userIdentifier, activate: shouldActivate });
 * };
 * ```
 */
export function useToggleUserActive() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (
      token,
      {
        userIdentifier,
        activate,
      }: { userIdentifier: string; activate: boolean },
    ) => {
      return activate
        ? activateUser(token, userIdentifier)
        : deactivateUser(token, userIdentifier);
    },
    {
      onSuccess: (updatedUser, { activate }) => {
        // Invalidate users query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["users"] });

        // Optimistically update the cache
        queryClient.setQueryData<ApiUser[]>(["users"], (old) => {
          if (!old) return [updatedUser];
          return old.map((u) =>
            u.userIdentifier === updatedUser.userIdentifier ? updatedUser : u,
          );
        });

        toast.success(
          activate
            ? "User activated successfully"
            : "User deactivated successfully",
        );
      },
      onError: (error, { activate }) => {
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to ${activate ? "activate" : "deactivate"} user. Please try again.`,
        );
      },
    },
  );
}
