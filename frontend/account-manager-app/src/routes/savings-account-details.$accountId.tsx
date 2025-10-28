import { createFileRoute } from "@tanstack/react-router";
import { SavingsAccountDetails } from "../pages/savings-account-details/SavingsAccountDetails";

export const Route = createFileRoute("/savings-account-details/$accountId")({
	component: SavingsAccountDetails,
});
