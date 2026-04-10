import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { IncomeHistoryView } from "@/pages/income-history/IncomeHistory.view";

export const Route = createFileRoute("/income-history")({
	component: IncomeHistoryView,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
