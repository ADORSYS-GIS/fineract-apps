import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Dashboard } from "@/components/Dashboard";

const dashboardSearchSchema = z.object({
	query: z.string().catch(""),
});

export const Route = createFileRoute("/dashboard/")({
	validateSearch: (search) => dashboardSearchSchema.parse(search),
	component: Dashboard,
});
