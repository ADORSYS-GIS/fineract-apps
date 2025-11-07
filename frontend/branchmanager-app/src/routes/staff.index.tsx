import { createFileRoute } from "@tanstack/react-router";
import { Staff } from "@/pages/staff/Staff";

export const Route = createFileRoute("/staff/")({
	component: Staff,
});
