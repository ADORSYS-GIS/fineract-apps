import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Reconciliation } from "../pages/reconciliation/Reconciliation";

export const Route = createFileRoute("/reconciliation")({
	component: Reconciliation,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
