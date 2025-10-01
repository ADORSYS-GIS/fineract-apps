import { createFileRoute } from "@tanstack/react-router";
import { TellerCreate } from "../pages/teller-create/TellerCreate";

export const Route = createFileRoute("/tellers/create")({
	component: TellerCreate,
});
