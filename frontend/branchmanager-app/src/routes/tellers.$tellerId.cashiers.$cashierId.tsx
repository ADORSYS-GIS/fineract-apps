import { createFileRoute, Outlet } from "@tanstack/react-router";

function CashierDetailLayout() {
	return <Outlet />;
}

export const Route = createFileRoute("/tellers/$tellerId/cashiers/$cashierId")({
	component: CashierDetailLayout,
	validateSearch: (search: Record<string, unknown>) => {
		return {
			page: typeof search.page === "number" ? search.page : 1,
			pageSize: typeof search.pageSize === "number" ? search.pageSize : 10,
		};
	},
});
