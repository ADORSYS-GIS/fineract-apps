import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { LPPerformance } from "../pages/lp-performance/LPPerformance";

export const Route = createFileRoute("/lp-performance")({
	component: LPPerformance,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
