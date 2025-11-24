import { createFileRoute } from "@tanstack/react-router";
import { AuthLoadingSpinner } from "@one-portal/ui";

/**
 * OAuth callback route for Azure AD authentication
 *
 * This route receives the OAuth redirect from Azure AD after user signs in.
 * The actual authentication processing and redirect is handled by:
 * - UnifiedAuthProvider initializes MsalInitializer
 * - MsalInitializer.initializeRemoteStandalone() calls handleRedirectPromise()
 * - After auth succeeds, MsalInitializer reads returnUrl and redirects user
 *
 * This component just needs to exist and show a loading state while that happens.
 */
export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackComponent,
});

function AuthCallbackComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AuthLoadingSpinner
        title="Completing sign-in..."
        description="Please wait while we complete your authentication."
      />
    </div>
  );
}
