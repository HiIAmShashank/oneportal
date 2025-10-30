import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/routing")({
  component: RoutingPage,
});

function RoutingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Routing with TanStack Router
        </h1>
        <p className="text-muted-foreground text-lg">
          File-based routing with type-safe navigation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is TanStack Router?</CardTitle>
          <CardDescription>
            Modern routing for React applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            <strong>TanStack Router</strong> is a fully type-safe routing
            library that uses file-based routing. Instead of manually defining
            routes in a configuration file, your file structure automatically
            determines your application's routes.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h3 className="font-semibold text-sm mb-2">Key Benefits</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>File-based</strong> - Routes defined by folder structure
              </li>
              <li>
                <strong>Type-safe</strong> - Full TypeScript support with
                autocomplete
              </li>
              <li>
                <strong>Automatic code-splitting</strong> - Routes loaded on
                demand
              </li>
              <li>
                <strong>Route guards</strong> - Protect routes with
                authentication
              </li>
              <li>
                <strong>Nested layouts</strong> - Share UI between routes
              </li>
              <li>
                <strong>Search params</strong> - Type-safe query parameters
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Official Documentation</h4>
              <a
                href="https://tanstack.com/router"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-xs"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              For detailed API reference and advanced patterns, visit the
              official TanStack Router docs.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File-Based Routing</CardTitle>
          <CardDescription>How file structure maps to URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Each file in the{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              src/routes/
            </code>{" "}
            directory automatically becomes a route. The file name determines
            the URL path.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">File Structure</h4>
              <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1">
                <div>src/routes/</div>
                <div className="ml-4">├── __root.tsx</div>
                <div className="ml-4">├── index.tsx</div>
                <div className="ml-4">├── about.tsx</div>
                <div className="ml-4">├── users.tsx</div>
                <div className="ml-4">└── settings/</div>
                <div className="ml-8"> ├── index.tsx</div>
                <div className="ml-8"> └── profile.tsx</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Generated Routes</h4>
              <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1">
                <div className="text-muted-foreground">
                  Root layout (all pages)
                </div>
                <div className="text-primary">/</div>
                <div className="text-primary">/about</div>
                <div className="text-primary">/users</div>
                <div className="text-muted-foreground">Settings section</div>
                <div className="text-primary">/settings</div>
                <div className="text-primary">/settings/profile</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold mb-1">Special Files</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                •{" "}
                <code className="bg-background px-1.5 py-0.5 rounded">
                  __root.tsx
                </code>{" "}
                - Root layout for all routes
              </li>
              <li>
                •{" "}
                <code className="bg-background px-1.5 py-0.5 rounded">
                  index.tsx
                </code>{" "}
                - Default route for a directory (e.g., /)
              </li>
              <li>
                •{" "}
                <code className="bg-background px-1.5 py-0.5 rounded">
                  $param.tsx
                </code>{" "}
                - Dynamic route parameter (e.g., /users/$id)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creating a Route</CardTitle>
          <CardDescription>
            Step-by-step guide to adding new routes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">
                  Create a file in src/routes/
                </p>
                <div className="bg-muted rounded-md p-3 font-mono text-xs">
                  src/routes/my-page.tsx
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">Define the route</p>
                <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
                  <div>
                    import {"{ createFileRoute }"} from
                    '@tanstack/react-router';
                  </div>
                  <div>
                    <br />
                  </div>
                  <div>
                    export const Route = createFileRoute('/my-page')({"{"}
                  </div>
                  <div> component: MyPage,</div>
                  <div>{"}"});</div>
                  <div>
                    <br />
                  </div>
                  <div>function MyPage() {"{"}</div>
                  <div>
                    {" "}
                    return {"<div>"}My Page Content{"</div>"};
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">
                  Route is automatically available
                </p>
                <p className="text-xs text-muted-foreground">
                  Navigate to{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded">
                    /my-page
                  </code>{" "}
                  in your browser
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold mb-1">Important Note</p>
            <p className="text-xs text-muted-foreground">
              The route tree is auto-generated when you run{" "}
              <code className="bg-background px-1.5 py-0.5 rounded">
                pnpm dev
              </code>
              . You'll see a{" "}
              <code className="bg-background px-1.5 py-0.5 rounded">
                routeTree.gen.ts
              </code>{" "}
              file created automatically - do not edit this file manually.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
          <CardDescription>Moving between routes in your app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Using Link Component</h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>import {"{ Link }"} from '@tanstack/react-router';</div>
              <div>
                <br />
              </div>
              <div>
                {'<Link to="/about">'}About Us{"</Link>"}
              </div>
              <div>
                {"<Link to=\"/users/$userId\" params={{ userId: '123' }}>"}User
                123{"</Link>"}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Type-safe links with autocomplete for route paths and parameters.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">
              Programmatic Navigation
            </h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>
                import {"{ useNavigate }"} from '@tanstack/react-router';
              </div>
              <div>
                <br />
              </div>
              <div>const navigate = useNavigate();</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">
                // Navigate to a route
              </div>
              <div>navigate({"{ to: '/about' }"});</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">
                // Navigate with parameters
              </div>
              <div>
                navigate({"{ to: '/users/$userId', params: { userId: '123' } }"}
                );
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Guards</CardTitle>
          <CardDescription>
            Protecting routes with authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            OnePortal uses route guards to protect routes that require
            authentication. All routes in remote apps are protected by default
            via the root route.
          </p>

          <div>
            <h3 className="font-semibold text-sm mb-2">Root Route Guard</h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div className="text-muted-foreground">
                // src/routes/__root.tsx
              </div>
              <div>export const Route = createRootRoute({"{"}</div>
              <div> beforeLoad: createRouteGuard({"{"}</div>
              <div> msalInstance,</div>
              <div> getAuthConfig,</div>
              <div> isEmbedded: () ={">"} detectEmbeddedMode(),</div>
              <div> {"}"}),</div>
              <div> component: RootComponent,</div>
              <div>{"}"});</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This ensures all child routes are protected. Unauthenticated users
              are redirected to sign-in.
            </p>
          </div>

          <div className="rounded-lg border p-3">
            <h4 className="font-semibold text-sm mb-1">
              How Route Guards Work
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1. User navigates to a protected route</li>
              <li>2. Route guard checks authentication state</li>
              <li>3. If authenticated, allow access</li>
              <li>4. If not authenticated, redirect to sign-in</li>
              <li>5. After sign-in, redirect back to original route</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nested Routes & Layouts</CardTitle>
          <CardDescription>Sharing UI between routes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            The root route (
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              __root.tsx
            </code>
            ) defines a layout that wraps all child routes. This is perfect for
            sidebars, headers, and other persistent UI elements.
          </p>

          <div>
            <h3 className="font-semibold text-sm mb-2">Root Layout Example</h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>function RootComponent() {"{"}</div>
              <div> return (</div>
              <div> {"<AppLayout>"}</div>
              <div>
                {" "}
                {"<Outlet />"} {"{/* Child routes render here */}"}
              </div>
              <div> {"</AppLayout>"}</div>
              <div> );</div>
              <div>{"}"}</div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs font-semibold mb-1">Current App Structure</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Root route provides AppLayout with sidebar</li>
              <li>• All routes automatically get the sidebar navigation</li>
              <li>• User profile and sign-out button in sidebar footer</li>
              <li>• Consistent layout across all pages</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dynamic Routes</CardTitle>
          <CardDescription>Routes with parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Create dynamic routes by using{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">$</code>{" "}
            prefix in the filename.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">File Name</h4>
              <div className="bg-muted rounded-md p-3 font-mono text-xs">
                src/routes/users/$userId.tsx
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Matches URLs</h4>
              <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1">
                <div className="text-primary">/users/123</div>
                <div className="text-primary">/users/abc</div>
                <div className="text-primary">/users/user-456</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Accessing Parameters</h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div className="text-muted-foreground">
                // src/routes/users/$userId.tsx
              </div>
              <div>
                import {"{ createFileRoute }"} from '@tanstack/react-router';
              </div>
              <div>
                <br />
              </div>
              <div>
                export const Route = createFileRoute('/users/$userId')({"{"}
              </div>
              <div> component: UserDetail,</div>
              <div>{"}"});</div>
              <div>
                <br />
              </div>
              <div>function UserDetail() {"{"}</div>
              <div> const {"{ userId }"} = Route.useParams();</div>
              <div>
                {" "}
                return {"<div>"}User ID: {"{userId}"}
                {"</div>"};
              </div>
              <div>{"}"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Params</CardTitle>
          <CardDescription>Type-safe query parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            TanStack Router provides type-safe search parameters with
            validation.
          </p>

          <div>
            <h3 className="font-semibold text-sm mb-2">
              Defining Search Params
            </h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>import {"{ z }"} from 'zod';</div>
              <div>
                <br />
              </div>
              <div>const searchSchema = z.object({"{"}</div>
              <div> page: z.number().default(1),</div>
              <div> search: z.string().optional(),</div>
              <div>{"}"});</div>
              <div>
                <br />
              </div>
              <div>export const Route = createFileRoute('/users')({"{"}</div>
              <div> validateSearch: searchSchema,</div>
              <div> component: Users,</div>
              <div>{"}"});</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Using Search Params</h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>const {"{ page, search }"} = Route.useSearch();</div>
              <div>const navigate = useNavigate();</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">
                // Update search params
              </div>
              <div>navigate({"{ search: { page: 2, search: 'john' } }"});</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Tree Generation</CardTitle>
          <CardDescription>Auto-generated route configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            TanStack Router automatically generates a{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              routeTree.gen.ts
            </code>{" "}
            file based on your file structure. This file is generated during
            development and build.
          </p>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold mb-1">Important</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • <strong>Never edit</strong> routeTree.gen.ts manually
              </li>
              <li>
                • Add to{" "}
                <code className="bg-background px-1.5 py-0.5 rounded">
                  .gitignore
                </code>{" "}
                if needed
              </li>
              <li>• File regenerates on dev server start</li>
              <li>• Provides full TypeScript types for routes</li>
            </ul>
          </div>

          <div className="bg-muted rounded-md p-3">
            <p className="text-xs font-semibold mb-2">
              Generation happens when:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                • Running{" "}
                <code className="bg-background px-1.5 py-0.5 rounded">
                  pnpm dev
                </code>
              </li>
              <li>
                • Running{" "}
                <code className="bg-background px-1.5 py-0.5 rounded">
                  pnpm build
                </code>
              </li>
              <li>• Adding/removing route files</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-semibold mb-2">Quick Reference</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Create routes by adding files to{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              src/routes/
            </code>
          </li>
          <li>
            • Use{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              __root.tsx
            </code>{" "}
            for shared layouts
          </li>
          <li>
            • Use{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              $param
            </code>{" "}
            for dynamic segments
          </li>
          <li>• Route guards protect all routes via root beforeLoad</li>
          <li>• Full TypeScript support with autocomplete</li>
        </ul>
      </div>
    </div>
  );
}
