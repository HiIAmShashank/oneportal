import { fetchUser, type ApiUser } from "../api";
import { useAuthenticatedQuery } from "./useAuthenticatedQuery";

export function useUser() {
  return useAuthenticatedQuery<ApiUser>(
    ["user"],
    (token, username) => fetchUser(token, username),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );
}
