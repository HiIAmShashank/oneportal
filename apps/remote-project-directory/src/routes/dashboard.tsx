import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";
import { useUserContext } from "../contexts/UserContext";
import { FolderOpen, Activity, ArrowRight, Star } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useUserContext();

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Overview of Project Directory
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Projects Card */}
        <Link to="/" className="group">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Total Projects
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="text-4xl font-bold mt-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                1,234
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              <p className="text-sm text-muted-foreground">
                Active projects in the directory
              </p>
            </CardFooter>
          </Card>
        </Link>

        {/* My Favorites Card */}
        <Link to="/my-projects" className="group">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Star className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    My Favorites
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <CardTitle className="text-4xl font-bold mt-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                {user?.favouriteProjects.length || 0}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              <p className="text-sm text-muted-foreground">
                Projects you have bookmarked
              </p>
            </CardFooter>
          </Card>
        </Link>

        {/* Recent Activity Card */}
        <div className="group">
          <Card className="border border-white/20 dark:border-white/10 shadow-xl bg-background/40 backdrop-blur-lg hover:bg-background/50 transition-all relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Activity className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-lg font-medium text-muted-foreground">
                    Recent Activity
                  </CardDescription>
                </div>
              </div>
              <CardTitle className="text-4xl font-bold mt-4 bg-linear-to-br from-foreground to-foreground/70 bg-clip-text">
                24
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-3 pt-0">
              <p className="text-sm text-muted-foreground">
                Latest updates across projects
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-white/20 dark:border-white/10 shadow-md bg-background/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
            Placeholder Chart
          </CardContent>
        </Card>
        <Card className="border border-white/20 dark:border-white/10 shadow-md bg-background/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
            Placeholder List
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
