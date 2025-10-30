import { createFileRoute } from "@tanstack/react-router";
import { PendingLoans } from "@/pages/pending-loans/PendingLoans";

export const Route = createFileRoute("/approve/loans")({
	component: PendingLoans,
});
