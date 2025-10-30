import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { createProtectedRouteGuard } from "@one-portal/auth/guards";
import { safeRedirect } from "@one-portal/auth/utils";
import { acquireToken } from "@one-portal/auth/utils/acquireToken";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";
import { AppLayout } from "../components/AppLayout";
import { PUBLIC_ROUTES } from "../config/routes";
import { checkSuperUser } from "../api";

export const Route = createRootRoute({
  beforeLoad: async ({ location, preload }) => {
    if ((PUBLIC_ROUTES as readonly string[]).includes(location.pathname)) {
      return;
    }
    // First, ensure user is authenticated
    const guard = createProtectedRouteGuard(msalInstance, {
      scopes: getAuthConfig().scopes,
      skipRedirectOnPreload: true,
      onUnauthenticated: (returnUrl: string) => {
        const signInUrl = `/sign-in?returnUrl=${encodeURIComponent(returnUrl)}`;
        safeRedirect(signInUrl, "/sign-in");
      },
      onAuthError: (error: Error) => {
        console.error("[One Portal Admin] Route guard auth error:", error);
      },
    });
    await guard({ location, preload });

    // Then check if user is a superuser (skip during preload to avoid blocking)
    if (!preload) {
      try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const authConfig = getAuthConfig();
          const tokenResult = await acquireToken({
            msalInstance,
            account: accounts[0]!,
            scopes: authConfig.scopes,
          });

          const isSuperUser = await checkSuperUser(tokenResult.accessToken);

          if (!isSuperUser) {
            throw redirect({ to: "/unauthorized" });
          }
        }
      } catch (error) {
        // If it's already a redirect, re-throw it
        if (error && typeof error === "object" && "to" in error) {
          throw error;
        }
        console.error("[One Portal Admin] SuperUser check failed:", error);
        throw redirect({ to: "/unauthorized" });
      }
    }
  },
  component: () => {
    const { pathname } = window.location;
    const isPublicRoute = (PUBLIC_ROUTES as readonly string[]).includes(
      pathname,
    );

    if (isPublicRoute) {
      return <Outlet />;
    }

    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  },
});
