import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Settlement } from "../pages/settlement/Settlement";

export const Route = createFileRoute("/settlement")({
	component: Settlement,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
