import { createFileRoute } from "@tanstack/react-router";
import { OpenSavingsAccount } from "../pages/open-savings-account/OpenSavingsAccount";

export const Route = createFileRoute("/open-savings-account/$clientId")({
	component: OpenSavingsAccount,
});
