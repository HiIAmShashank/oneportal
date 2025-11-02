import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@one-portal/ui";
import { useUsers } from "../features/users/hooks/useUsers";
import { useApplications } from "../features/applications/hooks/useApplications";
import { useFeatures } from "../features/features/hooks/useFeatures";
import { DynamicIcon } from "../components/DynamicIcon";
import { ArrowRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  component: DashboardPage,
  staticData: {
    title: "Dashboard",
  },
});

function DashboardPage() {
  // Fetch live data
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();
  const {
    data: applications = [],
    isLoading: appsLoading,
    error: appsError,
  } = useApplications();
  const {
    data: features = [],
    isLoading: featuresLoading,
    error: featuresError,
  } = useFeatures();

  // Calculate statistics
  const userStats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
  };

  const appStats = {
    total: applications.length,
    active: applications.filter((a) => a.isActive).length,
    inactive: applications.filter((a) => !a.isActive).length,
  };

  const featureStats = {
    total: features.length,
    active: features.filter((f) => f.isActive).length,
    inactive: features.filter((f) => !f.isActive).length,
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage your users, applications, and features
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Users Card */}
        <Link to="/dashboard/users" className="group">
          <Card className="relative overflow-hidden transition-all hover:shadow-xl border-2 hover:border-primary/50 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <DynamicIcon name="UserCog" className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Users
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {usersLoading ? (
                <Skeleton className="h-12 w-32 mt-4" />
              ) : usersError ? (
                <CardTitle className="text-2xl font-bold text-destructive mt-4">
                  Error
                </CardTitle>
              ) : (
                <CardTitle className="text-4xl font-bold mt-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  {userStats.total.toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              {usersLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : usersError ? (
                <p className="text-xs text-destructive">
                  Failed to load users data
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-lg text-muted-foreground">
                        Active
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {userStats.active}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-lg text-muted-foreground">
                        Inactive
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {userStats.inactive}
                    </span>
                  </div>
                  {userStats.total > 0 && (
                    <div className="w-full mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {((userStats.active / userStats.total) * 100).toFixed(
                            1,
                          )}
                          % active
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(userStats.active / userStats.total) * 100}%`,
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

        {/* Applications Card */}
        <Link to="/dashboard/applications" className="group">
          <Card className="relative overflow-hidden transition-all hover:shadow-xl border-2 hover:border-primary/50 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <DynamicIcon name="Box" className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Applications
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {appsLoading ? (
                <Skeleton className="h-12 w-32 mt-4" />
              ) : appsError ? (
                <CardTitle className="text-2xl font-bold text-destructive mt-4">
                  Error
                </CardTitle>
              ) : (
                <CardTitle className="text-4xl font-bold mt-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  {appStats.total.toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              {appsLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : appsError ? (
                <p className="text-xs text-destructive">
                  Failed to load applications data
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-lg text-muted-foreground">
                        Active
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {appStats.active}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-lg text-muted-foreground">
                        Inactive
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {appStats.inactive}
                    </span>
                  </div>
                  {appStats.total > 0 && (
                    <div className="w-full mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {((appStats.active / appStats.total) * 100).toFixed(
                            1,
                          )}
                          % active
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(appStats.active / appStats.total) * 100}%`,
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

        {/* Features Card */}
        <Link to="/dashboard/features" className="group">
          <Card className="relative overflow-hidden transition-all hover:shadow-xl border-2 hover:border-primary/50 h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <DynamicIcon name="Layers" className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Features
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              {featuresLoading ? (
                <Skeleton className="h-12 w-32 mt-4" />
              ) : featuresError ? (
                <CardTitle className="text-2xl font-bold text-destructive mt-4">
                  Error
                </CardTitle>
              ) : (
                <CardTitle className="text-4xl font-bold mt-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                  {featureStats.total.toLocaleString()}
                </CardTitle>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              {featuresLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </>
              ) : featuresError ? (
                <p className="text-xs text-destructive">
                  Failed to load features data
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-lg text-muted-foreground">
                        Active
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {featureStats.active}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-lg text-muted-foreground">
                        Inactive
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {featureStats.inactive}
                    </span>
                  </div>
                  {featureStats.total > 0 && (
                    <div className="w-full mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-muted-foreground">
                          {(
                            (featureStats.active / featureStats.total) *
                            100
                          ).toFixed(1)}
                          % active
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(featureStats.active / featureStats.total) * 100}%`,
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
      </div>
    </div>
  );
}
