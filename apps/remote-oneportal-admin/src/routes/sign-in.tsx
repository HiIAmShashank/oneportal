import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>One Portal Admin</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Authenticating... Please wait while we redirect you to the sign-in
            page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
