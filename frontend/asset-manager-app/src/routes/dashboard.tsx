import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Dashboard } from "../pages/dashboard/Dashboard";

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
