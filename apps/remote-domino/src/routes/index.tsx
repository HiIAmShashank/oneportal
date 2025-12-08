import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@one-portal/ui";
import { useEvents } from "../hooks/useEvents";
import { useEventTypes } from "../hooks/useEventTypes";
import { useApplications } from "../hooks/useApplications";
import { DynamicIcon } from "../components/DynamicIcon";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useSubscriptions } from "../hooks/useSubscriptions";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  // Fetch live data
  const {
    data: eventsData,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents({ pageNumber: 1, pageSize: 1000 });

  const {
    data: eventTypesData,
    isLoading: eventTypesLoading,
    error: eventTypesError,
  } = useEventTypes();

  const {
    data: applicationsData,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useApplications();

  const {
    data: subscriptionsData,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
  } = useSubscriptions();

  // Calculate event statistics
  const eventStats = {
    total: eventsData?.totalCount ?? 0,
    secure: eventsData?.data.filter((e) => e.isSecure).length ?? 0,
    nonSecure: eventsData?.data.filter((e) => !e.isSecure).length ?? 0,
  };

  const eventTypeStats = {
    total: eventTypesData?.totalCount ?? 0,
  };

  const subscriptionsStats = {
    total: subscriptionsData?.totalCount ?? 0,
  };

  const applicationStats = {
    total: applicationsData?.totalCount ?? 0,
    withSecure:
      applicationsData?.data.filter((a) => a.hasSecureAccess).length ?? 0,
    withoutSecure:
      applicationsData?.data.filter((a) => !a.hasSecureAccess).length ?? 0,
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor the Event System
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Events Card */}
        <Link to="/events" className="group">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <DynamicIcon name="Activity" className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Events
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {eventsLoading ? (
                <Skeleton className="h-12 w-32 mt-4" />
              ) : eventsError ? (
                <CardTitle className="text-2xl font-bold text-destructive mt-4">
                  Error
                </CardTitle>
              ) : (
                <CardTitle className="text-4xl font-bold mt-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                  {eventStats.total.toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              {eventsLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : eventsError ? (
                <p className="text-xs text-destructive">
                  Failed to load events data
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-lg text-muted-foreground">
                        Secure
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {eventStats.secure}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-lg text-muted-foreground">
                        Non-Secure
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      {eventStats.nonSecure}
                    </span>
                  </div>
                  {eventStats.total > 0 && (
                    <div className="w-full mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {(
                            (eventStats.secure / eventStats.total) *
                            100
                          ).toFixed(1)}
                          % secure
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                          className="bg-linear-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(eventStats.secure / eventStats.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </Link>

        {/* Event Types Card */}
        <Link to="/event-types" className="group">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <DynamicIcon name="Tag" className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Event Types
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {eventTypesLoading ? (
                <Skeleton className="h-12 w-32 mt-4" />
              ) : eventTypesError ? (
                <CardTitle className="text-2xl font-bold text-destructive mt-4">
                  Error
                </CardTitle>
              ) : (
                <CardTitle className="text-4xl font-bold mt-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                  {eventTypeStats.total.toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              {eventTypesLoading ? (
                <Skeleton className="h-4 w-full" />
              ) : eventTypesError ? (
                <p className="text-xs text-destructive">
                  Failed to load event types data
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Registered event type definitions in the system
                </p>
              )}
            </CardFooter>
          </Card>
        </Link>

        {/* Applications Card */}
        <Link to="/applications" className="group">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <DynamicIcon name="AppWindow" className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Applications
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {applicationsLoading ? (
                <Skeleton className="h-12 w-32 mt-4" />
              ) : applicationsError ? (
                <CardTitle className="text-2xl font-bold text-destructive mt-4">
                  Error
                </CardTitle>
              ) : (
                <CardTitle className="text-4xl font-bold mt-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                  {applicationStats.total.toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              {applicationsLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : applicationsError ? (
                <p className="text-xs text-destructive">
                  Failed to load applications data
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-lg text-muted-foreground">
                        Secure Access
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {applicationStats.withSecure}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-lg text-muted-foreground">
                        Standard
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      {applicationStats.withoutSecure}
                    </span>
                  </div>
                  {applicationStats.total > 0 && (
                    <div className="w-full mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {(
                            (applicationStats.withSecure /
                              applicationStats.total) *
                            100
                          ).toFixed(1)}
                          % with secure access
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                          className="bg-linear-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(applicationStats.withSecure / applicationStats.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardFooter>
          </Card>
        </Link>

        {/* Subscriptions Card */}
        <Link to="/subscriptions" className="group">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                    <DynamicIcon name="Key" className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Subscriptions
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {subscriptionsLoading ? (
                <Skeleton className="h-12 w-32 mt-4" />
              ) : subscriptionsError ? (
                <CardTitle className="text-2xl font-bold text-destructive mt-4">
                  Error
                </CardTitle>
              ) : (
                <CardTitle className="text-4xl font-bold mt-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                  {subscriptionsStats.total.toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              {subscriptionsLoading ? (
                <Skeleton className="h-4 w-full" />
              ) : subscriptionsError ? (
                <p className="text-xs text-destructive">
                  Failed to load subscriptions data
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Registered subscription definitions in the system
                </p>
              )}
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  );
}
