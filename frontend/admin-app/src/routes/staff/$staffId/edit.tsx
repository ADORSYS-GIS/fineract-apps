import { createFileRoute } from "@tanstack/react-router";
import { EditStaff } from "@/components/EditStaff";

export const Route = createFileRoute("/staff/$staffId/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	return <EditStaff />;
}
