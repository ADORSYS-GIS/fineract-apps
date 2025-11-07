import { createFileRoute, Outlet } from "@tanstack/react-router";

function TellersOutlet() {
	return <Outlet />;
}

export const Route = createFileRoute("/tellers")({
	component: TellersOutlet,
});
