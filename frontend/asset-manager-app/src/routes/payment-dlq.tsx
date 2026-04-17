import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { PaymentDlqPage } from "../pages/payment-dlq/PaymentDlq";

export const Route = createFileRoute("/payment-dlq")({
	component: PaymentDlqPage,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
