import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { AssetDetails } from "../pages/asset-details/AssetDetails";

export const Route = createFileRoute("/asset-details/$assetId")({
	component: AssetDetails,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
