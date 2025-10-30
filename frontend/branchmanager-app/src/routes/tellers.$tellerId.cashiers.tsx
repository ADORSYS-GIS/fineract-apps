import { createFileRoute, Outlet } from "@tanstack/react-router";

function CashiersLayout() {
	return <Outlet />;
}

export const Route = createFileRoute("/tellers/$tellerId/cashiers")({
	component: CashiersLayout,
});
