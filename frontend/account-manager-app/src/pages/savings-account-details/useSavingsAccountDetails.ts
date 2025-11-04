import { SavingsAccountService } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useBlockAccount } from "./hooks/useBlockAccount";

export const useSavingsAccountDetails = (
	accountId: number,
	{ onBlockSuccess }: { onBlockSuccess?: () => void } = {},
) => {
	const queryClient = useQueryClient();

	const { data: account, isLoading } = useQuery({
		queryKey: ["savingsAccountDetails", accountId],
		queryFn: () =>
			SavingsAccountService.getV1SavingsaccountsByAccountId({
				accountId,
				associations: "all",
			}),
	});

	const { blockReasons, blockAccount } = useBlockAccount(
		accountId,
		onBlockSuccess,
	);

	const { mutate: unblockAccount } = useMutation({
		mutationFn: () =>
			SavingsAccountService.postV1SavingsaccountsByAccountId({
				accountId,
				command: "unblock",
				requestBody: {},
			}),
		onSuccess: () => {
			toast.success("Account unblocked successfully");
			queryClient.invalidateQueries({
				queryKey: ["savingsAccountDetails", accountId],
			});
		},
		onError: () => {
			toast.error("Failed to unblock account");
		},
	});

	const handleUnblockAccount = () => {
		unblockAccount();
	};

	return {
		account,
		isLoading,
		transactions: account?.transactions,
		blockReasons,
		blockAccount,
		unblockAccount: handleUnblockAccount,
	};
};
