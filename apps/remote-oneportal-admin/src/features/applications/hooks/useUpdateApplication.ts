import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { updateApplication } from "../../../api/client";
import type {
  UpdateApplicationRequest,
  UpdateApplicationResponse,
  ApiApplication,
} from "../../../api/types";
import { toast } from "@one-portal/ui";

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (
      token,
      {
        applicationIdentifier,
        data,
      }: { applicationIdentifier: string; data: UpdateApplicationRequest },
    ) => updateApplication(token, applicationIdentifier, data),
    {
      onSuccess: (updatedApplication: UpdateApplicationResponse) => {
        // Invalidate applications query
        queryClient.invalidateQueries({ queryKey: ["applications"] });

        // Optimistic update: replace application in cache
        queryClient.setQueryData<ApiApplication[]>(["applications"], (old) => {
          if (!old) return [updatedApplication];
          return old.map((app) =>
            app.applicationIdentifier ===
            updatedApplication.applicationIdentifier
              ? updatedApplication
              : app,
          );
        });

        toast.success("Application updated successfully");
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to update application";
        toast.error(message);
      },
    },
  );
}
