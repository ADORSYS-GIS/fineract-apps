import { LoansService } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteLoanAccount = (clientId: string) => {
	const queryClient = useQueryClient();

	return useMutation<unknown, Error, number>({
		mutationFn: (loanId) =>
			LoansService.deleteV1LoansByLoanId({ loanId }),
		onSuccess: () => {
			toast.success("Loan account deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["accounts", clientId] });
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while deleting the loan account.",
			);
		},
	});
};
