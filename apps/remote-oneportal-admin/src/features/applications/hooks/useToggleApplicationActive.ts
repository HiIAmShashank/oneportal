import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import {
  activateApplication,
  deactivateApplication,
} from "../../../api/client";
import type { ApiApplication } from "../../../api/types";
import { toast } from "@one-portal/ui";

export function useToggleApplicationActive() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (
      token,
      {
        applicationIdentifier,
        activate,
      }: { applicationIdentifier: string; activate: boolean },
    ) => {
      return activate
        ? activateApplication(token, applicationIdentifier)
        : deactivateApplication(token, applicationIdentifier);
    },
    {
      onSuccess: (
        updatedApplication: ApiApplication,
        {
          activate,
          applicationIdentifier,
        }: { applicationIdentifier: string; activate: boolean },
      ) => {
        // Invalidate applications list query
        queryClient.invalidateQueries({ queryKey: ["applications"] });

        // Invalidate individual application query to refresh the edit sheet
        queryClient.invalidateQueries({
          queryKey: ["application", applicationIdentifier],
        });

        // Optimistic update: update application in list cache
        queryClient.setQueryData<ApiApplication[]>(["applications"], (old) => {
          if (!old) return [updatedApplication];
          return old.map((app) =>
            app.applicationIdentifier ===
            updatedApplication.applicationIdentifier
              ? updatedApplication
              : app,
          );
        });

        // Update individual application cache
        queryClient.setQueryData<ApiApplication>(
          ["application", applicationIdentifier],
          updatedApplication,
        );

        toast.success(
          `Application ${activate ? "activated" : "deactivated"} successfully`,
        );
      },
      onError: (error, { activate }) => {
        const message =
          error instanceof Error
            ? error.message
            : `Failed to ${activate ? "activate" : "deactivate"} application`;
        toast.error(message);
      },
    },
  );
}
