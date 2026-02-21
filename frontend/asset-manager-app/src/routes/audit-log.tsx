import { createFileRoute } from "@tanstack/react-router";
import { ErrorFallback } from "@/components/ErrorFallback";
import { AuditLogPage } from "../pages/audit-log/AuditLog";

export const Route = createFileRoute("/audit-log")({
	component: AuditLogPage,
	errorComponent: ({ error, reset }) => (
		<ErrorFallback error={error as Error} onRetry={reset} />
	),
});
