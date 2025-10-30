/**
 * Application Table Column Definitions
 *
 * Defines column configuration for the applications DataTable including:
 * - Custom cell renderers (badges, links)
 * - Filter configurations (text, boolean, select)
 * - Sorting and visibility settings
 */

import type { ColumnDef } from "@one-portal/ui";
import { Badge } from "@one-portal/ui";
import type { ApiApplication } from "../../../api/types";

/**
 * Create application table columns
 *
 * @param _options - Reserved for future use (edit callbacks, etc.)
 * @returns Column definitions for DataTable
 */
export function createApplicationColumns(_options?: {
  onEdit?: (application: ApiApplication) => void;
}): ColumnDef<ApiApplication>[] {
  return [
    {
      accessorKey: "applicationName",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by name...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "applicationDescription",
      header: "Description",
      cell: ({ getValue }) => {
        const description = getValue() as string;
        return <span className="max-w-md truncate text-sm">{description}</span>;
      },
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search description...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "landingPage",
      header: "Landing Page",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue() as string}</span>
      ),
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search landing page...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue() as string}</span>
      ),
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search module...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "scope",
      header: "Scope",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue() as string}</span>
      ),
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search scope...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "iconName",
      header: "Icon",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue() as string}</span>
      ),
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search icon...",
      },
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "owner",
      header: "Owner",
      cell: ({ getValue }) => {
        const owner = getValue() as {
          userIdentifier: string;
          email: string;
        } | null;
        return owner ? (
          <span className="text-sm">{owner.email}</span>
        ) : (
          <span className="text-sm text-muted-foreground">No owner</span>
        );
      },
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by owner email...",
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
  ];
}
