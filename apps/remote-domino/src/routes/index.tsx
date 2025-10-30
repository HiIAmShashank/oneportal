import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to OnePortal</h1>
        <p className="text-muted-foreground text-lg">
          A centralized platform for accessing applications at Mott MacDonald
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is OnePortal?</CardTitle>
          <CardDescription>
            Understanding the micro-frontend architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            OnePortal is a <strong>micro-frontend platform</strong> that allows
            multiple teams to build and deploy independent applications that
            work together seamlessly. Think of it as a central hub where users
            can access all their tools in one place.
          </p>

          <div className="rounded-lg bg-muted p-4">
            <h3 className="font-semibold mb-2 text-sm">How it Works</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                <span>
                  The <strong>Shell</strong> application loads first (the main
                  container)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                <span>
                  <strong>Remote apps</strong> (like this one) are loaded
                  dynamically when needed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                <span>
                  Users authenticate once and access all apps with{" "}
                  <strong>Single Sign-On</strong>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">4.</span>
                <span>
                  Each remote app can be developed and deployed{" "}
                  <strong>independently</strong>
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <h3 className="font-semibold mb-2 text-sm">Why Use OnePortal?</h3>
            <ul className="text-sm space-y-1">
              <li>
                <strong>Single access point</strong> - No need to remember
                multiple URLs
              </li>
              <li>
                <strong>Shared authentication</strong> - Sign in once, access
                everything
              </li>
              <li>
                <strong>Consistent UI</strong> - Same look and feel across all
                apps
              </li>
              <li>
                <strong>Independent deployment</strong> - Update your app
                without affecting others
              </li>
              <li>
                <strong>Shared components</strong> - Reuse UI components across
                apps
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Overview</CardTitle>
          <CardDescription>
            Key technologies used in this platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">React 19</h4>
              <p className="text-xs text-muted-foreground">
                Modern UI framework
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Module Federation</h4>
              <p className="text-xs text-muted-foreground">
                Load apps dynamically
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">TanStack Router</h4>
              <p className="text-xs text-muted-foreground">
                File-based routing
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Tailwind CSS v4</h4>
              <p className="text-xs text-muted-foreground">
                Utility-first styling
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Azure AD (MSAL)</h4>
              <p className="text-xs text-muted-foreground">
                Authentication & SSO
              </p>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-semibold text-sm mb-1">Turborepo</h4>
              <p className="text-xs text-muted-foreground">
                Monorepo management
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm text-muted-foreground">
          Use the sidebar navigation to explore different topics and learn how
          to build your own micro-frontend application in OnePortal.
        </p>
      </div>
    </div>
  );
}
