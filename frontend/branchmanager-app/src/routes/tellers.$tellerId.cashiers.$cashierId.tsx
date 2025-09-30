import { createFileRoute, Outlet } from "@tanstack/react-router";

function CashierDetailLayout() {
	return <Outlet />;
}

export const Route = createFileRoute("/tellers/$tellerId/cashiers/$cashierId")({
	component: CashierDetailLayout,
});
