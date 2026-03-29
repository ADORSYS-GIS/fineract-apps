import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Accounting } from "../pages/accounting/Accounting";

export const Route = createFileRoute("/accounting")({
	component: Accounting,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
