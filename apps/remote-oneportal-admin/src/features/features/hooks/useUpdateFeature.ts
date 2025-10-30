import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../../../auth/msalInstance";
import { updateFeature } from "../../../api/client";
import type { UpdateFeatureRequest } from "../../../api/types";
import { toast } from "@one-portal/ui";

interface UpdateFeatureParams {
  featureIdentifier: string;
  data: UpdateFeatureRequest;
}

/**
 * Hook to update an existing feature (SuperUser only)
 *
 * Invalidates the features query cache on success.
 * Shows success/error toast notifications.
 *
 * @returns React Query mutation for updating a feature
 *
 * @example
 * ```tsx
 * function EditFeatureSheet({ feature }) {
 *   const updateMutation = useUpdateFeature();
 *
 *   const handleSubmit = (data: EditFeatureFormData) => {
 *     updateMutation.mutate({
 *       featureIdentifier: feature.featureIdentifier,
 *       data,
 *     }, {
 *       onSuccess: () => setOpen(false),
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useUpdateFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ featureIdentifier, data }: UpdateFeatureParams) => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error("No authenticated user found");
      }

      const tokenResult = await acquireToken({
        msalInstance,
        account: accounts[0]!,
        scopes: getAuthConfig().scopes,
      });

      return await updateFeature(
        tokenResult.accessToken,
        featureIdentifier,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
      toast.success("Feature updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update feature: ${error.message}`);
    },
  });
}
