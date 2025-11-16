import { createFileRoute } from "@tanstack/react-router";
import { DashboardContainer } from "./DashboardContainer";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardContainer,
});
