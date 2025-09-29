import { createFileRoute } from "@tanstack/react-router";
import { StaffAssign } from "../pages/staff-assign/StaffAssign";

export const Route = createFileRoute("/staff/$staffId/assign")({
	component: StaffAssign,
});
