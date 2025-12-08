import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { Briefcase } from "lucide-react";
import { createJobTypeColumns } from "../features/job-types/columns/jobTypeColumns";
import { useJobTypes } from "../hooks/useJobTypes";

export const Route = createFileRoute("/job-types")({
  component: JobTypesPage,
});

function JobTypesPage() {
  // Fetch job types
  const { data, isLoading, error } = useJobTypes();

  // Create columns
  const columns = useMemo(() => createJobTypeColumns(), []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Job Types</h1>
          <p className="mt-2 text-base text-muted-foreground">
            View and manage job type definitions
          </p>
        </div>
        <div className="rounded-xl bg-linear-to-br from-blue-500/10 to-blue-500/5 p-3">
          <Briefcase className="h-8 w-8 text-blue-500" />
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
          emptyMessage: "No job types found in the system",
          loadingMessage: "Loading job types...",
          errorMessage: "Failed to load job types",
        }}
        persistence={{
          key: "domino-job-types-table",
          enabled: true,
        }}
      />
    </div>
  );
}
