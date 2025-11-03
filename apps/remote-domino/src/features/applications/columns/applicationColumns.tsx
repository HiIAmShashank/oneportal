/**
 * Application DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import { Badge } from "@one-portal/ui";
import type { Application } from "../../../api";

/**
 * Column definitions for Applications DataTable
 */
export function createApplicationColumns(): ColumnDef<Application>[] {
  return [
    {
      id: "applicationID",
      accessorKey: "applicationID",
      header: "Application ID",
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
      id: "emailAddress",
      accessorKey: "emailAddress",
      header: "Email Address",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search email...",
      },
    },
    {
      id: "hasSecureAccess",
      accessorKey: "hasSecureAccess",
      header: "Secure Access",
      cell: ({ getValue }) => {
        const hasSecure = getValue() as boolean;
        return hasSecure ? (
          <Badge variant="default">Yes</Badge>
        ) : (
          <Badge variant="secondary">No</Badge>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "select",
        filterOptions: [
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ],
      },
    },
    {
      id: "subscriptionId",
      accessorKey: "subscriptionId",
      header: "Subscription ID",
      cell: ({ getValue }) => <span>{getValue() as number}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search subscription...",
      },
    },
  ];
}
