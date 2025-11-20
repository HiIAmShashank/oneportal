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
      <Card>
        <CardHeader>
          <CardTitle>Project Directory</CardTitle>
          <CardDescription>
            An application to view consolidated project directory data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This is a protected route. You must be authenticated to view this
            content.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Start building your features in this component. Use components
                from @one-portal/ui for consistent styling.
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Available Tools</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>shadcn/ui components from @one-portal/ui</li>
                <li>Tailwind CSS for styling (with dark mode support)</li>
                <li>TypeScript for type safety</li>
                <li>TanStack Router for routing</li>
                <li>TanStack Query for data fetching (auth-aware)</li>
                <li>MSAL for authentication with SSO</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Authentication Features</h3>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>All routes protected by default</li>
                <li>Silent SSO from Shell application</li>
                <li>Toast error notifications</li>
                <li>Screen reader announcements</li>
                <li>Automatic redirect to sign-in</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
