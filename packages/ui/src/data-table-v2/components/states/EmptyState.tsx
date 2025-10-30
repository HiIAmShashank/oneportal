/**
 * EmptyState - Shows when table has no data
 *
 * Displays an empty state with icon and message when the table has no data to display.
 */

import * as React from "react";
import { FileQuestion } from "lucide-react";
import { Button } from "../../../components/ui/button";

export interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  message = "No data available",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground dark:text-muted-foreground ${className || ""}`}
    >
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 dark:bg-muted/20">
        {icon || <FileQuestion className="h-8 w-8 opacity-50" />}
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-sm font-medium">{message}</p>
      </div>

      {/* Optional Action Button */}
      {action && (
        <Button onClick={action.onClick} variant="outline" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
