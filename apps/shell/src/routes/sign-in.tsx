import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useAuth } from "@one-portal/auth/hooks";
import { useEffect, useRef, useState } from "react";
import { toast } from "@one-portal/ui";
import { Card, CardContent } from "@one-portal/ui";
import { setReturnUrl } from "@one-portal/auth/utils";
import { getAuthConfig } from "../auth/msalInstance";

export const Route = createFileRoute("/sign-in")({
  component: SignInComponent,
  validateSearch: (
    search: Record<string, unknown>,
  ): { returnUrl?: string; "signed-out"?: string } => {
    const result: { returnUrl?: string; "signed-out"?: string } = {};
    if (typeof search.returnUrl === "string") {
      result.returnUrl = search.returnUrl;
    }
    if (typeof search["signed-out"] === "string") {
      result["signed-out"] = search["signed-out"];
    }
    return result;
  },
});

function SignInComponent() {
  const { state, login } = useAuth();
  const { isAuthenticated } = state;
  const navigate = useNavigate();
  const search = useSearch({ from: "/sign-in" });
  const signInButtonRef = useRef<HTMLButtonElement>(null);

  const [srAnnouncement, setSrAnnouncement] = useState("");
  const announceToScreenReader = (message: string) => {
    setSrAnnouncement(message);
    setTimeout(() => setSrAnnouncement(""), 3000);
  };

  // Focus management for accessibility (T060)
  useEffect(() => {
    if (signInButtonRef.current) {
      signInButtonRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const returnUrl = search.returnUrl;
    const signedOut =
      returnUrl?.includes("signed-out=true") || search["signed-out"] === "true";

    if (signedOut) {
      toast.success("You have been signed out of all apps", {
        duration: 4000,
        description: "Please sign in again to continue.",
      });

      announceToScreenReader(
        "Signed out successfully. You have been signed out of all apps.",
      );
    }
  }, [search]);
  useEffect(() => {
    if (isAuthenticated) {
      const destination = search.returnUrl || "/";
      navigate({ to: destination });
    }
  }, [isAuthenticated, search.returnUrl, navigate]);

  const handleSignIn = async () => {
    try {
      if (search.returnUrl) {
        setReturnUrl(search.returnUrl);
      }
      await login(getAuthConfig().scopes);
    } catch (error) {
      console.error("[Shell] Login error:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-70px)] justify-center bg-linear-to-br from-primary/20 via-secondary/30 to-primary/20 dark:from-primary/10 dark:via-secondary/20 dark:to-primary/10">
      <div className="flex flex-col gap-6 w-full max-w-md px-4 pt-[15vh]">
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {srAnnouncement}
        </div>

        {/* Logo/Brand Section */}
        <div className="flex flex-col gap-3 items-center text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              OnePortal
            </span>
          </h1>
          <p className="text-muted-foreground">
            Your centralized platform for Mott MacDonald applications
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg">
          <CardContent className="flex flex-col gap-6 pt-8 pb-8">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-semibold">Welcome Back</h2>
              <p className="text-sm text-muted-foreground">
                Sign in to continue to your workspace
              </p>
            </div>

            <button
              ref={signInButtonRef}
              onClick={handleSignIn}
              className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Sign in using Mott MacDonald SSO
            </button>

            <p className="text-xs text-center text-muted-foreground">
              Secure authentication powered by Azure AD
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
