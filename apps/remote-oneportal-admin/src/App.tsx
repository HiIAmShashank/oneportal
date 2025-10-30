import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@one-portal/config";
import { isAuthError } from "@one-portal/auth/utils";
import { routeTree } from "./routeTree.gen";

// Create QueryClient with auth-aware retry logic
const queryClient = createQueryClient({ shouldSkipRetry: isAuthError });

// Create router instance
const router = createRouter({
  routeTree,
  context: {},
  // Handle both embedded mode (/apps/oneportal-admin) and standalone mode (/)
  basepath: window.location.pathname.startsWith("/apps/")
    ? "/apps/oneportal-admin"
    : undefined,
  defaultPreload: false,
});

// Register router type for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
