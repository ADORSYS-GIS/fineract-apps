import { createFileRoute } from "@tanstack/react-router";
import { ApproveAccount } from "@/pages/approve-account/ApproveAccount";

export const Route = createFileRoute("/approve/account")({
	component: ApproveAccount,
});
