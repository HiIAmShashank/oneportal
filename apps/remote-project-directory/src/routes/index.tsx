import { useUserContext } from "../contexts/UserContext";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const { user } = useUserContext();
  console.log("User from context:", user);
  return <div className="p-6 space-y-6"></div>;
}
