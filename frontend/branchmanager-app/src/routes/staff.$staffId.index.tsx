import { createFileRoute } from "@tanstack/react-router";
import { StaffDetail } from "../pages/staff-detail/StaffDetail";

export const Route = createFileRoute("/staff/$staffId/")({
	component: StaffDetail,
});
