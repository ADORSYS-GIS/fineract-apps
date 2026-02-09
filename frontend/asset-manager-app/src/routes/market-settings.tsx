import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { MarketSettings } from "../pages/market-settings/MarketSettings";

export const Route = createFileRoute("/market-settings")({
	component: MarketSettings,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
