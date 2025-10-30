import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/styling")({
  component: StylingPage,
});

function StylingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tailwind CSS Styling</h1>
        <p className="text-muted-foreground text-lg">
          Centralized styling system with Tailwind CSS v4
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centralized CSS Architecture</CardTitle>
          <CardDescription>
            Understanding the OnePortal styling approach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            OnePortal uses a <strong>centralized CSS system</strong> to
            eliminate duplication and ensure consistency. All Tailwind CSS is
            compiled once in the{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              @one-portal/ui
            </code>{" "}
            package, and apps simply import the compiled stylesheet.
          </p>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
            <h3 className="font-semibold text-sm mb-2">Why Centralize CSS?</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <strong>No duplication</strong> - CSS compiled once, used
                everywhere
              </li>
              <li>
                <strong>Smaller bundles</strong> - Remote apps don't duplicate
                Tailwind
              </li>
              <li>
                <strong>Consistent theming</strong> - Single source of truth for
                design tokens
              </li>
              <li>
                <strong>Faster builds</strong> - Apps don't need to compile CSS
                individually
              </li>
              <li>
                <strong>Easy updates</strong> - Change theme in one place, apply
                everywhere
              </li>
            </ul>
          </div>

          <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-1">
            <div className="font-bold">CSS Compilation Flow</div>
            <div className="ml-4 text-primary">
              1. packages/ui/src/index.css → Tailwind source
            </div>
            <div className="ml-4 text-primary">
              2. Vite plugin compiles → CSS utilities
            </div>
            <div className="ml-4 text-primary">
              3. packages/ui/dist/styles.css → Compiled output
            </div>
            <div className="ml-4 text-muted-foreground">
              4. Apps import → import '@one-portal/ui/styles.css'
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tailwind CSS v4</CardTitle>
          <CardDescription>What's new in version 4</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            OnePortal uses <strong>Tailwind CSS v4</strong>, which introduces
            significant improvements over v3 including a new CSS-first
            configuration approach.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Key Changes</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Native CSS configuration</li>
                <li>• @import instead of config files</li>
                <li>• CSS variables for theming</li>
                <li>• Faster compilation</li>
                <li>• Better dark mode support</li>
              </ul>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Breaking Changes</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  •{" "}
                  <code className="bg-background px-1 py-0.5 rounded">
                    rounded
                  </code>{" "}
                  →{" "}
                  <code className="bg-background px-1 py-0.5 rounded">
                    rounded-sm
                  </code>
                </li>
                <li>
                  •{" "}
                  <code className="bg-background px-1 py-0.5 rounded">
                    shadow-sm
                  </code>{" "}
                  →{" "}
                  <code className="bg-background px-1 py-0.5 rounded">
                    shadow-xs
                  </code>
                </li>
                <li>• No tailwind.config.js needed</li>
                <li>• Different plugin system</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-sm">Official Documentation</h4>
              <a
                href="https://tailwindcss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1 text-xs"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              For detailed information about v4 features and migration, visit
              the official Tailwind CSS docs.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CSS File Structure</CardTitle>
          <CardDescription>Where CSS lives in the monorepo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-md p-4 font-mono text-xs space-y-1">
            <div className="font-bold">packages/ui/src/</div>
            <div className="ml-4 text-primary">├── index.css</div>
            <div className="ml-8 text-muted-foreground">
              │ @import "tailwindcss" source("../../..");
            </div>
            <div className="ml-8 text-muted-foreground">
              │ @source directives for monorepo
            </div>
            <div className="ml-8 text-muted-foreground">
              │ @custom-variant for dark mode
            </div>
            <div className="ml-4 text-primary">├── theme.css</div>
            <div className="ml-8 text-muted-foreground">
              │ CSS variables (light/dark)
            </div>
            <div className="ml-8 text-muted-foreground">│ Color palette</div>
            <div className="ml-8 text-muted-foreground">
              │ Shadow definitions
            </div>
            <div className="ml-8 text-muted-foreground">
              │ Border radius, spacing
            </div>
            <div className="ml-4 text-primary">└── vite.config.ts</div>
            <div className="ml-8 text-muted-foreground">
              Tailwind Vite plugin configuration
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1 text-primary">
                index.css
              </h4>
              <p className="text-xs text-muted-foreground">
                Main Tailwind entry point. Uses @source directive to scan the
                entire monorepo for Tailwind classes, and @custom-variant for
                dark mode support.
              </p>
            </div>

            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1 text-primary">
                theme.css
              </h4>
              <p className="text-xs text-muted-foreground">
                Contains all design tokens as CSS variables. Includes separate
                values for light and dark modes using .dark class selector.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Using Tailwind in Your App</CardTitle>
          <CardDescription>
            How remote apps consume the compiled CSS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">
              Shell Application (Host)
            </h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div className="text-muted-foreground">
                // apps/shell/src/main.tsx
              </div>
              <div>
                import '@one-portal/ui/styles.css';{" "}
                <span className="text-muted-foreground">
                  // Always imported
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              The shell unconditionally imports CSS since it's the host
              application.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Remote Applications</h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div className="text-muted-foreground">
                // apps/remote-*/src/main.tsx
              </div>
              <div>
                if (import.meta.env.DEV || import.meta.env.MODE === 'preview'){" "}
                {"{"}
              </div>
              <div> await import('@one-portal/ui/styles.css');</div>
              <div>{"}"}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Remote apps conditionally import CSS only for standalone
              development. In production, they inherit CSS from the shell (no
              duplication).
            </p>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-xs font-semibold mb-1">Important</p>
            <p className="text-xs text-muted-foreground">
              Remote apps DO NOT need their own{" "}
              <code className="bg-background px-1.5 py-0.5 rounded">
                tailwind.config.ts
              </code>
              . All Tailwind configuration happens in the UI package.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme System</CardTitle>
          <CardDescription>CSS variables and dark mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            OnePortal uses CSS variables for theming, defined in{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              packages/ui/src/theme.css
            </code>
            . This enables dynamic theme switching and dark mode support.
          </p>

          <div>
            <h3 className="font-semibold text-sm mb-2">
              Theme Variables Example
            </h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>:root {"{"}</div>
              <div> --background: oklch(1.0000 0 0);</div>
              <div> --foreground: oklch(0 0 0);</div>
              <div> --primary: oklch(0.5915 0.2366 289.6654);</div>
              <div> --border: oklch(0.9401 0 0);</div>
              <div> {"/* ... more variables */"}</div>
              <div>{"}"}</div>
              <div>
                <br />
              </div>
              <div>.dark {"{"}</div>
              <div> --background: oklch(0.2537 0.0135 253.07);</div>
              <div> --foreground: oklch(1.0000 0 0);</div>
              <div> {"/* Dark mode values */"}</div>
              <div>{"}"}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 bg-background">
              <h4 className="font-semibold text-sm mb-2">Color Variables</h4>
              <ul className="text-xs space-y-1 font-mono">
                <li>--background</li>
                <li>--foreground</li>
                <li>--primary</li>
                <li>--secondary</li>
                <li>--muted</li>
                <li>--accent</li>
                <li>--destructive</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4 bg-background">
              <h4 className="font-semibold text-sm mb-2">Other Variables</h4>
              <ul className="text-xs space-y-1 font-mono">
                <li>--radius (border radius)</li>
                <li>--shadow-* (shadows)</li>
                <li>--font-* (typography)</li>
                <li>--spacing (spacing units)</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2 mt-4">
              Using Theme Variables in Tailwind
            </h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>{'<div className="bg-background text-foreground">'}</div>
              <div>
                {'<div className="bg-primary text-primary-foreground">'}
              </div>
              <div>{'<div className="border border-border rounded-lg">'}</div>
              <div>{'<div className="shadow-sm">'}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Tailwind utilities automatically use CSS variables. Colors adapt
              to light/dark mode.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dark Mode</CardTitle>
          <CardDescription>Class-based theme switching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Dark mode is controlled by adding/removing the{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              .dark
            </code>{" "}
            class on the document root. This triggers CSS variable overrides
            defined in theme.css.
          </p>

          <div>
            <h3 className="font-semibold text-sm mb-2">
              How to Toggle Dark Mode
            </h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div className="text-muted-foreground">// Enable dark mode</div>
              <div>document.documentElement.classList.add('dark');</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">// Disable dark mode</div>
              <div>document.documentElement.classList.remove('dark');</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">// Toggle</div>
              <div>document.documentElement.classList.toggle('dark');</div>
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <h4 className="font-semibold text-sm mb-1">Dark Mode Utilities</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Tailwind provides{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded">dark:</code>{" "}
              variant for conditional styling:
            </p>
            <div className="bg-muted rounded-md p-2 font-mono text-xs">
              {'<div className="bg-white dark:bg-gray-900">'}
              <br />
              {'<div className="text-gray-900 dark:text-white">'}
            </div>
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-semibold mb-1">Current Implementation</p>
            <p className="text-xs text-muted-foreground">
              OnePortal uses the shell's theme toggle to control dark mode
              across all apps. The theme preference is synced via localStorage.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Utility Classes</CardTitle>
          <CardDescription>
            Most frequently used Tailwind utilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-2">Layout</h4>
                <div className="font-mono text-xs space-y-1 text-muted-foreground">
                  <div>flex, inline-flex</div>
                  <div>grid, grid-cols-*</div>
                  <div>gap-*, space-*</div>
                  <div>p-*, m-*, px-*, py-*</div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-2">Typography</h4>
                <div className="font-mono text-xs space-y-1 text-muted-foreground">
                  <div>text-sm, text-base, text-lg</div>
                  <div>font-bold, font-semibold</div>
                  <div>text-foreground, text-muted-foreground</div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-2">Colors</h4>
                <div className="font-mono text-xs space-y-1 text-muted-foreground">
                  <div>bg-background, bg-primary</div>
                  <div>text-foreground, text-primary</div>
                  <div>border-border</div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-2">Effects</h4>
                <div className="font-mono text-xs space-y-1 text-muted-foreground">
                  <div>shadow-xs, shadow-sm, shadow-md</div>
                  <div>rounded-sm, rounded-md, rounded-lg</div>
                  <div>opacity-*, hover:opacity-*</div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-2">Responsive</h4>
                <div className="font-mono text-xs space-y-1 text-muted-foreground">
                  <div>sm:*, md:*, lg:*, xl:*</div>
                  <div>hidden sm:block</div>
                  <div>grid-cols-1 md:grid-cols-2</div>
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <h4 className="font-semibold text-sm mb-2">States</h4>
                <div className="font-mono text-xs space-y-1 text-muted-foreground">
                  <div>hover:*, focus:*, active:*</div>
                  <div>disabled:*, dark:*</div>
                  <div>group-hover:*</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Styles</CardTitle>
          <CardDescription>
            When you need more than utility classes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-2">
              Inline Styles with Arbitrary Values
            </h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>{'<div className="w-[137px] h-[calc(100%-2rem)]">'}</div>
              <div>{'<div className="bg-[#1a1a1a] text-[14px]">'}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use square brackets for one-off custom values.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">
              CSS Modules (Not Recommended)
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              While possible, CSS modules are discouraged. Prefer Tailwind
              utilities or extend the theme in packages/ui instead.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Extending the Theme</h3>
            <p className="text-xs text-muted-foreground mb-2">
              To add custom utilities or theme values, modify:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                •{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  packages/ui/src/theme.css
                </code>{" "}
                - Add CSS variables
              </li>
              <li>
                •{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded">
                  packages/ui/src/index.css
                </code>{" "}
                - Add custom @layer utilities
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utility Helper: cn()</CardTitle>
          <CardDescription>
            Merging and conditionally applying classes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            The{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">cn()</code>{" "}
            utility (from clsx + tailwind-merge) helps merge Tailwind classes
            and conditionally apply them.
          </p>

          <div>
            <h3 className="font-semibold text-sm mb-2">Basic Usage</h3>
            <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-2">
              <div>import {"{ cn }"} from '@one-portal/ui/lib/utils';</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">// Merge classes</div>
              <div>cn('px-4 py-2', 'bg-primary text-white')</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">
                // Conditional classes
              </div>
              <div>cn('base-class', isActive && 'active-class')</div>
              <div>
                <br />
              </div>
              <div className="text-muted-foreground">// Override conflicts</div>
              <div>cn('p-4', 'p-6') {`// Result: 'p-6'`}</div>
            </div>
          </div>

          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-semibold mb-1">Why use cn()?</p>
            <p className="text-xs text-muted-foreground">
              Automatically resolves Tailwind class conflicts. If you apply both{" "}
              <code className="bg-background px-1.5 py-0.5 rounded">p-4</code>{" "}
              and{" "}
              <code className="bg-background px-1.5 py-0.5 rounded">p-6</code>,
              only the last one applies.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-semibold mb-2">Quick Tips</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>
            • Use theme variables (
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              bg-primary
            </code>
            ) instead of hardcoded colors
          </li>
          <li>• Prefer Tailwind utilities over custom CSS</li>
          <li>
            • Use{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              cn()
            </code>{" "}
            for conditional classes
          </li>
          <li>• Remote apps inherit CSS from shell in production</li>
          <li>
            • Check{" "}
            <code className="bg-background px-1.5 py-0.5 rounded text-xs">
              packages/ui/src/theme.css
            </code>{" "}
            for available variables
          </li>
        </ul>
      </div>
    </div>
  );
}
