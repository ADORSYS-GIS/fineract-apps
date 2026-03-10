import { createFileRoute } from "@tanstack/react-router";
import { TransactionHistory } from "@/pages/transactions/TransactionHistory";

export const Route = createFileRoute("/transactions")({
	component: TransactionHistory,
});
