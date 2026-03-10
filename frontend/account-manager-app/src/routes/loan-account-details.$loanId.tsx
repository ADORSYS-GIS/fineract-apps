import { createFileRoute } from "@tanstack/react-router";
import { LoanDetails } from "../pages/loan-details/LoanDetails";

export const Route = createFileRoute("/loan-account-details/$loanId")({
	component: LoanDetails,
});
