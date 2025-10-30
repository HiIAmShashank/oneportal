/**
 * Fetch data with automatic token acquisition
 *
 * This utility can be used in both React context (via hooks) and outside React (route loaders).
 * It handles token acquisition using MSAL and passes it to the provided API function.
 *
 * @example Route loader (outside React)
 * ```typescript
 * await queryClient.prefetchQuery({
 *   queryKey: ["applications"],
 *   queryFn: () => fetchWithAuth(fetchApplications)
 * });
 * ```
 *
 * @example Direct usage
 * ```typescript
 * const apps = await fetchWithAuth(fetchApplications);
 * ```
 *
 * @param apiFn - API function that takes an access token and returns a Promise
 * @returns Promise with the API response
 * @throws Error if no authenticated account is found
 */

import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";

export async function fetchWithAuth<TData>(
  apiFn: (token: string) => Promise<TData>,
): Promise<TData> {
  const accounts = msalInstance.getAllAccounts();
  const account = accounts[0];

  if (!account) {
    throw new Error("No authenticated account found");
  }

  const authConfig = getAuthConfig();
  const result = await acquireToken({
    msalInstance,
    account,
    scopes: authConfig.scopes,
  });

  return await apiFn(result.accessToken);
}
