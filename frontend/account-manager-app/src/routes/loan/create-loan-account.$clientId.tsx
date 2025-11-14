import { createFileRoute } from "@tanstack/react-router";
import { CreateLoanAccount } from "../../pages/loan/create-loan-account/CreateLoanAccount";

export const Route = createFileRoute("/loan/create-loan-account/$clientId")({
	component: CreateLoanAccount,
});
