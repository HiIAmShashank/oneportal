import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { Tag } from "lucide-react";
import { createEventTypeColumns } from "../features/event-types/columns/eventTypeColumns";
import { useEventTypes } from "../hooks/useEventTypes";

export const Route = createFileRoute("/event-types")({
  component: EventTypesPage,
});

function EventTypesPage() {
  // Fetch event types
  const { data, isLoading, error } = useEventTypes();

  // Create columns
  const columns = useMemo(() => createEventTypeColumns(), []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Event Types</h1>
          <p className="mt-2 text-base text-muted-foreground">
            View and manage event type definitions
          </p>
        </div>
        <div className="rounded-xl bg-linear-to-br from-amber-500/10 to-amber-500/5 p-3">
          <Tag className="h-8 w-8 text-amber-500" />
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
          emptyMessage: "No event types found in the system",
          loadingMessage: "Loading event types...",
          errorMessage: "Failed to load event types",
        }}
        persistence={{
          key: "domino-event-types-table",
          enabled: true,
        }}
      />
    </div>
  );
}
