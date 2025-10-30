/**
 * Create User Mutation Hook
 *
 * React Query mutation hook for creating new users.
 * Handles authentication token acquisition and cache invalidation.
 */

import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { createUser } from "../../../api/client";
import type { CreateUserRequest, ApiUser } from "../../../api/types";
import { toast } from "@one-portal/ui";

/**
 * Hook for creating a new user
 *
 * Features:
 * - Automatic token acquisition via MSAL
 * - Optimistic updates to user list
 * - Automatic cache invalidation on success
 * - Error handling with toast notifications
 *
 * @returns Mutation object with mutate, mutateAsync, and state
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateUser();
 *
 * const handleSubmit = (data: CreateUserRequest) => {
 *   mutate({ data }, {
 *     onSuccess: () => toast.success("User created!"),
 *     onError: (error) => toast.error(error.message)
 *   });
 * };
 * ```
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (token, { data }: { data: CreateUserRequest }) => createUser(token, data),
    {
      onSuccess: (newUser) => {
        // Invalidate users query to refetch the list
        queryClient.invalidateQueries({ queryKey: ["users"] });

        // Optimistically update the cache
        queryClient.setQueryData<ApiUser[]>(["users"], (old) => {
          if (!old) return [newUser];
          return [...old, newUser];
        });

        toast.success("User created successfully");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create user. Please try again.",
        );
      },
    },
  );
}
