import type { ColumnDef } from "@one-portal/ui";
import { Badge } from "@one-portal/ui";
import type { ApiFeature } from "../../../api/types";

/**
 * Column definitions for the Features DataTable
 *
 * Displays 7 columns:
 * - Feature Name (filterable)
 * - Description (filterable)
 * - Feature URL (filterable)
 * - Icon Name (filterable)
 * - Application Name (filterable, shows parent application)
 * - Status (filterable with select, shows Active/Inactive badge)
 */
export const featureColumns: ColumnDef<ApiFeature>[] = [
  {
    accessorKey: "featureName",
    header: "Feature Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("featureName")}</div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "featureDescription",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("featureDescription") as string;
      return (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {description || "—"}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "featureUrl",
    header: "Feature URL",
    cell: ({ row }) => {
      const url = row.getValue("featureUrl") as string;
      return (
        <div className="font-mono text-sm text-muted-foreground">
          {url || "—"}
        </div>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "iconName",
    header: "Icon",
    cell: ({ row }) => {
      const iconName = row.getValue("iconName") as string;
      return <div className="font-mono text-sm">{iconName}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "applicationName",
    header: "Application",
    cell: ({ row }) => (
      <div className="font-medium text-primary">
        {row.getValue("applicationName")}
      </div>
    ),
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "text",
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    enableSorting: true,
    enableColumnFilter: true,
    meta: {
      filterVariant: "select",
      filterOptions: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
      ],
    },
    filterFn: (row, _columnId, filterValue) => {
      const isActive = row.getValue("isActive") as boolean;
      return filterValue === String(isActive);
    },
  },
];
