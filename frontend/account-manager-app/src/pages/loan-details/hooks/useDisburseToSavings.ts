import { PostLoansLoanIdRequest } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fineractApi } from "@/services/api";

export const useDisburseToSavings = (
	loanId: number,
	loanExternalId?: string,
) => {
	const queryClient = useQueryClient();

	const { data: template, isLoading: isTemplateLoading } = useQuery({
		queryKey: ["disburseToSavingsTemplate", loanId],
		queryFn: () =>
			fineractApi.loanTransactions.getV1LoansExternalIdByLoanExternalIdTransactionsTemplate(
				{
					loanExternalId: loanExternalId ?? "",
					command: "disburseToSavings",
				},
			),
	});

	const { mutate: disburseToSavings, isPending: isDisbursing } = useMutation({
		mutationFn: (data: PostLoansLoanIdRequest) =>
			fineractApi.loans.postV1LoansByLoanId({
				loanId,
				command: "disbursetosavings",
				requestBody: data,
			}),
		onSuccess: () => {
			toast.success("Loan disbursed to savings successfully");
			queryClient.invalidateQueries({ queryKey: ["loan", String(loanId)] });
			queryClient.invalidateQueries({
				queryKey: ["loanAccountDetails", loanId],
			});
		},
		onError: () => {
			toast.error("Failed to disburse loan to savings");
		},
	});

	return { template, isTemplateLoading, disburseToSavings, isDisbursing };
};
