import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { IncomeCalendarPage } from "../pages/income-calendar/IncomeCalendar";

export const Route = createFileRoute("/income-calendar")({
	component: IncomeCalendarPage,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
