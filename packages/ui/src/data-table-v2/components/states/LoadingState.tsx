/**
 * LoadingState - Shows when table is loading data
 *
 * Displays either a spinner or skeleton rows while data is being fetched.
 */

import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  /** Loading message to display (only for spinner mode) */
  message?: string;
  /** Loading mode: 'spinner' shows centered spinner, 'skeleton' shows skeleton rows */
  mode?: "spinner" | "skeleton";
  /** Number of skeleton rows to show (only for skeleton mode) */
  rowCount?: number;
  /** Number of columns for skeleton (only for skeleton mode) */
  columnCount?: number;
  /** Density affects skeleton row height */
  density?: "compact" | "default" | "comfortable";
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  mode = "spinner",
  rowCount = 5,
  columnCount = 5,
  density = "default",
  className,
}: LoadingStateProps) {
  if (mode === "spinner") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground dark:text-muted-foreground ${className || ""}`}
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  // Skeleton mode
  const rowHeight = {
    compact: "h-8",
    default: "h-12",
    comfortable: "h-16",
  }[density];

  return (
    <div className={`animate-pulse ${className || ""}`}>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex items-center gap-4 border-b border-border/50 dark:border-border/30 ${rowHeight} px-4`}
        >
          {Array.from({ length: columnCount }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="flex-1"
              style={{
                // Vary widths for more realistic skeleton
                width:
                  colIndex === 0
                    ? "60%"
                    : colIndex === columnCount - 1
                      ? "40%"
                      : "80%",
              }}
            >
              <div className="h-4 rounded-sm bg-muted/50 dark:bg-muted/30" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
