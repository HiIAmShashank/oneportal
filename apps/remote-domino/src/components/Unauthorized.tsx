/**
 * Unauthorized Access Page
 *
 * Displayed when a user attempts to access admin routes without SuperUser privileges
 */

import { Link } from "@tanstack/react-router";
import { useAuth } from "@one-portal/auth/hooks";
import { ShieldAlert } from "lucide-react";

export function Unauthorized() {
  const { state, logout } = useAuth();
  const { userProfile } = state;

  return (
    <div className="flex h-[calc(100vh-70px)] justify-center bg-linear-to-br from-primary/20 via-secondary/30 to-primary/20 dark:from-primary/10 dark:via-secondary/15 dark:to-primary/10 px-4">
      <div className="flex flex-col gap-6 items-center text-center pt-4 max-w-2xl">
        {/* Icon */}
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10">
          <ShieldAlert className="w-12 h-12 text-destructive" />
        </div>

        {/* Error Message */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Unauthorized Access
          </h2>
          <p className="text-lg text-muted-foreground">
            You don't have the required permissions to access the OnePortal
            Admin application.
          </p>
          {userProfile?.email && (
            <p className="text-sm text-muted-foreground">
              Currently signed in as:{" "}
              <span className="font-medium">{userProfile.email}</span>
            </p>
          )}
        </div>

        {/* Information Box */}
        <div className="w-full p-4 rounded-lg bg-background/40 backdrop-blur-lg border border-white/20 dark:border-white/10 text-left">
          <h3 className="font-semibold mb-2">Why am I seeing this?</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              This application requires SuperUser (Administrator) privileges
            </li>
            <li>Your account doesn't have the necessary permissions</li>
            <li>Contact your system administrator to request access</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg shadow-md transition-colors duration-200"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to OnePortal
          </Link>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg shadow-md transition-colors duration-200"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Helper Text */}
        <p className="text-sm text-muted-foreground">
          Error Code: 403 | Forbidden Access
        </p>
      </div>
    </div>
  );
}
