import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";

export const Route = createFileRoute("/repository")({
  component: RepositoryPage,
});

function RepositoryPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Repository Structure</h1>
        <p className="text-muted-foreground text-lg">
          Understanding the monorepo organization and where to find things
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monorepo Overview</CardTitle>
          <CardDescription>
            A single repository containing multiple apps and shared packages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            OnePortal uses a <strong>monorepo</strong> structure managed by{" "}
            <strong>Turborepo</strong> and <strong>pnpm workspaces</strong>.
            This means all code lives in one repository, making it easy to share
            code and coordinate changes.
          </p>

          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-semibold text-sm mb-2">Benefits of Monorepo</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Share code easily between apps</li>
              <li>Make changes across multiple apps at once</li>
              <li>Consistent tooling and configuration</li>
              <li>Better dependency management</li>
              <li>Faster CI/CD with intelligent caching</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top-Level Structure</CardTitle>
          <CardDescription>Main directories in the repository</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-1">
              <div className="font-bold">one-portal/</div>
              <div className="ml-4 text-primary">
                ├── apps/{" "}
                <span className="text-muted-foreground">
                  → All applications
                </span>
              </div>
              <div className="ml-4 text-primary">
                ├── packages/{" "}
                <span className="text-muted-foreground">
                  → Shared code libraries
                </span>
              </div>
              <div className="ml-4">
                ├── scripts/{" "}
                <span className="text-muted-foreground">
                  → Build and deployment scripts
                </span>
              </div>
              <div className="ml-4">
                ├── specs/{" "}
                <span className="text-muted-foreground">
                  → Architecture documentation
                </span>
              </div>
              <div className="ml-4">
                ├── turbo/{" "}
                <span className="text-muted-foreground">
                  → Turborepo generators
                </span>
              </div>
              <div className="ml-4">
                ├── turbo.json{" "}
                <span className="text-muted-foreground">
                  → Turborepo configuration
                </span>
              </div>
              <div className="ml-4">
                ├── package.json{" "}
                <span className="text-muted-foreground">
                  → Root package file
                </span>
              </div>
              <div className="ml-4">└── pnpm-workspace.yaml</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-1 text-primary">
                  apps/
                </h4>
                <p className="text-xs text-muted-foreground">
                  Contains the shell application and all remote micro-frontends
                </p>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-1 text-primary">
                  packages/
                </h4>
                <p className="text-xs text-muted-foreground">
                  Shared libraries used across multiple applications
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>apps/ Directory</CardTitle>
          <CardDescription>
            Applications that users interact with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-1">
            <div className="font-bold">apps/</div>
            <div className="ml-4 text-primary">├── shell/</div>
            <div className="ml-8 text-muted-foreground">│ ├── src/</div>
            <div className="ml-12">
              │ │ ├── routes/{" "}
              <span className="text-muted-foreground">→ Shell routes</span>
            </div>
            <div className="ml-12">
              │ │ ├── services/{" "}
              <span className="text-muted-foreground">
                → Module Federation loader
              </span>
            </div>
            <div className="ml-12">
              │ │ └── main.tsx{" "}
              <span className="text-muted-foreground">→ Entry point</span>
            </div>
            <div className="ml-8 text-muted-foreground">
              │ └── vite.config.ts{" "}
              <span className="text-muted-foreground">
                → Defines remote apps
              </span>
            </div>
            <div className="ml-4 text-primary">├── remote-domino/</div>
            <div className="ml-8 text-muted-foreground">│ ├── src/</div>
            <div className="ml-12">
              │ │ ├── routes/{" "}
              <span className="text-muted-foreground">→ App routes</span>
            </div>
            <div className="ml-12">
              │ │ ├── bootstrap.tsx{" "}
              <span className="text-muted-foreground">
                → Module Federation mount/unmount
              </span>
            </div>
            <div className="ml-12">
              │ │ └── main.tsx{" "}
              <span className="text-muted-foreground">→ Standalone entry</span>
            </div>
            <div className="ml-8 text-muted-foreground">
              │ └── vite.config.ts{" "}
              <span className="text-muted-foreground">→ Exposes bootstrap</span>
            </div>
            <div className="ml-4">└── storybook/</div>
            <div className="ml-8 text-muted-foreground">
              └── src/stories/{" "}
              <span className="text-muted-foreground">
                → Component examples
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <h4 className="font-semibold text-sm mb-1">shell/</h4>
              <p className="text-xs text-muted-foreground">
                The <strong>host application</strong> that loads and displays
                remote apps. Handles authentication, navigation, and dynamic
                loading of micro-frontends.
              </p>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <h4 className="font-semibold text-sm mb-1">remote-domino/</h4>
              <p className="text-xs text-muted-foreground">
                A <strong>remote application</strong> (this app). Can run
                standalone for development or be loaded into the shell. Each
                remote app is independent and can be deployed separately.
              </p>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
              <h4 className="font-semibold text-sm mb-1">storybook/</h4>
              <p className="text-xs text-muted-foreground">
                Component documentation and examples. Not deployed to production
                - development only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>packages/ Directory</CardTitle>
          <CardDescription>
            Shared code libraries used across apps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-1">
            <div className="font-bold">packages/</div>
            <div className="ml-4 text-primary">├── ui/</div>
            <div className="ml-8 text-muted-foreground">│ ├── src/</div>
            <div className="ml-12">
              │ │ ├── components/{" "}
              <span className="text-muted-foreground">
                → shadcn/ui components
              </span>
            </div>
            <div className="ml-12">
              │ │ ├── data-table-v2/{" "}
              <span className="text-muted-foreground">
                → DataTable component
              </span>
            </div>
            <div className="ml-12">
              │ │ ├── index.css{" "}
              <span className="text-muted-foreground">
                → Tailwind CSS entry
              </span>
            </div>
            <div className="ml-12">
              │ │ └── theme.css{" "}
              <span className="text-muted-foreground">→ CSS variables</span>
            </div>
            <div className="ml-8 text-muted-foreground">
              │ └── dist/styles.css{" "}
              <span className="text-muted-foreground">→ Compiled CSS</span>
            </div>
            <div className="ml-4 text-primary">├── auth/</div>
            <div className="ml-8 text-muted-foreground">│ └── src/</div>
            <div className="ml-12">
              │ ├── components/{" "}
              <span className="text-muted-foreground">→ Auth providers</span>
            </div>
            <div className="ml-12">
              │ └── utils/{" "}
              <span className="text-muted-foreground">→ MSAL helpers</span>
            </div>
            <div className="ml-4 text-primary">├── config/</div>
            <div className="ml-8 text-muted-foreground">│ └── src/</div>
            <div className="ml-12">
              │ ├── eslint/{" "}
              <span className="text-muted-foreground">
                → Shared ESLint config
              </span>
            </div>
            <div className="ml-12">
              │ └── query-client.ts{" "}
              <span className="text-muted-foreground">
                → TanStack Query setup
              </span>
            </div>
            <div className="ml-4 text-primary">└── types/</div>
            <div className="ml-8 text-muted-foreground">└── src/</div>
            <div className="ml-12">
              {" "}
              └── index.ts{" "}
              <span className="text-muted-foreground">
                → Shared TypeScript types
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1 text-primary">
                @one-portal/ui
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Shared UI component library built with shadcn/ui and Tailwind
                CSS. Exports both React components and compiled CSS.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded inline-block">
                import {"{ Button, Card }"} from '@one-portal/ui';
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1 text-primary">
                @one-portal/auth
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Authentication utilities for Azure AD (MSAL) with SSO support.
                Provides providers for both host and remote apps.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded inline-block">
                import {"{ UnifiedAuthProvider }"} from '@one-portal/auth';
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1 text-primary">
                @one-portal/config
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Shared configuration including ESLint rules and TanStack Query
                client factory.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded inline-block">
                import {"{ createQueryClient }"} from '@one-portal/config';
              </code>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1 text-primary">
                @one-portal/types
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                Shared TypeScript types and Zod validators used across apps.
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded inline-block">
                import type {"{ ShellConfig }"} from '@one-portal/types';
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Configuration Files</CardTitle>
          <CardDescription>
            Important files you should know about
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <code className="text-xs font-mono text-primary">turbo.json</code>
              <p className="text-xs text-muted-foreground mt-1">
                Defines build pipeline, task dependencies, and caching strategy
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <code className="text-xs font-mono text-primary">
                pnpm-workspace.yaml
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Tells pnpm which directories contain workspace packages
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <code className="text-xs font-mono text-primary">
                apps/*/vite.config.ts
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Module Federation configuration for each app
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <code className="text-xs font-mono text-primary">
                packages/ui/src/index.css
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Central Tailwind CSS configuration with @source directive
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <code className="text-xs font-mono text-primary">
                scripts/combine-builds.js
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Prepares production deployment by combining shell and remote
                builds
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-semibold mb-2">Quick Tips</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Use{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              pnpm --filter
            </code>{" "}
            to run commands in specific packages
          </li>
          <li>
            • Shared code goes in{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              packages/
            </code>
            , apps go in{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              apps/
            </code>
          </li>
          <li>
            • Each package has its own{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              package.json
            </code>{" "}
            and{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              tsconfig.json
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}
