/**
 * useToggleApplicationFavorite Hook
 *
 * Provides a mutation to toggle application favorite status with optimistic updates.
 * Uses TanStack Query for cache management and automatic revalidation.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMsal } from "@azure/msal-react";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import {
  addApplicationFavorite,
  removeApplicationFavorite,
} from "../api/client";
import type { RemoteApp } from "@one-portal/types";
import { toast } from "@one-portal/ui";
import { getAuthConfig } from "../auth/msalInstance";

export function useToggleApplicationFavorite() {
  const queryClient = useQueryClient();
  const { instance, accounts } = useMsal();
  const account = accounts[0];

  return useMutation({
    mutationFn: async ({
      applicationId,
      isFavorite,
    }: {
      applicationId: string;
      isFavorite: boolean;
    }) => {
      if (!account) {
        throw new Error("No authenticated account");
      }

      const authConfig = getAuthConfig();
      const result = await acquireToken({
        msalInstance: instance,
        account,
        scopes: authConfig.scopes,
      });

      if (isFavorite) {
        return await removeApplicationFavorite(
          result.accessToken,
          applicationId,
        );
      } else {
        return await addApplicationFavorite(result.accessToken, applicationId);
      }
    },

    // Optimistic update
    onMutate: async ({ applicationId, isFavorite }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["applications"] });

      // Snapshot previous value
      const previousApps = queryClient.getQueryData<RemoteApp[]>([
        "applications",
      ]);

      // Optimistically update cache
      queryClient.setQueryData<RemoteApp[]>(["applications"], (old) => {
        if (!old) return old;
        return old.map((app) =>
          app.id === applicationId ? { ...app, isFavorite: !isFavorite } : app,
        );
      });

      return { previousApps };
    },

    onError: (error, _variables, context) => {
      // Rollback on error
      if (context?.previousApps) {
        queryClient.setQueryData(["applications"], context.previousApps);
      }

      toast.error("Failed to update favorite", {
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact support.",
      });
    },

    onSuccess: (_data, { isFavorite }) => {
      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites",
      );
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
