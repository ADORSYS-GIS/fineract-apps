import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/repayment/")({
	component: RepaymentComponent,
});

import { LoanSearchView } from "../../components/LoanSearch/LoanSearch.view";

function RepaymentComponent() {
	return (
		<div className="p-4">
			<h1 className="text-xl font-semibold">Loan Repayment</h1>
			<p className="mb-4">
				Search for a loan account to start the repayment process.
			</p>
			<LoanSearchView />
		</div>
	);
}
