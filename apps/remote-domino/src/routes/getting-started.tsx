import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";

export const Route = createFileRoute("/getting-started")({
  component: GettingStartedPage,
});

function GettingStartedPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Getting Started</h1>
        <p className="text-muted-foreground text-lg">
          Set up your development environment and create your first route
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
          <CardDescription>
            What you need before starting development
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-semibold text-sm">Node.js</p>
                <p className="text-sm text-muted-foreground">
                  Version 18 or higher recommended
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-semibold text-sm">pnpm</p>
                <p className="text-sm text-muted-foreground">
                  Package manager (version 10.19.0 or higher)
                </p>
                <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                  npm install -g pnpm
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-semibold text-sm">Git</p>
                <p className="text-sm text-muted-foreground">
                  For version control
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Get the project running in 3 steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">
                1. Clone the repository
              </h3>
              <div className="bg-muted rounded-md p-3 font-mono text-xs">
                git clone &lt;repository-url&gt;
                <br />
                cd one-portal
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2">
                2. Install dependencies
              </h3>
              <div className="bg-muted rounded-md p-3 font-mono text-xs">
                pnpm install
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                This will install dependencies for all apps and packages in the
                monorepo
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-sm mb-2">
                3. Start development server
              </h3>
              <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
                <div># Start all apps</div>
                <div>pnpm dev</div>
                <div className="mt-3"># Or start a specific app</div>
                <div>pnpm --filter @one-portal/shell dev</div>
                <div>pnpm --filter @one-portal/remote-domino dev</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold mb-1">Development URLs</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>
                • Shell: <code>http://localhost:5000</code>
              </li>
              <li>
                • Remote apps (standalone): <code>http://localhost:5173</code>
              </li>
              <li>
                • Storybook: <code>http://localhost:6006</code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Structure</CardTitle>
          <CardDescription>Understanding the monorepo layout</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-1">
            <div>one-portal/</div>
            <div className="ml-4">├── apps/</div>
            <div className="ml-8 text-muted-foreground">
              │ ├── shell/ # Main host application
            </div>
            <div className="ml-8 text-muted-foreground">
              │ ├── remote-domino/ # This documentation app
            </div>
            <div className="ml-8 text-muted-foreground">
              │ └── storybook/ # Component documentation
            </div>
            <div className="ml-4">├── packages/</div>
            <div className="ml-8 text-muted-foreground">
              │ ├── ui/ # Shared UI components
            </div>
            <div className="ml-8 text-muted-foreground">
              │ ├── auth/ # Authentication utilities
            </div>
            <div className="ml-8 text-muted-foreground">
              │ ├── config/ # Shared configuration
            </div>
            <div className="ml-8 text-muted-foreground">
              │ └── types/ # TypeScript types
            </div>
            <div className="ml-4">├── turbo.json</div>
            <div className="ml-4">├── package.json</div>
            <div className="ml-4">└── pnpm-workspace.yaml</div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm">
              <strong>apps/</strong> - Contains all applications (shell + remote
              apps)
            </p>
            <p className="text-sm">
              <strong>packages/</strong> - Shared code used by multiple apps
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Creating Your First Route</CardTitle>
          <CardDescription>Add a new page to your remote app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm mb-3">
              Routes are created using file-based routing with TanStack Router.
              Each file in the{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                src/routes/
              </code>{" "}
              directory automatically becomes a route.
            </p>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Example: Create a new route
                </h4>
                <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-3">
                  <div className="text-muted-foreground">
                    // src/routes/my-page.tsx
                  </div>
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
                  <div> return {"<div>Hello World</div>"};</div>
                  <div>{"}"}</div>
                </div>
              </div>

              <div className="rounded-lg border p-3 text-xs">
                <p className="font-semibold mb-1">
                  The route is now available at:
                </p>
                <code className="text-primary">/my-page</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Useful Commands</CardTitle>
          <CardDescription>Common commands for development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <code className="text-xs font-mono text-primary">
                  pnpm build
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Build all apps and packages
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <code className="text-xs font-mono text-primary">
                  pnpm test
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Run all tests
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <code className="text-xs font-mono text-primary">
                  pnpm lint
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Check code quality
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <code className="text-xs font-mono text-primary">
                  pnpm typecheck
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Check TypeScript types
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <code className="text-xs font-mono text-primary">
                  pnpm storybook
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  View component library
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <code className="text-xs font-mono text-primary">
                  turbo clean
                </code>
                <p className="text-xs text-muted-foreground mt-1">
                  Clear build cache
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-semibold mb-2">Next Steps</p>
        <p className="text-sm text-muted-foreground">
          Explore the sidebar to learn about the repository structure, tech
          stack, and how to use shared components.
        </p>
      </div>
    </div>
  );
}
