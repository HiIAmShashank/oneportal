/**
 * WorkflowStepType DataTable Column Definitions
 */

import type { ColumnDef } from "@one-portal/ui";
import type { WorkflowStepType } from "../../../api";

/**
 * Column definitions for Workflow Step Types DataTable
 */
export function createWorkflowStepTypeColumns(): ColumnDef<WorkflowStepType>[] {
  return [
    {
      id: "workflowStepTypeId",
      accessorKey: "workflowStepTypeId",
      header: "Workflow Type ID",
      cell: ({ getValue }) => <span>{getValue() as string}</span>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        filterVariant: "text",
        filterPlaceholder: "Search by ID...",
      },
    },
    {
      id: "workflowStepTypeName",
      accessorKey: "workflowStepTypeName",
      header: "Workflow Type Name",
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
