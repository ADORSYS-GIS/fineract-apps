import { createFileRoute, Outlet } from "@tanstack/react-router";

function StaffOutletOnly() {
	return <Outlet />;
}

export const Route = createFileRoute("/staff")({
	component: StaffOutletOnly,
});
