import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { Network } from "lucide-react";
import { createWorkflowStepTypeColumns } from "../features/workflow-step-types/columns/workflowStepTypeColumns";
import { useWorkflowStepTypes } from "../hooks/useWorkflowStepTypes";

export const Route = createFileRoute("/workflow-step-types")({
  component: WorkflowStepTypesPage,
});

function WorkflowStepTypesPage() {
  // Fetch workflow step types
  const { data, isLoading, error } = useWorkflowStepTypes();

  // Create columns
  const columns = useMemo(() => createWorkflowStepTypeColumns(), []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Workflow Step Types
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            View and manage workflow step type definitions
          </p>
        </div>
        <div className="rounded-xl bg-linear-to-br from-teal-500/10 to-teal-500/5 p-3">
          <Network className="h-8 w-8 text-teal-500" />
        </div>
      </div>
      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error}
        features={{
          pagination: {
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100],
            showPageInfo: true,
            showPageSizeSelector: true,
          },
          filtering: {
            enabled: true,
            mode: "faceted",
          },
          sorting: {
            enabled: true,
            multi: false,
          },
        }}
        ui={{
          variant: "striped",
          filterMode: "inline",
          showToolbar: true,
          emptyMessage: "No workflow step types found in the system",
          loadingMessage: "Loading workflow step types...",
          errorMessage: "Failed to load workflow step types",
        }}
        persistence={{
          key: "domino-workflow-step-types-table",
          enabled: true,
        }}
      />
    </div>
  );
}
