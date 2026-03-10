import { createFileRoute } from "@tanstack/react-router";
import { ReportsCatalog } from "@/pages/reports/ReportsCatalog";

export const Route = createFileRoute("/reports")({
	component: ReportsCatalog,
});
