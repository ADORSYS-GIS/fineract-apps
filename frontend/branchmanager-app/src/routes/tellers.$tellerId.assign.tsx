import { createFileRoute } from "@tanstack/react-router";
import { TellerAssign } from "../pages/teller-assign/TellerAssign";

export const Route = createFileRoute("/tellers/$tellerId/assign")({
	component: TellerAssign,
});
