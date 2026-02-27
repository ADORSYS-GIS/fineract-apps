import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { PaymentResults } from "../pages/payment-results/PaymentResults";

export const Route = createFileRoute("/payment-results/$paymentId")({
	component: PaymentResults,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
