import { createFileRoute } from "@tanstack/react-router";
import { RemoteMount } from "../components/RemoteMount";
import { useApplications } from "../hooks/useApplications";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { NotFoundState } from "../components/NotFoundState";

export const Route = createFileRoute("/apps/$moduleName")({
  component: AppComponent,
});

function AppComponent() {
  const { moduleName } = Route.useParams();
  const { data: apps = [], isLoading, error } = useApplications();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  const app = apps.find((a) => a.moduleName === moduleName);

  if (!app) {
    return (
      <NotFoundState
        title="Application Not Found"
        message="The application"
        identifier={moduleName}
      />
    );
  }

  return <RemoteMount app={app} />;
}
