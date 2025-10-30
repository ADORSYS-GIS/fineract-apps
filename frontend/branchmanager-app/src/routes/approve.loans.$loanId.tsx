import { createFileRoute } from "@tanstack/react-router";
import { LoanReview } from "@/pages/loan-review/LoanReview";

export const Route = createFileRoute("/approve/loans/$loanId")({
	component: LoanReview,
});
