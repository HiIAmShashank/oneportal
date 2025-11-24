import { createFileRoute } from "@tanstack/react-router";
import { useUserContext } from "../contexts/UserContext";
import { MyProjectsTable } from "../features/projects/components/MyProjectsTable";

export const Route = createFileRoute("/my-projects")({
  component: MyProjectsPage,
});

function MyProjectsPage() {
  const { user } = useUserContext();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
        </div>
      </div>

      <MyProjectsTable projects={user?.favouriteProjects || []} />
    </div>
  );
}
