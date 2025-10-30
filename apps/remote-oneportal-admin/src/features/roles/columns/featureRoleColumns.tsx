/**
 * Feature Roles Table Column Definitions
 *
 * Defines column configuration for feature-level roles DataTable.
 */

import type { ColumnDef } from "@one-portal/ui";
import { Badge, Button } from "@one-portal/ui";
import { Trash2 } from "lucide-react";
import type { UserFeatureRole } from "../../../api/types";
import { format } from "date-fns";

/**
 * Create feature roles table columns
 *
 * @param options - Column configuration options
 * @returns Column definitions for DataTable
 */
export function createFeatureRoleColumns(options: {
  onRevoke: (role: UserFeatureRole) => void;
}): ColumnDef<UserFeatureRole>[] {
  return [
    {
      accessorKey: "featureName",
      header: "Feature",
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.featureName}</span>;
      },
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search features...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "role.roleName",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <Badge variant="default">
            {role.roleName} (L{role.roleLevel})
          </Badge>
        );
      },
      meta: {
        filterVariant: "select",
        filterOptions: [
          { label: "Reader", value: "Reader" },
          { label: "Editor", value: "Editor" },
          { label: "Admin", value: "Admin" },
        ],
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "grantedAt",
      header: "Granted At",
      cell: ({ getValue }) => {
        const date = new Date(getValue() as string);
        return (
          <span className="text-sm text-muted-foreground">
            {format(date, "MMM d, yyyy HH:mm")}
          </span>
        );
      },
      meta: {
        filterVariant: "date-range",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => options.onRevoke(row.original)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Revoke role</span>
          </Button>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];
}
