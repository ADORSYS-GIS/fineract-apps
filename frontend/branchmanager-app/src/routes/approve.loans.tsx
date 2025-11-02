import { createFileRoute, Outlet } from "@tanstack/react-router";
import { z } from "zod";

const loanSearchSchema = z.object({
	q: z.string().catch(""),
});

export const Route = createFileRoute("/approve/loans")({
	component: Outlet,
	validateSearch: (search) => loanSearchSchema.parse(search),
});
