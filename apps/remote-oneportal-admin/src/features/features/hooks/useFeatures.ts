import { useQuery } from "@tanstack/react-query";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../../../auth/msalInstance";
import { getFeatures } from "../../../api/client";
import type { ApiFeature } from "../../../api/types";

/**
 * Hook to fetch all features (SuperUser only)
 *
 * Returns all features (active and inactive) for SuperUsers.
 * Data is cached for 5 minutes and refetched on window focus.
 *
 * @returns React Query result with features array
 *
 * @example
 * ```tsx
 * function FeaturesPage() {
 *   const { data: features, isLoading, error } = useFeatures();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <DataTable data={features} columns={featureColumns} />;
 * }
 * ```
 */
export function useFeatures() {
  return useQuery<ApiFeature[], Error>({
    queryKey: ["features"],
    queryFn: async () => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error("No authenticated user found");
      }

      const tokenResult = await acquireToken({
        msalInstance,
        account: accounts[0]!,
        scopes: getAuthConfig().scopes,
      });

      return await getFeatures(tokenResult.accessToken);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
