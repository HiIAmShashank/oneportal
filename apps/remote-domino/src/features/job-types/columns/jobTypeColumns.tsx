/**
 * JobType DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import type { JobType } from "../../../api";

/**
 * Column definitions for Job Types DataTable
 */
export function createJobTypeColumns(): ColumnDef<JobType>[] {
  return [
    {
      id: "jobTypeId",
      accessorKey: "jobTypeId",
      header: "Job Type ID",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by ID...",
      },
    },
    {
      id: "jobTypeName",
      accessorKey: "jobTypeName",
      header: "Job Type Name",
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
      id: "applicationId",
      accessorKey: "applicationId",
      header: "Application ID",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search application ID...",
      },
    },
    {
      id: "applicationName",
      accessorKey: "applicationName",
      header: "Application Name",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search application name...",
      },
    },
  ];
}
