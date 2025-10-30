import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type RowAction, Button } from "@one-portal/ui";
import { useFeatures } from "../../features/features/hooks/useFeatures";
import { useToggleFeatureActive } from "../../features/features/hooks/useToggleFeatureActive";
import { featureColumns } from "../../features/features/columns/featureColumns";
import { CreateFeatureSheet } from "../../features/features/components/CreateFeatureSheet";
import { EditFeatureSheet } from "../../features/features/components/EditFeatureSheet";
import type { ApiFeature } from "../../api/types";

export const Route = createFileRoute("/dashboard/features")({
  component: FeaturesPage,
});

/**
 * Features management page (SuperUser only)
 *
 * Features:
 * - DataTable V2 with filtering, sorting, pagination
 * - Create new feature (Sheet with application dropdown)
 * - Edit existing feature (Sheet, application read-only)
 * - Toggle active/inactive status
 * - Shows all features (active and inactive) with parent application names
 */
function FeaturesPage() {
  const { data: features = [], error } = useFeatures();
  const toggleMutation = useToggleFeatureActive();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<ApiFeature | null>(
    null,
  );

  const handleEdit = (feature: ApiFeature) => {
    setSelectedFeature(feature);
    setEditOpen(true);
  };

  const handleToggleActive = (feature: ApiFeature) => {
    toggleMutation.mutate({
      featureIdentifier: feature.featureIdentifier,
      currentStatus: feature.isActive,
    });
  };

  const rowActions: RowAction<ApiFeature>[] = [
    {
      id: "edit",
      label: "Edit",
      onClick: handleEdit,
    },
    {
      id: "toggle",
      label: "Toggle Status",
      onClick: handleToggleActive,
    },
  ];

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Error Loading Features
          </h2>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Features</h1>
          <p className="text-muted-foreground">
            Manage application features and their settings
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>Create Feature</Button>
      </div>

      <DataTable
        data={features}
        columns={featureColumns}
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
          emptyMessage: "No features found in the system",
        }}
        persistence={{
          key: "oneportal-admin-features-table",
          enabled: true,
        }}
      />

      <CreateFeatureSheet open={createOpen} onOpenChange={setCreateOpen} />
      <EditFeatureSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        feature={selectedFeature}
      />
    </div>
  );
}
