/**
 * Event Details Sheet Component
 *
 * Displays comprehensive event information in a sheet with JSON viewer
 */

import { JsonEditor, githubLightTheme } from "json-edit-react";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@one-portal/ui";
import { Badge } from "@one-portal/ui";
import type { Event } from "../../../api";

interface EventDetailsSheetProps {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Parse event data JSON string safely
 */
function parseEventData(eventData: string): object | string {
  try {
    return JSON.parse(eventData);
  } catch {
    return eventData;
  }
}

/**
 * Format ISO date string to readable format
 */
function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "PPpp");
  } catch {
    return dateString;
  }
}

export function EventDetailsSheet({
  event,
  open,
  onOpenChange,
}: EventDetailsSheetProps) {
  if (!event) return null;

  const eventDataParsed = parseEventData(event.eventData);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Event Details</SheetTitle>
          <SheetDescription>
            Comprehensive information about this event
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Overview Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Event ID</p>
                <p className="font-mono text-sm break-all">{event.eventID}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Application</p>
                <p className="text-sm font-medium">{event.application}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Event Type</p>
                <p className="font-mono text-sm">{event.eventType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Correlation ID</p>
                <p className="font-mono text-sm break-all">
                  {event.correlationID}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Secure</p>
                <Badge variant={event.isSecure ? "default" : "secondary"}>
                  {event.isSecure ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Resource Info */}
          {(event.resourceID || event.resourceType) && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Resource</h3>
              <div className="grid grid-cols-2 gap-4">
                {event.resourceID && (
                  <div>
                    <p className="text-xs text-muted-foreground">Resource ID</p>
                    <p className="font-mono text-sm">{event.resourceID}</p>
                  </div>
                )}
                {event.resourceType && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Resource Type
                    </p>
                    <p className="text-sm">{event.resourceType}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Job Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Jobs</p>
                <p className="text-sm font-medium">{event.jobCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-medium">{event.jobCompletedCount}</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Timestamps</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">{formatDate(event.utcCreatedDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Activity</p>
                <p className="text-sm">
                  {formatDate(event.utcLastActivityDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Event Data JSON */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Event Data</h3>
            <div className="rounded-lg border bg-muted/50 p-4">
              <JsonEditor
                data={eventDataParsed}
                rootName="eventData"
                collapse={false}
                enableClipboard={true}
                restrictEdit={true}
                restrictDelete={true}
                restrictAdd={true}
                restrictTypeSelection={true}
                theme={githubLightTheme}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
