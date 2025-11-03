import { createFileRoute } from "@tanstack/react-router";
import { Unauthorized } from "../components/Unauthorized";

export const Route = createFileRoute("/unauthorized")({
  component: Unauthorized,
});
