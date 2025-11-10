import { createFileRoute } from "@tanstack/react-router";
import { StaffDetails } from "@/components/StaffDetails";

export const Route = createFileRoute("/staff/$staffId/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <StaffDetails />;
}
