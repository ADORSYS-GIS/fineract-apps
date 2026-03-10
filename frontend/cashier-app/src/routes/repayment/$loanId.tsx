import { createFileRoute } from "@tanstack/react-router";
import { LoanRepayment } from "@/components/LoanRepayment";

export const Route = createFileRoute("/repayment/$loanId")({
	component: LoanRepayment,
});
