import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { Workflow } from "lucide-react";
import { createWorkflowStepColumns } from "../features/workflow-steps/columns/workflowStepColumns";
import { useWorkflowSteps } from "../hooks/useWorkflowSteps";

export const Route = createFileRoute("/workflow-steps")({
  component: WorkflowStepsPage,
});

function WorkflowStepsPage() {
  // Fetch workflow steps
  const { data, isLoading, error } = useWorkflowSteps();

  // Create columns
  const columns = useMemo(() => createWorkflowStepColumns(), []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Workflow Steps</h1>
          <p className="mt-2 text-base text-muted-foreground">
            View and manage workflow step definitions
          </p>
        </div>
        <div className="rounded-xl bg-linear-to-br from-purple-500/10 to-purple-500/5 p-3">
          <Workflow className="h-8 w-8 text-purple-500" />
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
          emptyMessage: "No workflow steps found in the system",
          loadingMessage: "Loading workflow steps...",
          errorMessage: "Failed to load workflow steps",
        }}
        persistence={{
          key: "domino-workflow-steps-table",
          enabled: true,
        }}
      />
    </div>
  );
}
