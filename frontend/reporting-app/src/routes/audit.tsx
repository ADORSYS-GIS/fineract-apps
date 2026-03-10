import { createFileRoute } from "@tanstack/react-router";
import { AuditTrail } from "@/pages/audit/AuditTrail";

export const Route = createFileRoute("/audit")({
	component: AuditTrail,
});
