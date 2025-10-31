import { SavingsAccountService } from "@fineract-apps/fineract-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteSavingsAccount = (clientId: string) => {
	const queryClient = useQueryClient();

	return useMutation<unknown, Error, number>({
		mutationFn: (accountId) =>
			SavingsAccountService.deleteV1SavingsaccountsByAccountId({ accountId }),
		onSuccess: () => {
			toast.success("Account deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["accounts", clientId] });
		},
		onError: (error) => {
			toast.error(
				error.message || "An error occurred while deleting the account.",
			);
		},
	});
};
