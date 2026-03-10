import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { OrderResolution } from "../pages/order-resolution/OrderResolution";

export const Route = createFileRoute("/order-resolution")({
	component: OrderResolution,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
