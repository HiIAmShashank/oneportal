import { useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedMutation } from "../../../hooks/useAuthenticatedMutation";
import { createApplication } from "../../../api/client";
import type {
  CreateApplicationRequest,
  CreateApplicationResponse,
  ApiApplication,
} from "../../../api/types";
import { toast } from "@one-portal/ui";

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useAuthenticatedMutation(
    (token, { data }: { data: CreateApplicationRequest }) =>
      createApplication(token, data),
    {
      onSuccess: (newApplication: CreateApplicationResponse) => {
        // Invalidate applications query
        queryClient.invalidateQueries({ queryKey: ["applications"] });

        // Optimistic update: add new application to cache
        queryClient.setQueryData<ApiApplication[]>(["applications"], (old) => {
          if (!old) return [newApplication];
          return [...old, newApplication];
        });

        toast.success("Application created successfully");
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to create application";
        toast.error(message);
      },
    },
  );
}
