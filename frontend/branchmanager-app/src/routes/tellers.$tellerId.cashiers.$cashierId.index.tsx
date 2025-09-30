import { createFileRoute } from "@tanstack/react-router";
import { CashierDetail } from "../pages/cashier-detail/CashierDetail";

export const Route = createFileRoute("/tellers/$tellerId/cashiers/$cashierId/")(
	{
		component: CashierDetail,
	},
);
