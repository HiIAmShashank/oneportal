import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@one-portal/ui";

interface ErrorFallbackProps {
  error?: Error | string;
  appName?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorFallback({
  error,
  appName = "Application",
  onRetry,
  className = "",
}: ErrorFallbackProps) {
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "An unexpected error occurred";

  return (
    <div
      className={`flex items-center justify-center min-h-[600px] p-8 ${className}`}
    >
      <div className="relative w-full max-w-2xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 via-destructive/10 to-destructive/20 blur-3xl opacity-50 animate-pulse" />

        {/* Main card with glassmorphism */}
        <div className="relative backdrop-blur-xl bg-card/50 border border-destructive/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header section */}
          <div className="p-8 pb-6 border-b border-destructive/10">
            <div className="flex items-start gap-4">
              {/* Icon with glow effect */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-7 w-7 text-destructive" />
                </div>
              </div>

              {/* Title and description */}
              <div className="flex-1 space-y-1">
                <h2 className="text-2xl font-semibold text-foreground">
                  Failed to Load {appName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  We encountered a problem loading this application
                </p>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="p-8 space-y-6">
            {/* Error message box */}
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/5 blur-sm rounded-lg" />
              <div className="relative bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-sm text-destructive">
                      Error Details
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                What you can try:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                    1
                  </span>
                  <span className="pt-0.5">Check your internet connection</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                    2
                  </span>
                  <span className="pt-0.5">Try refreshing the page</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                    3
                  </span>
                  <span className="pt-0.5">
                    Contact support if the problem persists
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer with actions */}
          <div className="p-8 pt-0 flex gap-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                variant="default"
                className="flex-1 h-11"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
