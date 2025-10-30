import { useAuthenticatedQuery } from "../../../hooks/useAuthenticatedQuery";
import { fetchApplications } from "../../../api/client";
import type { ApiApplication } from "../../../api/types";

export function useApplications() {
  return useAuthenticatedQuery<ApiApplication[]>(
    ["applications"],
    fetchApplications,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  );
}
