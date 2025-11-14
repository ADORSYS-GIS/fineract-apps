import { PostLoansLoanIdRequest } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { fineractApi } from "@/services/api";

export const useDisburseLoan = (loanId: number, loanExternalId?: string) => {
	const queryClient = useQueryClient();

	const { data: template, isLoading: isTemplateLoading } = useQuery({
		queryKey: ["disburseTemplate", loanId],
		queryFn: () =>
			fineractApi.loanTransactions.getV1LoansExternalIdByLoanExternalIdTransactionsTemplate(
				{
					loanExternalId: loanExternalId ?? "",
					command: "disburse",
				},
			),
	});

	const { mutate: disburseLoan, isPending: isDisbursing } = useMutation({
		mutationFn: (data: PostLoansLoanIdRequest) =>
			fineractApi.loans.postV1LoansByLoanId({
				loanId,
				command: "disburse",
				requestBody: data,
			}),
		onSuccess: () => {
			toast.success("Loan disbursed successfully");
			queryClient.invalidateQueries({ queryKey: ["loan", String(loanId)] });
			queryClient.invalidateQueries({
				queryKey: ["loanAccountDetails", loanId],
			});
		},
		onError: () => {
			toast.error("Failed to disburse loan");
		},
	});

	return { template, isTemplateLoading, disburseLoan, isDisbursing };
};
