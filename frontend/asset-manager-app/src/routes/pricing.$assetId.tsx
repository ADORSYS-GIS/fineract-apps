import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Pricing } from "../pages/pricing/Pricing";

export const Route = createFileRoute("/pricing/$assetId")({
	component: Pricing,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
