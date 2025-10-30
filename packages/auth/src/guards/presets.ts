import type { PublicClientApplication } from "@azure/msal-browser";
import {
  createRouteGuard,
  type MsalRouteGuardConfig,
} from "../utils/routeGuard";
import { AuthErrorHandler } from "../errors/AuthErrorHandler";
import { safeRedirect } from "../utils";

/**
 * Options for configuring route guard presets.
 */
export interface RouteGuardOptions {
  /**
   * OAuth scopes to request during authentication.
   * REQUIRED: Must pass getAuthConfig().scopes from your app's auth configuration.
   *
   * @example
   * ```typescript
   * import { getAuthConfig } from '../auth/msalInstance';
   *
   * createProtectedRouteGuard(msalInstance, {
   *   scopes: getAuthConfig().scopes
   * });
   * ```
   */
  scopes: string[];

  /**
   * Custom handler for unauthenticated users.
   * If not provided, redirects to `/sign-in?returnUrl=...`
   *
   * @param returnUrl - The URL the user was trying to access
   */
  onUnauthenticated?: (returnUrl: string) => void;

  /**
   * Custom handler for authentication errors.
   * If not provided, uses AuthErrorHandler to show toast notification.
   *
   * @param error - The error that occurred
   */
  onAuthError?: (error: Error) => void;

  /**
   * Skip redirect during route preloading.
   * Set to true for lazy-loaded routes to prevent redirects during preload phase.
   *
   * @default false
   */
  skipRedirectOnPreload?: boolean;

  /**
   * Custom sign-in route path.
   * @default '/sign-in'
   */
  signInRoute?: string;
}

/**
 * Create a route guard for protected routes with standard configuration.
 *
 * @param msalInstance - The MSAL instance to use for authentication
 * @param options - REQUIRED configuration including scopes
 *
 * @example
 * ```tsx
 * // Basic usage - Host app (Shell)
 * import { getAuthConfig } from '../auth/msalInstance';
 *
 * export const Route = createRootRoute({
 *   beforeLoad: createProtectedRouteGuard(msalInstance, {
 *     scopes: getAuthConfig().scopes
 *   }),
 *   component: RootLayout,
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Lazy-loaded remote app
 * import { getAuthConfig } from '../auth/msalInstance';
 *
 * export const Route = createRootRoute({
 *   beforeLoad: createProtectedRouteGuard(msalInstance, {
 *     scopes: getAuthConfig().scopes,
 *     skipRedirectOnPreload: true,
 *   }),
 *   component: RootLayout,
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Custom configuration with additional options
 * import { getAuthConfig } from '../auth/msalInstance';
 *
 * export const Route = createRootRoute({
 *   beforeLoad: createProtectedRouteGuard(msalInstance, {
 *     scopes: getAuthConfig().scopes,
 *     onUnauthenticated: (returnUrl) => {
 *       window.location.href = `/custom-login?return=${returnUrl}`;
 *     },
 *   }),
 *   component: RootLayout,
 * });
 * ```
 */
export function createProtectedRouteGuard(
  msalInstance: PublicClientApplication,
  options: RouteGuardOptions,
) {
  const {
    scopes,
    signInRoute = "/sign-in",
    onUnauthenticated,
    onAuthError,
    skipRedirectOnPreload = false,
  } = options;

  // Validate that scopes are provided
  if (!scopes || scopes.length === 0) {
    throw new Error(
      "[createProtectedRouteGuard] scopes are required in options. " +
        "Pass { scopes: getAuthConfig().scopes } from your app's auth configuration.",
    );
  }

  const config: MsalRouteGuardConfig = {
    msalInstance,
    scopes,
    onUnauthenticated:
      onUnauthenticated ??
      ((returnUrl: string) => {
        // Default: redirect to sign-in with return URL
        const signInUrl = `${signInRoute}?returnUrl=${encodeURIComponent(returnUrl)}`;
        safeRedirect(signInUrl, signInRoute);
      }),
    onAuthError:
      onAuthError ??
      ((error: Error) => {
        // Default: show error toast via AuthErrorHandler
        console.error("[RouteGuard] Authentication error:", error);
        AuthErrorHandler.show(error);
      }),
  };

  const guard = createRouteGuard(config);

  // If skipRedirectOnPreload is enabled, wrap the guard to check preload context
  if (skipRedirectOnPreload) {
    return async ({
      location,
      preload,
    }: {
      location: { href: string };
      preload?: boolean;
    }) => {
      // Don't run guard during route preload (lazy-loaded routes)
      if (preload) {
        return;
      }
      return guard({ location });
    };
  }

  return guard;
}

/**
 * Create a route guard for OAuth callback routes.
 *
 * Handles the OAuth redirect from Azure AD after user authentication.
 * Extracts the code/token from the URL and completes the authentication flow.
 *
 * @param msalInstance - The MSAL instance to use for handling the callback
 *
 * @example
 * ```tsx
 * // OAuth callback page
 * export const Route = createFileRoute('/auth/callback')({
 *   beforeLoad: createCallbackRouteGuard(msalInstance),
 *   component: CallbackPage,
 * });
 * ```
 */
export function createCallbackRouteGuard(
  msalInstance: PublicClientApplication,
) {
  return async () => {
    try {
      // Handle redirect promise to complete authentication
      await msalInstance.handleRedirectPromise();
    } catch (error) {
      console.error("[RouteGuard] OAuth callback failed:", error);
      AuthErrorHandler.show(error);
      // Don't throw - let the callback page handle the error state
    }
  };
}

/**
 * Utility to check if a route is public based on path.
 *
 * @param pathname - The route pathname to check
 * @param publicRoutes - Array of public route paths (default: ['/sign-in', '/auth/callback'])
 * @returns true if the route is public
 *
 * @example
 * ```tsx
 * export const Route = createRootRoute({
 *   beforeLoad: async ({ location }) => {
 *     if (isPublicRoute(location.pathname)) {
 *       return; // Skip authentication
 *     }
 *     return createProtectedRouteGuard(msalInstance)({ location });
 *   },
 * });
 * ```
 */
export function isPublicRoute(
  pathname: string,
  publicRoutes: readonly string[] = ["/sign-in", "/auth/callback"],
): boolean {
  return publicRoutes.includes(pathname);
}
