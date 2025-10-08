import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Dashboard } from "@/components/Dashboard";

const dashboardSearchSchema = z.object({
	query: z.string().optional().catch(""),
	page: z.number().int().positive().optional().catch(1),
	limit: z.number().int().positive().optional().catch(10),
});

export const Route = createFileRoute("/dashboard/")({
	validateSearch: (search) => dashboardSearchSchema.parse(search),
	component: Dashboard,
});
