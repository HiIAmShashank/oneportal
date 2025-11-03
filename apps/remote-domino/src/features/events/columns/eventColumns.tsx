/**
 * Event DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import { formatDistanceToNow } from "date-fns";
import { Eye } from "lucide-react";
import { Button } from "@one-portal/ui";
import type { Event } from "../../../api";

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
function formatRelativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

/**
 * Column definitions for Events DataTable
 */
export function createEventColumns(
  onViewDetails: (event: Event) => void,
): ColumnDef<Event>[] {
  return [
    {
      accessorKey: "eventID",
      header: "Event ID",
      cell: ({ row }) => (
        <span className="max-w-[120px] truncate font-mono text-xs">
          {row.original.eventID}
        </span>
      ),
    },
    {
      accessorKey: "application",
      header: "Application",
      cell: ({ row }) => (
        <span className="max-w-[150px] truncate font-medium">
          {row.original.application}
        </span>
      ),
    },
    {
      accessorKey: "eventType",
      header: "Event Type",
      cell: ({ row }) => (
        <span className="max-w-[180px] truncate font-mono text-xs">
          {row.original.eventType}
        </span>
      ),
    },
    {
      accessorKey: "eventData",
      header: "Event Data",
      cell: ({ row }) => (
        <span className="max-w-xs truncate text-xs text-muted-foreground">
          {row.original.eventData}
        </span>
      ),
    },
    {
      accessorKey: "resourceID",
      header: "Resource ID",
      cell: ({ row }) => (
        <span className="max-w-[120px] truncate font-mono text-xs">
          {row.original.resourceID || "—"}
        </span>
      ),
    },
    {
      accessorKey: "correlationID",
      header: "Correlation ID",
      cell: ({ row }) => (
        <span className="max-w-[120px] truncate font-mono text-xs">
          {row.original.correlationID}
        </span>
      ),
    },
    {
      accessorKey: "utcCreatedDate",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-xs">
          {formatRelativeDate(row.original.utcCreatedDate)}
        </span>
      ),
    },
    {
      id: "jobs",
      header: "Jobs",
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.jobCompletedCount}/{row.original.jobCount}
        </span>
      ),
    },
    {
      accessorKey: "utcLastActivityDate",
      header: "Last Activity",
      cell: ({ row }) => (
        <span className="text-xs">
          {formatRelativeDate(row.original.utcLastActivityDate)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row.original)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      ),
    },
  ];
}
