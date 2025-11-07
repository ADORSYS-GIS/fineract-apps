import { createFileRoute, Outlet } from "@tanstack/react-router";

function TellerDetailLayout() {
	return <Outlet />;
}

export const Route = createFileRoute("/tellers/$tellerId")({
	component: TellerDetailLayout,
});
