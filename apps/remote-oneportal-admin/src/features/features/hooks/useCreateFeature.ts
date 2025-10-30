import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../../../auth/msalInstance";
import { createFeature } from "../../../api/client";
import type { CreateFeatureRequest } from "../../../api/types";
import { toast } from "@one-portal/ui";

/**
 * Hook to create a new feature (SuperUser only)
 *
 * Invalidates the features query cache on success.
 * Shows success/error toast notifications.
 *
 * @returns React Query mutation for creating a feature
 *
 * @example
 * ```tsx
 * function CreateFeatureSheet() {
 *   const createMutation = useCreateFeature();
 *
 *   const handleSubmit = (data: CreateFeatureFormData) => {
 *     createMutation.mutate(data, {
 *       onSuccess: () => setOpen(false),
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useCreateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFeatureRequest) => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error("No authenticated user found");
      }

      const tokenResult = await acquireToken({
        msalInstance,
        account: accounts[0]!,
        scopes: getAuthConfig().scopes,
      });

      return await createFeature(tokenResult.accessToken, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Feature created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create feature: ${error.message}`);
    },
  });
}
