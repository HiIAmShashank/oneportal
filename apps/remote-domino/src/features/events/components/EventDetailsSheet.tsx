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
import { Separator } from "@one-portal/ui";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileJson,
  Network,
  Shield,
} from "lucide-react";
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
  const jobProgress =
    event.jobCount > 0
      ? Math.round((event.jobCompletedCount / event.jobCount) * 100)
      : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl overflow-y-auto">
        <SheetHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl">Event Details</SheetTitle>
              <SheetDescription className="mt-1">
                {event.application}
              </SheetDescription>
            </div>
            <Badge
              variant={event.isSecure ? "default" : "secondary"}
              className="flex items-center gap-1.5"
            >
              <Shield className="h-3 w-3" />
              {event.isSecure ? "Secure" : "Public"}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Event Type - Prominent */}
          <div className="flex items-start gap-3">
            <FileJson className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Event Type
              </p>
              <p className="mt-1 text-base font-semibold break-all">
                {event.eventType}
              </p>
            </div>
          </div>

          <Separator />

          {/* Event & Correlation IDs */}
          <div className="flex gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Event ID
              </p>
              <p className="mt-1 text-sm break-all">{event.eventID}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Correlation ID
              </p>
              <p className="mt-1 text-sm break-all">{event.correlationID}</p>
            </div>
          </div>

          <Separator />

          {/* Job Progress */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Job Progress</h3>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {event.jobCompletedCount} of {event.jobCount} completed
                </span>
                <span className="font-semibold">{jobProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 rounded-full"
                  style={{ width: `${jobProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Resource Information */}
          {(event.resourceID || event.resourceType) && (
            <>
              <Separator />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Resource</h3>
                </div>
                <div className="flex gap-6">
                  {event.resourceID && (
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Resource ID
                      </p>
                      <p className="mt-1 text-sm">{event.resourceID}</p>
                    </div>
                  )}
                  {event.resourceType && (
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Resource Type
                      </p>
                      <p className="mt-1 text-sm">{event.resourceType}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Timeline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Timeline</h3>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="w-px h-full bg-border mt-1.5" />
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Created
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    {formatDate(event.utcCreatedDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Last Activity
                  </p>
                  <p className="mt-0.5 text-sm font-medium">
                    {formatDate(event.utcLastActivityDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Event Data */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Event Data</h3>
            </div>
            <div className="rounded-lg border p-3">
              <JsonEditor
                data={eventDataParsed}
                rootName="eventData"
                collapse={1}
                enableClipboard={true}
                restrictEdit={true}
                restrictDelete={true}
                restrictAdd={true}
                restrictTypeSelection={true}
                theme={githubLightTheme}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
