import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../../../auth/msalInstance";
import { activateFeature, deactivateFeature } from "../../../api/client";
import { toast } from "@one-portal/ui";

interface ToggleFeatureActiveParams {
  featureIdentifier: string;
  currentStatus: boolean;
}

/**
 * Hook to toggle feature active status (SuperUser only)
 *
 * Activates inactive features or deactivates active features.
 * Invalidates both the features list and individual feature query caches.
 * Shows success/error toast notifications.
 *
 * @returns React Query mutation for toggling feature status
 *
 * @example
 * ```tsx
 * function FeatureStatusToggle({ feature }) {
 *   const toggleMutation = useToggleFeatureActive();
 *
 *   const handleToggle = () => {
 *     toggleMutation.mutate({
 *       featureIdentifier: feature.featureIdentifier,
 *       currentStatus: feature.isActive,
 *     });
 *   };
 *
 *   return <Switch checked={feature.isActive} onCheckedChange={handleToggle} />;
 * }
 * ```
 */
export function useToggleFeatureActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      featureIdentifier,
      currentStatus,
    }: ToggleFeatureActiveParams) => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error("No authenticated user found");
      }

      const tokenResult = await acquireToken({
        msalInstance,
        account: accounts[0]!,
        scopes: getAuthConfig().scopes,
      });

      // Call activate or deactivate based on current status
      if (currentStatus) {
        return await deactivateFeature(
          tokenResult.accessToken,
          featureIdentifier,
        );
      } else {
        return await activateFeature(
          tokenResult.accessToken,
          featureIdentifier,
        );
      }
    },
    onSuccess: async (data, variables) => {
      // Invalidate the features list cache
      queryClient.invalidateQueries({ queryKey: ["features"] });

      // Invalidate the specific feature cache to update UI immediately
      queryClient.invalidateQueries({
        queryKey: ["feature", variables.featureIdentifier],
      });

      const newStatus = data.isActive ? "activated" : "deactivated";
      toast.success(`Feature ${newStatus} successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to toggle feature status: ${error.message}`);
    },
  });
}
