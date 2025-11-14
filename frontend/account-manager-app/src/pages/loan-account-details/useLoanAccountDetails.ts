import { LoansService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useLoanAccountDetails = (loanId: number) => {
	const { data: account, isLoading } = useQuery({
		queryKey: ["loanAccountDetails", loanId],
		queryFn: () =>
			LoansService.getV1LoansByLoanId({
				loanId,
				associations: "all",
			}),
	});
	return {
		account,
		isLoading,
		transactions: account?.transactions,
	};
};
