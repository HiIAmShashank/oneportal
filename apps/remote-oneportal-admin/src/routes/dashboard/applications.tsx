import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type RowAction, Button } from "@one-portal/ui";
import { Pencil, Plus, Box } from "lucide-react";
import { useState } from "react";
import { createApplicationColumns } from "../../features/applications/columns/applicationColumns";
import { useApplications } from "../../features/applications/hooks/useApplications";
import { useToggleApplicationActive } from "../../features/applications/hooks/useToggleApplicationActive";
import { CreateApplicationSheet } from "../../features/applications/components/CreateApplicationSheet";
import { EditApplicationSheet } from "../../features/applications/components/EditApplicationSheet";
import type { ApiApplication } from "../../api/types";

export const Route = createFileRoute("/dashboard/applications")({
  component: ApplicationsPage,
});

function ApplicationsPage() {
  // Fetch applications with authentication
  const { data, isLoading, error } = useApplications();
  const toggleMutation = useToggleApplicationActive();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApiApplication | null>(null);

  // Handle edit action
  const handleEdit = (application: ApiApplication) => {
    setSelectedApplication(application);
    setIsEditSheetOpen(true);
  };

  // Handle toggle active action
  const handleToggleActive = (application: ApiApplication) => {
    toggleMutation.mutate({
      applicationIdentifier: application.applicationIdentifier,
      activate: !application.isActive,
    });
  };

  // Create columns
  const dataColumns = createApplicationColumns({ onEdit: handleEdit });

  // Define row actions
  const rowActions: RowAction<ApiApplication>[] = [
    {
      id: "edit",
      label: "Edit",
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      id: "toggle",
      label: "Toggle Status",
      onClick: handleToggleActive,
    },
  ];

  const applications = data || [];

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Applications</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage applications and their configurations
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-3">
          <Box className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Create Application Button */}
      <div>
        <Button onClick={() => setIsCreateSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Application
        </Button>
      </div>

      {/* Applications DataTable */}
      <DataTable
        data={applications}
        columns={dataColumns}
        isLoading={isLoading}
        error={error}
        actions={{
          row: rowActions,
          pinRight: true,
        }}
        features={{
          sorting: { enabled: true, multi: true },
          filtering: { enabled: true },
          pagination: {
            enabled: true,
            pageSize: 25,
            pageSizeOptions: [10, 25, 50, 100],
          },
          columns: {
            visibility: true,
            resizing: true,
            pinning: true,
          },
        }}
        ui={{
          variant: "striped",
          showToolbar: true,
          emptyMessage: "No applications found in the system",
          loadingMessage: "Loading applications...",
          errorMessage: "Failed to load applications",
        }}
        persistence={{
          key: "oneportal-admin-applications-table",
          enabled: true,
        }}
      />

      {/* Create Application Sheet */}
      <CreateApplicationSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
      />

      {/* Edit Application Sheet */}
      <EditApplicationSheet
        open={isEditSheetOpen}
        onOpenChange={setIsEditSheetOpen}
        application={selectedApplication}
      />
    </div>
  );
}
