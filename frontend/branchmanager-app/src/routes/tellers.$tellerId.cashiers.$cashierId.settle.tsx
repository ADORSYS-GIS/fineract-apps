import { createFileRoute } from "@tanstack/react-router";
import { Settle } from "../pages/cashier-actions/settle/Settle";

export const Route = createFileRoute(
	"/tellers/$tellerId/cashiers/$cashierId/settle",
)({
	component: Settle,
});
