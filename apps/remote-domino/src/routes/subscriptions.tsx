import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { Key } from "lucide-react";
import { createSubscriptionColumns } from "../features/subscriptions/columns/subscriptionColumns";
import { useSubscriptions } from "../hooks/useSubscriptions";

export const Route = createFileRoute("/subscriptions")({
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  // Fetch subscriptions
  const { data, isLoading, error } = useSubscriptions({
    pageNumber: 1,
    pageSize: 20,
  });

  // Create columns
  const columns = useMemo(() => createSubscriptionColumns(), []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Subscriptions</h1>
          <p className="mt-2 text-base text-muted-foreground">
            View and manage subscription definitions
          </p>
        </div>
        <div className="rounded-xl bg-linear-to-br from-green-500/10 to-green-500/5 p-3">
          <Key className="h-8 w-8 text-green-500" />
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
          emptyMessage: "No subscriptions found in the system",
          loadingMessage: "Loading subscriptions...",
          errorMessage: "Failed to load subscriptions",
        }}
        persistence={{
          key: "domino-subscriptions-table",
          enabled: true,
        }}
      />
    </div>
  );
}
