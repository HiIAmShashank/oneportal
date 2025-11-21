import { useAuth } from "@one-portal/auth/hooks";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";

export function useAuthenticatedQuery<TData = unknown, TError = unknown>(
  queryKey: string[],
  queryFn: (token: string, username: string) => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
): UseQueryResult<TData, TError> {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  // Allow users to override enabled, but default to isAuthenticated
  const enabled =
    options?.enabled !== undefined ? options.enabled : isAuthenticated;

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Get the account from MSAL instance
      const accounts = msalInstance.getAllAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error("No MSAL account found") as TError;
      }

      const authConfig = getAuthConfig();

      // Acquire access token using MSAL
      const result = await acquireToken({
        msalInstance,
        account,
        scopes: authConfig.scopes,
      });

      // Extract username from the account info
      const username = result.account.username;

      return queryFn(result.accessToken, username);
    },
    enabled,
    ...options,
  });
}
