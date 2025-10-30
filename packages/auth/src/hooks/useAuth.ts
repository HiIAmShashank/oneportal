import { useState, useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import type { AuthState, UseAuthReturn, UserProfile, AuthError } from "../types/auth";
import { acquireToken } from "../utils/acquireToken";

/**
 * Enhanced authentication hook that abstracts MSAL dependency from apps.
 *
 * Provides a clean, type-safe API for authentication operations without
 * requiring apps to directly import from @azure/msal-react.
 *
 * This hook implements the UseAuthReturn interface and can be used as a
 * drop-in replacement for the context-based useAuth.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     state: { isAuthenticated, account },
 *     login,
 *     logout,
 *   } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <button onClick={login}>Sign In</button>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Welcome, {account?.name}!</p>
 *       {hasRole('admin') && <AdminPanel />}
 *       <button onClick={logout}>Sign Out</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Acquiring tokens for API calls
 * async function callApi() {
 *   const { acquireToken } = useAuth();
 *
 *   try {
 *     const token = await acquireToken(['User.Read']);
 *     if (!token) throw new Error('Failed to acquire token');
 *
 *     const response = await fetch('/api/data', {
 *       headers: { Authorization: `Bearer ${token}` }
 *     });
 *     return response.json();
 *   } catch (error) {
 *     console.error('API call failed:', error);
 *   }
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const { instance, accounts, inProgress } = useMsal();
  const [error, setError] = useState<AuthError | null>(null);

  // Current account
  const account = accounts[0] ?? null;

  // Build user profile from account claims
  const userProfile: UserProfile | null = account
    ? {
      id: account.homeAccountId,
      email: account.username,
      name: account.name ?? account.username,
      tenantId: account.tenantId,
    }
    : null;

  // Auth state
  const state: AuthState = {
    isInitialized: true, // MSAL handles initialization
    isAuthenticated: accounts.length > 0,
    isLoading: inProgress !== InteractionStatus.None,
    account,
    userProfile,
    error,
  };

  /**
   * Sign in the user with interactive login redirect.
   *
   * The user will be redirected to Azure AD for authentication,
   * then returned to the application.
   *
   * @param scopes - REQUIRED array of OAuth scopes to request during login.
   *                 Must pass getAuthConfig().scopes from your app's auth configuration.
   *
   * @example
   * ```tsx
   * // Login with app-configured scopes (REQUIRED)
   * await login(getAuthConfig().scopes);
   *
   * // Login with custom scopes
   * await login(['openid', 'profile', 'User.Read']);
   * ```
   */
  const login = useCallback(
    async (scopes: string[]): Promise<void> => {
      if (!scopes || scopes.length === 0) {
        const error: AuthError = {
          code: 'INVALID_SCOPES',
          message: "[useAuth] login() requires scopes parameter. " +
            "Pass getAuthConfig().scopes from your app's auth configuration.",
          isActionable: true,
          retryAction: 'login',
          timestamp: new Date(),
        };
        console.error(error.message);
        setError(error);
        throw new Error(error.message);
      }

      try {
        setError(null);
        await instance.loginRedirect({
          scopes,
          prompt: "select_account",
        });
      } catch (err) {
        console.error("[useAuth] Login failed:", err);
        const authError: AuthError = {
          code: (err as { errorCode?: string }).errorCode ?? 'LOGIN_FAILED',
          message: err instanceof Error ? err.message : String(err),
          isActionable: true,
          retryAction: 'login',
          timestamp: new Date(),
        };
        setError(authError);
        throw err;
      }
    },
    [instance],
  );

  /**
   * Sign out the user and clear session.
   *
   * The user will be redirected to Azure AD to clear their session,
   * then returned to the application.
   *
   * @param postLogoutRedirectUri - Optional redirect URI after logout (defaults to window.location.origin)
   *
   * @example
   * ```tsx
   * // Basic logout
   * await logout();
   *
   * // Logout with custom redirect
   * await logout('/sign-in?signed-out=true');
   * ```
   */
  const logout = useCallback(
    async (postLogoutRedirectUri?: string): Promise<void> => {
      try {
        setError(null);
        await instance.logoutRedirect({
          account: account ?? undefined,
          postLogoutRedirectUri:
            postLogoutRedirectUri ?? window.location.origin,
        });
      } catch (err) {
        console.error("[useAuth] Logout failed:", err);
        const authError: AuthError = {
          code: (err as { errorCode?: string }).errorCode ?? 'LOGOUT_FAILED',
          message: err instanceof Error ? err.message : String(err),
          isActionable: false,
          timestamp: new Date(),
        };
        setError(authError);
        throw err;
      }
    },
    [instance, account],
  );

  /**
   * Acquire an access token for the specified scopes.
   *
   * Attempts silent token acquisition first, falls back to interactive if needed.
   *
   * @param scopes - OAuth scopes to request
   * @returns Access token string or null if acquisition fails
   *
   * @example
   * ```tsx
   * // Acquire token for Microsoft Graph
   * const token = await acquireToken(['User.Read']);
   *
   * // Use token in API call
   * if (token) {
   *   const response = await fetch('https://graph.microsoft.com/v1.0/me', {
   *     headers: { Authorization: `Bearer ${token}` }
   *   });
   * }
   * ```
   */
  const acquireTokenSilent = useCallback(
    async (scopes: string[]): Promise<string | null> => {
      if (!account) {
        console.error("[useAuth] No account available for token acquisition");
        return null;
      }

      try {
        setError(null);
        const result = await acquireToken({
          msalInstance: instance,
          account,
          scopes,
        });
        return result.accessToken;
      } catch (err) {
        console.error("[useAuth] Token acquisition failed:", err);
        const authError: AuthError = {
          code: (err as { errorCode?: string }).errorCode ?? 'TOKEN_ACQUISITION_FAILED',
          message: err instanceof Error ? err.message : String(err),
          isActionable: true,
          retryAction: 'refresh',
          timestamp: new Date(),
        };
        setError(authError);
        return null;
      }
    },
    [instance, account],
  );


  /**
   * Clear the current authentication error.
   *
   * Useful for dismissing error messages or resetting error state.
   *
   * @example
   * ```tsx
   * // Clear error after user dismisses error message
   * <ErrorMessage error={state.error} onDismiss={clearError} />
   * ```
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    state,
    login,
    logout,
    acquireToken: acquireTokenSilent,
    clearError,
  };
}
