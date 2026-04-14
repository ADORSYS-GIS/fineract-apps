import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Portfolio } from "../pages/portfolio/Portfolio";

export const Route = createFileRoute("/portfolio")({
	component: Portfolio,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
