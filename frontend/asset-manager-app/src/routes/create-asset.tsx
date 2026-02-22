import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { CreateAsset } from "../pages/create-asset/CreateAsset";

export const Route = createFileRoute("/create-asset")({
	component: CreateAsset,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
