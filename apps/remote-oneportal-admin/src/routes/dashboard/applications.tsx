import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type RowAction, Button } from "@one-portal/ui";
import { Pencil, Plus } from "lucide-react";
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
  const { data } = useApplications();
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
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-muted-foreground">
            Manage applications and their configurations
          </p>
        </div>
        <Button onClick={() => setIsCreateSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Application
        </Button>
      </div>

      {/* Applications DataTable */}
      <DataTable
        data={applications}
        columns={dataColumns}
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
