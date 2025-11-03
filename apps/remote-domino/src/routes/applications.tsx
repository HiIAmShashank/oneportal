import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { AppWindow } from "lucide-react";
import { createApplicationColumns } from "../features/applications/columns/applicationColumns";
import { useApplications } from "../hooks/useApplications";

export const Route = createFileRoute("/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  // Fetch applications
  const { data, isLoading, error } = useApplications();

  // Create columns
  const columns = useMemo(() => createApplicationColumns(), []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Applications</h1>
          <p className="mt-2 text-base text-muted-foreground">
            View and manage registered applications
          </p>
        </div>
        <div className="rounded-xl bg-linear-to-br from-blue-500/10 to-blue-500/5 p-3">
          <AppWindow className="h-8 w-8 text-blue-500" />
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
          emptyMessage: "No applications found in the system",
          loadingMessage: "Loading applications...",
          errorMessage: "Failed to load applications",
        }}
        persistence={{
          key: "domino-applications-table",
          enabled: true,
        }}
      />
    </div>
  );
}
