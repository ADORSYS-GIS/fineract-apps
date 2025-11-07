import { createFileRoute } from "@tanstack/react-router";
import { CashierDetail } from "@/pages/cashier-detail/CashierDetail";

export const Route = createFileRoute("/tellers/$tellerId/cashiers/$cashierId/")(
	{
		component: CashierDetail,
		validateSearch: (search: Record<string, unknown>) => {
			return {
				page: typeof search.page === "number" ? search.page : 1,
				pageSize: typeof search.pageSize === "number" ? search.pageSize : 20,
			} as { page: number; pageSize: number };
		},
	},
);
