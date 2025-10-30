import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "../../features/roles/components/RolesPage";

export const Route = createFileRoute("/dashboard/roles")({
  component: RolesPage,
});
