import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthLoadingSpinner } from "@one-portal/ui";
import { setReturnUrl } from "@one-portal/auth/utils";

/**
 * Sign-in route for Domino remote app
 *
 * This route serves as the entry point for authentication flow:
 * - Reads returnUrl from query params and stores it in localStorage
 * - UnifiedAuthProvider/MsalInitializer triggers OAuth redirect to Azure AD
 * - Azure AD redirects back to /auth/callback (configured in .env)
 * - /auth/callback reads returnUrl from localStorage and redirects user
 *
 * Flow:
 * 1. Route guard redirects to /sign-in?returnUrl=...
 * 2. This component stores returnUrl in localStorage
 * 3. MsalInitializer.initializeRemoteStandalone() triggers loginRedirect()
 * 4. Azure AD redirects to /auth/callback
 * 5. Callback route retrieves returnUrl and redirects user
 */
export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
  beforeLoad: () => {
    // This is a public route - no authentication required
  },
});

function SignInPage() {
  useEffect(() => {
    // Store returnUrl from query params for later retrieval after OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const returnUrl = params.get("returnUrl");

    if (returnUrl && import.meta.env.DEV) {
      console.info(
        "[Domino] Storing returnUrl for post-auth redirect:",
        returnUrl,
      );
      setReturnUrl(returnUrl);
    } else if (returnUrl) {
      setReturnUrl(returnUrl);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <AuthLoadingSpinner
        title="Signing you in..."
        description="Please wait while we authenticate your session."
      />
    </div>
  );
}
