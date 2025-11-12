import {
	ApiError,
	GetLoansLoanIdTransactionsTransactionIdResponse,
	LoanTransactionsService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useReceipt = (loanId: number, transactionId: number) => {
	return useQuery<GetLoansLoanIdTransactionsTransactionIdResponse, ApiError>({
		queryKey: ["transaction", loanId, transactionId],
		queryFn: () =>
			LoanTransactionsService.getV1LoansByLoanIdTransactionsByTransactionId({
				loanId,
				transactionId,
			}),
	});
};
