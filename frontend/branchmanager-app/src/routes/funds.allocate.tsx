import { createFileRoute } from "@tanstack/react-router";
import AllocateFunds from "../pages/funds/allocate/AllocateFunds";

export const Route = createFileRoute("/funds/allocate")({
	component: AllocateFunds,
});
