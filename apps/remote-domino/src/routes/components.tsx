import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
} from "@one-portal/ui";
import { ExternalLink, Package } from "lucide-react";

export const Route = createFileRoute("/components")({
  component: ComponentsPage,
});

function ComponentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">UI Components</h1>
        <p className="text-muted-foreground text-lg">
          Using the shared component library across your apps
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Component Library Overview</CardTitle>
          <CardDescription>
            Understanding @one-portal/ui package
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            All UI components are centralized in the{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              @one-portal/ui
            </code>{" "}
            package. This ensures consistent design across all apps and makes it
            easy to update components in one place.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h3 className="font-semibold text-sm mb-2">
              Why Centralize Components?
            </h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>Consistency</strong> - Same look and feel everywhere
              </li>
              <li>
                <strong>Maintainability</strong> - Update once, apply everywhere
              </li>
              <li>
                <strong>Type Safety</strong> - Shared TypeScript types
              </li>
              <li>
                <strong>Reusability</strong> - No duplicate code
              </li>
              <li>
                <strong>Testing</strong> - Test components once in Storybook
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-semibold text-sm mb-2">Package Location</h3>
            <div className="font-mono text-xs space-y-1">
              <div>packages/ui/</div>
              <div className="ml-4">├── src/</div>
              <div className="ml-8 text-muted-foreground">
                │ ├── components/ui/ → shadcn/ui components
              </div>
              <div className="ml-8 text-muted-foreground">
                │ ├── data-table-v2/ → DataTable component
              </div>
              <div className="ml-8 text-muted-foreground">
                │ └── index.ts → Barrel exports
              </div>
              <div className="ml-4">└── package.json</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Using Components</CardTitle>
          <CardDescription>
            How to import and use shared components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">
              Import from @one-portal/ui
            </h3>
            <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-2">
              <div className="text-muted-foreground">
                // Import components you need
              </div>
              <div>
                import {"{ Button, Card, Input }"} from '@one-portal/ui';
              </div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">
                // Use them in your component
              </div>
              <div>function MyComponent() {"{"}</div>
              <div> return (</div>
              <div> {"<Card>"}</div>
              <div> {"<CardHeader>"}</div>
              <div>
                {" "}
                {"<CardTitle>"}Hello World{"</CardTitle>"}
              </div>
              <div> {"</CardHeader>"}</div>
              <div> {"<CardContent>"}</div>
              <div>
                {" "}
                {"<Button>"}Click Me{"</Button>"}
              </div>
              <div> {"</CardContent>"}</div>
              <div> {"</Card>"}</div>
              <div> );</div>
              <div>{"}"}</div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold mb-1">
              Example Component in Action
            </p>
            <div className="bg-background rounded-md p-3 mt-2">
              <Card className="max-w-sm">
                <CardHeader>
                  <CardTitle className="text-base">Sample Card</CardTitle>
                  <CardDescription className="text-xs">
                    This card is imported from @one-portal/ui
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm">
                    <Package className="w-3 h-3" />
                    Example Button
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Barrel Exports</CardTitle>
          <CardDescription>Simplified imports with index.ts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            The{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              packages/ui/src/index.ts
            </code>{" "}
            file acts as a <strong>barrel export</strong> - a single entry point
            that re-exports all components. This makes imports cleaner and more
            manageable.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-2 text-red-500">
                Without Barrel Exports
              </h4>
              <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1">
                <div>import {"{ Button }"}</div>
                <div className="ml-4">
                  from '@one-portal/ui/components/ui/button';
                </div>
                <div>import {"{ Card, CardHeader }"}</div>
                <div className="ml-4">
                  from '@one-portal/ui/components/ui/card';
                </div>
                <div>import {"{ Input }"}</div>
                <div className="ml-4">
                  from '@one-portal/ui/components/ui/input';
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2 text-green-500">
                With Barrel Exports
              </h4>
              <div className="bg-muted rounded-md p-3 font-mono text-xs">
                <div>import {"{"}</div>
                <div> Button,</div>
                <div> Card,</div>
                <div> CardHeader,</div>
                <div> Input</div>
                <div>{"}"} from '@one-portal/ui';</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-semibold text-sm mb-2">How it Works</h4>
            <p className="text-xs text-muted-foreground mb-2">
              The index.ts file re-exports everything from individual component
              files:
            </p>
            <div className="bg-background rounded-md p-3 font-mono text-xs space-y-1">
              <div className="text-muted-foreground">
                // packages/ui/src/index.ts
              </div>
              <div>export * from './components/ui/button';</div>
              <div>export * from './components/ui/card';</div>
              <div>export * from './components/ui/input';</div>
              <div>export * from './data-table-v2';</div>
              <div className="text-muted-foreground">// ... and so on</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installing New Components</CardTitle>
          <CardDescription>
            Adding shadcn/ui components to the library
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">Step-by-Step Process</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">
                    Navigate to UI package
                  </p>
                  <div className="bg-muted rounded-md p-2 font-mono text-xs mt-1">
                    cd packages/ui
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Run shadcn CLI</p>
                  <div className="bg-muted rounded-md p-2 font-mono text-xs mt-1">
                    pnpm dlx shadcn@latest add button
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Replace "button" with the component you want to install
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Export in index.ts</p>
                  <div className="bg-muted rounded-md p-2 font-mono text-xs mt-1">
                    export * from './components/ui/button';
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add this line to packages/ui/src/index.ts
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Build the package</p>
                  <div className="bg-muted rounded-md p-2 font-mono text-xs mt-1">
                    pnpm --filter @one-portal/ui build
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This compiles TypeScript and makes the component available
                    to apps
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  5
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">Use in your app</p>
                  <div className="bg-muted rounded-md p-2 font-mono text-xs mt-1">
                    import {"{ Button }"} from '@one-portal/ui';
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold mb-1">Pro Tip</p>
            <p className="text-xs text-muted-foreground">
              You can install multiple components at once:
            </p>
            <div className="bg-background rounded-md p-2 font-mono text-[10px] mt-1">
              pnpm dlx shadcn@latest add button card dialog input select
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Components</CardTitle>
          <CardDescription>
            Some commonly used components in the library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Button</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Card</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Input</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Select</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Dialog</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Dropdown</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Switch</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Checkbox</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Tabs</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Tooltip</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Badge</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Avatar</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Sidebar</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">DataTable</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="font-mono text-xs">Toast</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              For a complete list of components and interactive examples, visit{" "}
              <strong>Storybook</strong> by running:
            </p>
            <div className="bg-background rounded-md p-2 font-mono text-xs mt-2">
              pnpm storybook
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Component Documentation</CardTitle>
          <CardDescription>
            Where to find usage examples and API references
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">shadcn/ui Docs</h3>
              <a
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-xs"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Official documentation for all shadcn/ui components with examples,
              API references, and accessibility guidelines.
            </p>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Storybook</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                pnpm storybook
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              Local component documentation with interactive examples. Includes
              DataTable stories with various configurations.
            </p>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Radix UI Docs</h3>
              <a
                href="https://www.radix-ui.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-xs"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Low-level API documentation for Radix UI primitives that power
              shadcn/ui components.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-semibold mb-2">Next Steps</p>
        <p className="text-sm text-muted-foreground">
          Learn about the <strong>DataTable</strong> component - a powerful
          abstraction layer built on top of TanStack Table that simplifies
          complex table features.
        </p>
      </div>
    </div>
  );
}
