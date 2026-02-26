import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { ScheduledPayments } from "../pages/scheduled-payments/ScheduledPayments";

export const Route = createFileRoute("/scheduled-payments")({
	component: ScheduledPayments,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
