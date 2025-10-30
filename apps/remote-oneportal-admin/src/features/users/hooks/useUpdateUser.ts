/**
 * Update User Mutation Hook
 *
 * React Query mutation hook for updating existing users.
 * Handles authentication token acquisition and cache invalidation.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { updateUser } from "../../../api/client";
import type { UpdateUserRequest, ApiUser } from "../../../api/types";
import { toast } from "@one-portal/ui";

/**
 * Hook for updating an existing user
 *
 * Features:
 * - Automatic token acquisition via MSAL
 * - Optimistic cache updates
 * - Automatic cache invalidation on success
 * - Error handling with toast notifications
 *
 * @returns Mutation object with mutate, mutateAsync, and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateUser();
 *
 * const handleSubmit = (userIdentifier: string, data: UpdateUserRequest) => {
 *   mutate({ userIdentifier, data }, {
 *     onSuccess: () => toast.success("User updated!"),
 *     onError: (error) => toast.error(error.message)
 *   });
 * };
 * ```
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (
      token,
      {
        userIdentifier,
        data,
      }: { userIdentifier: string; data: UpdateUserRequest },
    ) => updateUser(token, userIdentifier, data),
    {
      onSuccess: (updatedUser) => {
        // Invalidate users query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["users"] });

        // Optimistically update the cache
        queryClient.setQueryData<ApiUser[]>(["users"], (old) => {
          if (!old) return [updatedUser];
          return old.map((u) =>
            u.userIdentifier === updatedUser.userIdentifier ? updatedUser : u,
          );
        });

        toast.success("User updated successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to update user. Please try again.",
        );
      },
    },
  );
}
