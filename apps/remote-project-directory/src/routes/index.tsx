import { createFileRoute } from "@tanstack/react-router";
import { ProjectsTable } from "../features/projects/components/ProjectsTable";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
        </div>
      </div>

      <ProjectsTable />
    </div>
  );
}
