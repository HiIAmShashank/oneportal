import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { ThemeProvider } from "../components/ThemeProvider";
import {
  createProtectedRouteGuard,
  isPublicRoute,
} from "@one-portal/auth/guards";
import { msalInstance, getAuthConfig } from "../auth/msalInstance";
import { PUBLIC_ROUTES } from "../config/routes";
import { queryClient } from "../config/queryClient";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { fetchApplications } from "../api/client";

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    // Skip auth and prefetch for public routes
    if (isPublicRoute(location.pathname, PUBLIC_ROUTES)) {
      return;
    }

    // Ensure user is authenticated
    const guard = createProtectedRouteGuard(msalInstance, {
      scopes: getAuthConfig().scopes,
    });
    await guard({ location });

    // Prefetch applications data after authentication (non-blocking)
    // Data fetches in background and caches for command palette and routes
    queryClient
      .prefetchQuery({
        queryKey: ["applications"],
        queryFn: () => fetchWithAuth(fetchApplications),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      })
      .catch((error) => {
        // Log error but don't block navigation
        console.error("[Shell] Failed to prefetch applications:", error);
      });
  },

  component: () => {
    return (
      <ThemeProvider defaultTheme="system" storageKey="one-portal-ui-theme">
        <div className="flex min-h-screen flex-col bg-background text-foreground dark:bg-background-dark dark:text-foreground-dark">
          <Header />
          <main className="flex-1 grow min-h-[calc(100vh-70px)]">
            {/* This is where child routes will render */}
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    );
  },
});
