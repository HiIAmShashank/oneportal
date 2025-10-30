/**
 * ErrorState - Shows when table fails to load data
 *
 * Displays an error message with optional retry button when data fetching fails.
 */

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";

export interface ErrorStateProps {
  /** Main error message */
  message?: string;
  /** Detailed error message (e.g., from error.message) */
  details?: string;
  /** Retry callback */
  onRetry?: () => void;
  /** Custom icon */
  icon?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  message = "Error loading data",
  details,
  onRetry,
  icon,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-destructive dark:text-destructive ${className || ""}`}
    >
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
        {icon || <AlertCircle className="h-8 w-8" />}
      </div>

      {/* Messages */}
      <div className="text-center">
        <p className="font-medium">{message}</p>
        {details && (
          <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
            {details}
          </p>
        )}
      </div>

      {/* Retry Button */}
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try again
        </Button>
      )}
    </div>
  );
}
