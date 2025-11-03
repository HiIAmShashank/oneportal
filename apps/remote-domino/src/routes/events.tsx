import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { DataTable } from "@one-portal/ui";
import { createEventColumns } from "../features/events/columns/eventColumns";
import { EventDetailsSheet } from "../features/events/components/EventDetailsSheet";
import { useEvents } from "../hooks/useEvents";
import { useEventTypes } from "../hooks/useEventTypes";
import { useApplications } from "../hooks/useApplications";
import type { Event, FetchEventsParams } from "../api/types";
import { Input } from "@one-portal/ui";
import { Label } from "@one-portal/ui";
import { Button } from "@one-portal/ui";
import { ComboboxField } from "../components/ComboboxField";

export const Route = createFileRoute("/events")({
  component: EventsPage,
});

function EventsPage() {
  // Filter state
  const [eventTypeId, setEventTypeId] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");
  const [correlationId, setCorrelationId] = useState<string>("");

  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected event for details sheet
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch event types and applications for dropdowns
  const { data: eventTypesData } = useEventTypes();
  const { data: applicationsData } = useApplications();

  // Transform to combobox options
  const eventTypeOptions = useMemo(
    () =>
      eventTypesData?.data.map((et) => ({
        value: et.eventTypeID,
        label: et.name,
      })) ?? [],
    [eventTypesData],
  );

  const applicationOptions = useMemo(
    () =>
      applicationsData?.data.map((app) => ({
        value: app.applicationID,
        label: app.name,
      })) ?? [],
    [applicationsData],
  );

  // Build query params
  const queryParams: FetchEventsParams = {
    pageNumber,
    pageSize,
    ...(eventTypeId && { eventTypeId }),
    ...(applicationId && { applicationId }),
    ...(correlationId && { correlationId }),
  };

  // Fetch events with useEvents hook
  const { data, isLoading, error, refetch } = useEvents(queryParams);

  // Create columns with view details handler
  const columns = createEventColumns((event) => setSelectedEvent(event));

  // Handle filter reset
  const handleResetFilters = () => {
    setEventTypeId("");
    setApplicationId("");
    setCorrelationId("");
    setPageNumber(1);
  };

  // Handle server-side pagination
  const handleServerSideFetch = (params: {
    page: number;
    pageSize: number;
  }) => {
    setPageNumber(params.page + 1);
    setPageSize(params.pageSize);
  };
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="text-muted-foreground">
          View and manage Domino Event System events
        </p>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="space-y-2">
          <Label htmlFor="eventTypeId">Event Type</Label>
          <ComboboxField
            value={eventTypeId}
            onValueChange={(value) => {
              setEventTypeId(value);
              setPageNumber(1);
            }}
            options={eventTypeOptions}
            placeholder="Select event type..."
            searchPlaceholder="Search event types..."
            emptyMessage="No event types found."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="applicationId">Application</Label>
          <ComboboxField
            value={applicationId}
            onValueChange={(value) => {
              setApplicationId(value);
              setPageNumber(1);
            }}
            options={applicationOptions}
            placeholder="Select application..."
            searchPlaceholder="Search applications..."
            emptyMessage="No applications found."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correlationId">Correlation ID</Label>
          <Input
            id="correlationId"
            placeholder="Filter by correlation ID..."
            value={correlationId}
            onChange={(e) => {
              setCorrelationId(e.target.value);
              setPageNumber(1);
            }}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="flex-1"
          >
            Reset
          </Button>
          <Button
            variant="default"
            onClick={() => refetch()}
            className="flex-1"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        error={error}
        features={{
          serverSide: {
            enabled: true,
            totalCount: data?.totalCount ?? 0,
            loading: isLoading,
            error: error,
            onFetch: handleServerSideFetch,
          },
          pagination: {
            enabled: true,
            pageSize,
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
      />
      <EventDetailsSheet
        event={selectedEvent}
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedEvent(null);
        }}
      />
    </div>
  );
}
