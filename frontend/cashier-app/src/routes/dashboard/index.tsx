import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Dashboard } from "@/components/Dashboard";

const dashboardSearchSchema = z.object({
	query: z.string().optional().default(""),
	page: z.coerce.number().int().positive().optional().default(1),
	limit: z.coerce.number().int().positive().optional().default(10),
});

export const Route = createFileRoute("/dashboard/")({
	validateSearch: (search) => dashboardSearchSchema.parse(search),
	component: Dashboard,
});
