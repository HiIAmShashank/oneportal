import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@one-portal/config';
import { isAuthError } from '@one-portal/auth/utils';
import { routeTree } from './routeTree.gen';

const queryClient = createQueryClient({ shouldSkipRetry: isAuthError });

const router = createRouter({
  routeTree,
  context: {},
  basepath: window.location.pathname.startsWith('/apps/') ? '/apps/domino' : undefined,
  defaultPreload: false,
});

declare module '@tanstack/react-router' {
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
