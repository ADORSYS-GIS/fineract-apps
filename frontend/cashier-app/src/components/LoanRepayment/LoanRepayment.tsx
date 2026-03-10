import {
	ApiError,
	GetLoansLoanIdResponse,
	LoansService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Route } from "@/routes/repayment/$loanId";
import { LoanRepaymentView } from "./LoanRepayment.view";
import { useRepaymentForm } from "./useRepaymentForm";

export function LoanRepayment() {
	const { t } = useTranslation();
	const { loanId } = Route.useParams();
	const [transactionId, setTransactionId] = useState<number | null>(null);
	const {
		data: loan,
		isLoading,
		error,
		refetch,
	} = useQuery<GetLoansLoanIdResponse, ApiError>({
		queryKey: ["loan", loanId],
		queryFn: () =>
			LoansService.getV1LoansByLoanId({ loanId: Number.parseInt(loanId, 10) }),
	});

	const repaymentForm = useRepaymentForm(
		Number.parseInt(loanId, 10),
		setTransactionId,
		refetch,
	);

	if (isLoading) {
		return <div>{t("loadingLoanDetails")}</div>;
	}

	if (error) {
		return (
			<div>{t("errorFetchingLoanDetails", { message: error.message })}</div>
		);
	}

	if (!loan) {
		return <div>{t("loanNotFound")}</div>;
	}

	return (
		<LoanRepaymentView
			loan={loan}
			{...repaymentForm}
			isSubmitting={repaymentForm.isLoading}
			transactionId={transactionId}
			setTransactionId={setTransactionId}
		/>
	);
}
