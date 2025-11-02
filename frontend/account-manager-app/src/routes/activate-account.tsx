import { createFileRoute } from "@tanstack/react-router";
import { ActivateAccount } from "../pages/activate-account/ActivateAccount";

export const Route = createFileRoute("/activate-account")({
	component: ActivateAccount,
});
