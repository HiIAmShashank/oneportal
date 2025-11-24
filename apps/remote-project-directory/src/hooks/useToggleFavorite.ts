import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { updateFavouriteProject } from "../api/client";
import { type GetProjectsResponse } from "../api/types";
import { useUserContext } from "../contexts/UserContext";
import { toast } from "@one-portal/ui";
import { Check, CircleX } from "lucide-react";
import React from "react";

interface ToggleFavoriteParams {
  projectId: number;
  isFavourite: boolean;
  projectName: string;
}

export function useToggleFavorite() {
  const { user } = useUserContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, isFavourite }: ToggleFavoriteParams) => {
      if (!user?.userId) throw new Error("User ID not available");

      const accounts = msalInstance.getAllAccounts();
      const account = accounts[0];
      if (!account) throw new Error("No active account");

      const tokenResult = await acquireToken({
        msalInstance,
        account,
        scopes: getAuthConfig().scopes,
      });

      // If currently favorite, we want to remove (UpdateType 1)
      // If currently NOT favorite, we want to add (UpdateType 0)
      const updateType = isFavourite ? 1 : 0;

      await updateFavouriteProject(
        tokenResult.accessToken,
        tokenResult.account.username,
        {
          UserId: user.userId,
          ProjectId: projectId,
          UpdateType: updateType,
        },
      );
    },
    onMutate: async ({ projectId, isFavourite }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueriesData<
        InfiniteData<GetProjectsResponse>
      >({ queryKey: ["projects"] });

      // Optimistically update to the new value
      queryClient.setQueriesData<InfiniteData<GetProjectsResponse>>(
        { queryKey: ["projects"] },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              projects: page.projects.map((project) => {
                if (project.id === projectId) {
                  return { ...project, isFavourite: !isFavourite };
                }
                return project;
              }),
            })),
          };
        },
      );

      // Return a context object with the snapshotted value
      return { previousProjects };
    },
    onError: (_err, _newTodo, context) => {
      // Rollback to the previous value
      if (context?.previousProjects) {
        context.previousProjects.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast("Error updating favorites", {
        icon: React.createElement(CircleX, {
          className: "h-4 w-4 text-red-500",
        }),
      });
    },
    onSuccess: (_data, variables) => {
      const { isFavourite, projectName } = variables;
      // isFavourite passed in is the OLD state.
      // If it WAS favorite, we removed it.
      // If it WAS NOT favorite, we added it.
      const action = isFavourite ? "removed from" : "added to";

      toast(`${projectName} ${action} favorites`, {
        icon: React.createElement(Check, {
          className: "h-4 w-4 text-green-500",
        }),
      });
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Also refetch user profile to update favorites list
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
