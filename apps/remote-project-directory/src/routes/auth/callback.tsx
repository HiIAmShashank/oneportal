import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Parse return URL from query params
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get("returnUrl") || "/";

    // Redirect after a brief delay to show the loading message
    const timer = setTimeout(() => {
      navigate({ to: returnUrl });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Successful</CardTitle>
          <CardDescription>
            Redirecting you back to the application...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please wait while we complete the authentication process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
