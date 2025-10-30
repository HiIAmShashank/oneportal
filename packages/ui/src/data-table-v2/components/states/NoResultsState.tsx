/**
 * NoResultsState - Shows when filters return no results
 *
 * Displays a message when the table has data but current filters produce no results.
 */

import * as React from "react";
import { SearchX } from "lucide-react";
import { Button } from "../../../components/ui/button";

export interface NoResultsStateProps {
  message?: string;
  onClearFilters?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function NoResultsState({
  message = "No results found",
  onClearFilters,
  icon,
  className,
}: NoResultsStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground dark:text-muted-foreground ${className || ""}`}
    >
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 dark:bg-muted/20">
        {icon || <SearchX className="h-8 w-8 opacity-50" />}
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-sm font-medium">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground/70 dark:text-muted-foreground/70">
          Try adjusting your filters
        </p>
      </div>

      {/* Clear Filters Button */}
      {onClearFilters && (
        <Button onClick={onClearFilters} variant="outline" size="sm">
          Clear filters
        </Button>
      )}
    </div>
  );
}
