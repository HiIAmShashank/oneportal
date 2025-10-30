import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@one-portal/ui";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of users, applications, and features in the system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-6">
        {/* Users Card */}
        <Card className="cursor-pointer transition-all hover:shadow-lg border-white/20 dark:border-white/10 bg-background/40 backdrop-blur-lg hover:bg-background/50">
          <CardHeader>
            <CardDescription className="text-md font-normal text-muted-foreground">
              Total Users
            </CardDescription>
            <CardTitle className="text-3xl font-bold">1234</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex justify-between gap-2 font-normal w-full">
              <div className="">Active Users:</div>
              <div className="text-green-500">1204</div>
            </div>
            <div className="line-clamp-1 flex justify-between gap-2 font-normal w-full">
              <div className="">Inactive Users:</div>
              <div className="text-red-500">30</div>
            </div>
          </CardFooter>
        </Card>

        {/* Applications Card */}
        <Card className="cursor-pointer transition-all hover:shadow-lg border-white/20 dark:border-white/10 bg-background/40 backdrop-blur-lg hover:bg-background/50">
          <CardHeader>
            <CardDescription className="text-md font-normal text-muted-foreground">
              Total Applications
            </CardDescription>
            <CardTitle className="text-3xl font-bold">24</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex justify-between gap-2 font-normal w-full">
              <div className="">Active Applications:</div>
              <div className="text-green-500">22</div>
            </div>
            <div className="line-clamp-1 flex justify-between gap-2 font-normal w-full">
              <div className="">Inactive Applications:</div>
              <div className="text-red-500">2</div>
            </div>
          </CardFooter>
        </Card>

        {/* Features Card */}
        <Card className="cursor-pointer transition-all hover:shadow-lg border-white/20 dark:border-white/10 bg-background/40 backdrop-blur-lg hover:bg-background/50">
          <CardHeader>
            <CardDescription className="text-md font-normal text-muted-foreground">
              Total Features
            </CardDescription>
            <CardTitle className="text-3xl font-bold">156</CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex justify-between gap-2 font-normal w-full">
              <div className="">Active Features:</div>
              <div className="text-green-500">142</div>
            </div>
            <div className="line-clamp-1 flex justify-between gap-2 font-normal w-full">
              <div>Inactive Features:</div>
              <div className="text-red-500">14</div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
