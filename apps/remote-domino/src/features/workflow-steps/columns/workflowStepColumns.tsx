/**
 * WorkflowStep DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import type { WorkflowStep } from "../../../api";

/**
 * Column definitions for Workflow Steps DataTable
 */
export function createWorkflowStepColumns(): ColumnDef<WorkflowStep>[] {
  return [
    {
      id: "workflowTypeId",
      accessorKey: "workflowTypeId",
      header: "Workflow Step Type ID",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by ID...",
      },
    },
    {
      id: "workflowTypeName",
      accessorKey: "workflowTypeName",
      header: "Workflow Step Type Name",
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
  ];
}
