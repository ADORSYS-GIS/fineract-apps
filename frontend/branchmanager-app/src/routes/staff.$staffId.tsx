import { createFileRoute, Outlet } from "@tanstack/react-router";

function StaffMemberLayout() {
	return <Outlet />;
}

export const Route = createFileRoute("/staff/$staffId")({
	component: StaffMemberLayout,
});
