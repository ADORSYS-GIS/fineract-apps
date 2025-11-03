import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { fineractApi } from "@/services/api";

export const useLoanDetails = () => {
	const { loanId } = useParams({ from: "/loan-account-details/$loanId" });

	const { data: loan, isLoading } = useQuery({
		queryKey: ["loan", loanId],
		queryFn: () =>
			fineractApi.loans.getV1LoansByLoanId({
				loanId: Number(loanId),
				associations: "all",
				exclude: "guarantors,futureSchedule",
			}),
	});

	return {
		loan,
		isLoading,
	};
};
