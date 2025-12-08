/**
 * Subscription DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import type { Subscription } from "../../../api";

/**
 * Column definitions for Subscriptions DataTable
 */
export function createSubscriptionColumns(): ColumnDef<Subscription>[] {
  return [
    {
      id: "subscriptionID",
      accessorKey: "subscriptionID",
      header: "Subscription ID",
      cell: ({ getValue }) => <span>{getValue() as number}</span>,
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
      id: "apiKey",
      accessorKey: "apiKey",
      header: "API Key",
      cell: ({ getValue }) => {
        const apiKey = getValue() as string;
        return <span className="font-mono text-sm">{apiKey}</span>;
      },
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search API key...",
      },
    },
  ];
}
