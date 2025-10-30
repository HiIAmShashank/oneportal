/**
 * Authenticated React Query Mutation Hook
 *
 * Eliminates token acquisition boilerplate by automatically:
 * - Acquiring access tokens via MSAL
 * - Handling authentication state
 * - Passing tokens to API functions
 * - Supporting all React Query mutation options
 *
 * @example Basic usage
 * ```typescript
 * export function useCreateUser() {
 *   return useAuthenticatedMutation(
 *     (token, data) => createUser(token, data)
 *   );
 * }
 * ```
 *
 * @example With callbacks
 * ```typescript
 * export function useUpdateUser() {
 *   const queryClient = useQueryClient();
 *   return useAuthenticatedMutation(
 *     (token, data) => updateUser(token, data),
 *     {
 *       onSuccess: () => {
 *         queryClient.invalidateQueries(['users']);
 *       }
 *     }
 *   );
 * }
 * ```
 */

import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useAuth } from "@one-portal/auth/hooks";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";

/**
 * React Query mutation hook that automatically handles token acquisition for authenticated API calls
 *
 * @template TData - The type of data returned by the mutation
 * @template TVariables - The type of variables passed to the mutation
 * @template TError - The type of error that can be thrown (defaults to Error)
 *
 * @param mutationFn - API function that takes an access token and variables, returns a Promise
 * @param options - Optional React Query mutation options (onSuccess, onError, etc.)
 *
 * @returns Standard React Query mutation result with mutate, mutateAsync, isPending, etc.
 *
 * @example
 * ```typescript
 * // Simple mutation
 * const { mutate, isPending } = useAuthenticatedMutation(
 *   (token, userId) => deleteUser(token, userId)
 * );
 * mutate(123);
 *
 * // With variables and callbacks
 * const { mutate } = useAuthenticatedMutation(
 *   (token, data) => createUser(token, data),
 *   {
 *     onSuccess: () => toast.success("User created!"),
 *     onError: (error) => toast.error(error.message)
 *   }
 * );
 * mutate({ email: "test@example.com", name: "Test" });
 * ```
 */
export function useAuthenticatedMutation<
  TData = unknown,
  TVariables = void,
  TError = Error,
>(
  mutationFn: (token: string, variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn">,
): UseMutationResult<TData, TError, TVariables> {
  const { state } = useAuth();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      // Ensure user is authenticated
      if (!state.isAuthenticated) {
        throw new Error("User is not authenticated") as TError;
      }

      // Get the account from MSAL instance
      const accounts = msalInstance.getAllAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error("No MSAL account found") as TError;
      }

      // Get configured scopes from environment
      const authConfig = getAuthConfig();

      // Acquire access token using MSAL
      const result = await acquireToken({
        msalInstance,
        account,
        scopes: authConfig.scopes,
      });

      // Call the mutation function with the token and variables
      return await mutationFn(result.accessToken, variables);
    },
    ...options,
  });
}
