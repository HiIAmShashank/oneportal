import { useQuery } from "@tanstack/react-query";
import { fetchOptionSets } from "../api/client";
import { useAuth } from "@one-portal/auth/hooks";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";

export function useOptionSets() {
  const { state } = useAuth();
  const { isAuthenticated } = state;

  return useQuery({
    queryKey: ["optionSets"],
    queryFn: async () => {
      const accounts = msalInstance.getAllAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error("No MSAL account found");
      }

      const authConfig = getAuthConfig();

      const result = await acquireToken({
        msalInstance,
        account,
        scopes: authConfig.scopes,
      });

      const username = result.account.username;

      return fetchOptionSets(result.accessToken, username);
    },
    enabled: isAuthenticated,
    staleTime: Infinity, // Data is very static
    gcTime: Infinity, // Keep in cache as long as possible
  });
}
