import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { LpManagement } from "../pages/lp-management/LpManagement";

export const Route = createFileRoute("/lp-management")({
	component: LpManagement,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
