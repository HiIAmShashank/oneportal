/**
 * User Table Column Definitions
 *
 * Defines column configuration for the users DataTable including:
 * - Custom cell renderers (badges, date formatting)
 * - Filter configurations (text, boolean, select, date-range)
 * - Sorting and visibility settings
 */

import type { ColumnDef } from "@one-portal/ui";
import { Badge } from "@one-portal/ui";
import type { ApiUser } from "../../../api/types";
import { format } from "date-fns";

/**
 * Create user table columns
 *
 * @param _options - Reserved for future use (edit callbacks, etc.)
 * @returns Column definitions for DataTable
 */
export function createUserColumns(_options?: {
  onEdit?: (user: ApiUser) => void;
}): ColumnDef<ApiUser>[] {
  return [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by email...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "displayName",
      header: "Name",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by name...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => {
        const isActive = getValue() as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
      meta: {
        filterVariant: "select",
        filterOptions: [
          { label: "Active", value: true },
          { label: "Inactive", value: false },
        ],
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return (
          <span className="text-sm text-muted-foreground">
            {format(date, "MMM d, yyyy")}
          </span>
        );
      },
      meta: {
        filterVariant: "date-range",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
  ];
}
