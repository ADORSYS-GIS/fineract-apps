import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { Inventory } from "../pages/inventory/Inventory";

export const Route = createFileRoute("/inventory")({
	component: Inventory,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
