import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/tech-stack")({
  component: TechStackPage,
});

function TechStackPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Technology Stack</h1>
        <p className="text-muted-foreground text-lg">
          Modern tools and frameworks powering OnePortal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Technologies</CardTitle>
          <CardDescription>The foundation of the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">React 19</h3>
                <a
                  href="https://react.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern UI library with hooks, concurrent features, and improved
                performance. All apps use React 19 with TypeScript.
              </p>
              <div className="bg-muted rounded px-2 py-1 text-xs font-mono inline-block">
                react@^19.2.0
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Vite</h3>
                <a
                  href="https://vitejs.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Fast build tool with hot module replacement (HMR) and optimized
                production builds. Powers both development and production
                builds.
              </p>
              <div className="bg-muted rounded px-2 py-1 text-xs font-mono inline-block">
                vite@^6.0.7
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">TypeScript</h3>
                <a
                  href="https://www.typescriptlang.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Type-safe JavaScript with strict mode enabled. Catches errors at
                compile time and provides excellent IDE support.
              </p>
              <div className="bg-muted rounded px-2 py-1 text-xs font-mono inline-block">
                typescript@^5.7.3
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Module Federation</h3>
                <a
                  href="https://github.com/originjs/vite-plugin-federation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Enables micro-frontend architecture. The shell dynamically loads
                remote apps at runtime without rebuilding.
              </p>
              <div className="bg-muted rounded px-2 py-1 text-xs font-mono inline-block">
                @originjs/vite-plugin-federation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Routing & State Management</CardTitle>
          <CardDescription>Navigation and data handling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">TanStack Router</h3>
                <a
                  href="https://tanstack.com/router"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Type-safe file-based routing with automatic route generation.
                Each file in
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">
                  src/routes/
                </code>
                becomes a route automatically.
              </p>
              <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1 mt-2">
                <div className="text-muted-foreground">
                  // File-based routing
                </div>
                <div>src/routes/index.tsx → /</div>
                <div>src/routes/settings.tsx → /settings</div>
                <div>src/routes/users.tsx → /users</div>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">TanStack Query</h3>
                <a
                  href="https://tanstack.com/query"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Powerful data fetching and caching library. Handles loading
                states, error handling, and automatic refetching. Integrated
                with authentication for auth-aware retry logic.
              </p>
              <div className="bg-muted rounded px-2 py-1 text-xs font-mono inline-block mt-2">
                @tanstack/react-query@^5.64.2
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Zustand</h3>
                <a
                  href="https://zustand.docs.pmnd.rs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Lightweight state management used in the shell application.
                Simple API with React hooks integration.
              </p>
              <div className="bg-muted rounded px-2 py-1 text-xs font-mono inline-block mt-2">
                zustand@^5.0.2
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UI & Styling</CardTitle>
          <CardDescription>Design system and component library</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Tailwind CSS v4</h3>
                <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Utility-first CSS framework compiled centrally in
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">
                  packages/ui
                </code>
                . Supports dark mode via CSS variables and custom theme system.
              </p>
              <div className="rounded-lg bg-muted p-3 mt-2">
                <p className="text-xs font-semibold mb-1">Key Features</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>• Centralized CSS compilation (no duplication)</li>
                  <li>• Class-based dark mode toggle</li>
                  <li>• Custom theme variables in theme.css</li>
                  <li>• @source directive for monorepo scanning</li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">shadcn/ui</h3>
                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Beautiful, accessible components built with Radix UI and
                Tailwind CSS. All components live in
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs mx-1">
                  packages/ui
                </code>
                and can be used across all apps.
              </p>
              <div className="bg-muted rounded-md p-3 font-mono text-xs mt-2">
                <div className="text-muted-foreground">
                  // Install new components
                </div>
                <div>cd packages/ui</div>
                <div>pnpm dlx shadcn@latest add button card</div>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Radix UI</h3>
                <a
                  href="https://www.radix-ui.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Unstyled, accessible UI primitives. Powers shadcn/ui components
                with proper ARIA attributes, keyboard navigation, and focus
                management.
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Lucide React</h3>
                <a
                  href="https://lucide.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Beautiful, consistent icon library with 1,000+ icons. Shared as
                singleton via Module Federation to reduce bundle size.
              </p>
              <div className="bg-muted rounded-md p-3 font-mono text-xs mt-2">
                <div>import {"{ Home, Settings }"} from 'lucide-react';</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            Azure AD integration with Single Sign-On
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">MSAL Browser</h3>
              <a
                href="https://learn.microsoft.com/en-us/entra/msal/javascript/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-xs"
              >
                Docs <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Microsoft Authentication Library for browser-based apps. Handles
              OAuth 2.0 flow with Azure Active Directory.
            </p>
            <div className="rounded-lg bg-muted p-3 mt-3">
              <p className="text-xs font-semibold mb-1">Authentication Flow</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>1. Shell handles OAuth redirect flow (host mode)</li>
                <li>2. Remote apps perform silent SSO (remote mode)</li>
                <li>3. Shared authentication state via BroadcastChannel</li>
                <li>4. Automatic token refresh and error handling</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All authentication logic is centralized in
              <code className="bg-background px-1.5 py-0.5 rounded mx-1">
                @one-portal/auth
              </code>
              package.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Build & Deploy</CardTitle>
          <CardDescription>Monorepo management and deployment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Turborepo</h3>
                <a
                  href="https://turbo.build/repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                High-performance build system for monorepos. Provides
                intelligent caching, parallel execution, and task orchestration.
              </p>
              <div className="rounded-lg bg-muted p-3 mt-2">
                <p className="text-xs font-semibold mb-1">Features</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  <li>• Remote caching for CI/CD</li>
                  <li>• Incremental builds</li>
                  <li>• Task pipeline with dependencies</li>
                  <li>• Code generators for scaffolding</li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">pnpm</h3>
                <a
                  href="https://pnpm.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Fast, disk space efficient package manager with built-in
                workspace support. All dependencies are symlinked from a single
                store.
              </p>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Azure Static Web Apps</h3>
                <a
                  href="https://learn.microsoft.com/en-us/azure/static-web-apps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Deployment target for OnePortal. Provides CDN, SSL certificates,
                and global distribution. Shell and remote apps are combined into
                a single deployment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Development Tools</CardTitle>
          <CardDescription>Code quality and testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="font-semibold text-sm">ESLint</h4>
              <p className="text-xs text-muted-foreground">
                Linting with shared config in @one-portal/config
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="font-semibold text-sm">Prettier</h4>
              <p className="text-xs text-muted-foreground">
                Code formatting with pre-commit hooks
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="font-semibold text-sm">Vitest</h4>
              <p className="text-xs text-muted-foreground">
                Fast unit testing with Jest-compatible API
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="font-semibold text-sm">Knip</h4>
              <p className="text-xs text-muted-foreground">
                Dead code detection and unused dependency finder
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="font-semibold text-sm">Storybook</h4>
              <p className="text-xs text-muted-foreground">
                Component documentation and visual testing
              </p>
            </div>

            <div className="rounded-lg border p-3 space-y-1">
              <h4 className="font-semibold text-sm">Husky</h4>
              <p className="text-xs text-muted-foreground">
                Git hooks for pre-commit linting and formatting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-semibold mb-2">Version Information</p>
        <p className="text-sm text-muted-foreground">
          All version numbers can be found in each package's{" "}
          <code className="bg-background px-1.5 py-0.5 rounded text-xs">
            package.json
          </code>
          . The root{" "}
          <code className="bg-background px-1.5 py-0.5 rounded text-xs">
            package.json
          </code>{" "}
          defines workspace protocol versions like{" "}
          <code className="bg-background px-1.5 py-0.5 rounded text-xs">
            workspace:*
          </code>{" "}
          for internal dependencies.
        </p>
      </div>
    </div>
  );
}
