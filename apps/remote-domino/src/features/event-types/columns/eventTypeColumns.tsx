/**
 * EventType DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import type { EventType } from "../../../api";

/**
 * Column definitions for Event Types DataTable
 */
export function createEventTypeColumns(): ColumnDef<EventType>[] {
  return [
    {
      id: "eventTypeID",
      accessorKey: "eventTypeID",
      header: "Event Type ID",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by ID...",
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search name...",
      },
    },
    {
      id: "dataDefinition",
      accessorKey: "dataDefinition",
      header: "Data Definition",
      cell: ({ getValue }) => {
        const dataDefinition = getValue() as string | null;
        return dataDefinition ? (
          <span className="max-w-md truncate">{dataDefinition}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search definition...",
      },
    },
    {
      id: "publisherID",
      accessorKey: "publisherID",
      header: "Publisher ID",
      cell: ({ getValue }) => {
        const publisherID = getValue() as string | null;
        return publisherID ? (
          <span>{publisherID}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search publisher...",
      },
    },
  ];
}
