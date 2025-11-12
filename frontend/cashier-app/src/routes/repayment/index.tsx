import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LoanSearchView } from "../../components/LoanSearch/LoanSearch.view";

export const Route = createFileRoute("/repayment/")({
	component: RepaymentComponent,
});

function RepaymentComponent() {
	const { t } = useTranslation();
	return (
		<div className="p-4">
			<h1 className="text-xl font-semibold">{t("loanRepayment")}</h1>
			<p className="mb-4">{t("searchForLoanAccount")}</p>
			<LoanSearchView />
		</div>
	);
}
