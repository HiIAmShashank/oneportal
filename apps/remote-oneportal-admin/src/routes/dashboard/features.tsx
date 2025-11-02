import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DataTable, type RowAction, Button } from "@one-portal/ui";
import { Layers, Plus } from "lucide-react";
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
  const { data: features = [], isLoading, error } = useFeatures();
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

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Features</h1>
          <p className="mt-2 text-base text-muted-foreground">
            Manage application features and their settings
          </p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-3">
          <Layers className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      {/* Create Feature Button */}
      <div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Feature
        </Button>
      </div>

      <DataTable
        data={features}
        columns={featureColumns}
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
          emptyMessage: "No features found in the system",
          loadingMessage: "Loading features...",
          errorMessage: "Failed to load features",
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
