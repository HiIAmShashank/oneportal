/**
 * Event DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import { formatDistanceToNow } from "date-fns";
import { ListCollapse } from "lucide-react";
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
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(row.original)}
          className="h-8 w-8 p-0"
        >
          <ListCollapse className="h-4 w-4" />
          <span className="sr-only">View details</span>
        </Button>
      ),
      size: 40,
      maxSize: 40,
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: "eventID",
      accessorKey: "eventID",
      header: "Event ID",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by ID...",
      },
    },
    {
      id: "application",
      accessorKey: "application",
      header: "Application",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search application...",
      },
    },
    {
      id: "eventType",
      accessorKey: "eventType",
      header: "Event Type",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search event type...",
      },
    },
    {
      id: "eventData",
      accessorKey: "eventData",
      header: "Event Data",
      cell: ({ getValue }) => {
        const data = getValue() as string;
        return <span className="max-w-xs truncate">{data}</span>;
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search event data...",
      },
    },
    {
      id: "resourceID",
      accessorKey: "resourceID",
      header: "Resource ID",
      cell: ({ getValue }) => {
        const resourceID = getValue() as string | null;
        return resourceID ? (
          <span>{resourceID}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search resource ID...",
      },
    },
    {
      id: "correlationID",
      accessorKey: "correlationID",
      header: "Correlation ID",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search correlation ID...",
      },
    },
    {
      id: "utcCreatedDate",
      accessorKey: "utcCreatedDate",
      header: "Created",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return <span>{formatRelativeDate(date)}</span>;
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "date-range",
      },
    },
    {
      id: "utcLastActivityDate",
      accessorKey: "utcLastActivityDate",
      header: "Last Activity",
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return <span>{formatRelativeDate(date)}</span>;
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "date-range",
      },
    },
    {
      id: "jobs",
      accessorKey: "jobCount",
      header: "Jobs",
      cell: ({ row }) => (
        <span>
          {row.original.jobCompletedCount}/{row.original.jobCount}
        </span>
      ),
      size: 60,
      maxSize: 60,
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];
}
