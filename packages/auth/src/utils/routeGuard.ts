import type { PublicClientApplication } from "@azure/msal-browser";

export interface MsalRouteGuardConfig {
  msalInstance: PublicClientApplication;
  scopes: string[];
  redirectUri?: string;
  onUnauthenticated?: (returnUrl: string) => void;
  onAuthError?: (error: Error) => void;
}

export function isAuthenticated(
  msalInstance: PublicClientApplication,
): boolean {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0;
}

/**
 * IMPORTANT: Does NOT call ssoSilent() to avoid iframe errors when no user is signed in.
 */
export function createRouteGuard(config: MsalRouteGuardConfig) {
  return async ({ location }: { location: { href: string } }) => {
    const { msalInstance, onUnauthenticated, onAuthError } = config;

    try {
      if (!isAuthenticated(msalInstance)) {
        if (onUnauthenticated) {
          onUnauthenticated(location.href);
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (onAuthError) {
        onAuthError(err);
      } else {
        console.error("[RouteGuard] Auth check failed:", err);
      }
    }
  };
}

/**
 * Check if error is interaction_required error from MSAL
 */
export function isInteractionRequired(error: unknown): boolean {
  if (error && typeof error === "object" && "errorCode" in error) {
    const errorCode = (error as { errorCode: string }).errorCode;
    return (
      errorCode === "interaction_required" ||
      errorCode === "login_required" ||
      errorCode === "consent_required"
    );
  }
  return false;
}
