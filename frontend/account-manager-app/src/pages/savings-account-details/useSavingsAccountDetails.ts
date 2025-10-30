import {
	CodeValuesService,
	PostSavingsAccountsAccountIdRequest,
	SavingsAccountService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

export const useSavingsAccountDetails = (accountId: number) => {
	const [isBlockModalOpen, setBlockModalOpen] = useState(false);

	const openBlockModal = () => setBlockModalOpen(true);
	const closeBlockModal = () => setBlockModalOpen(false);
	const queryClient = useQueryClient();

	const { data: account, isLoading } = useQuery({
		queryKey: ["savingsAccountDetails", accountId],
		queryFn: () =>
			SavingsAccountService.getV1SavingsaccountsByAccountId({
				accountId,
				associations: "all",
			}),
	});

	const { data: blockReasons } = useQuery({
		queryKey: ["blockReasons"],
		queryFn: () =>
			CodeValuesService.getV1CodesByCodeIdCodevalues({
				codeId: 35,
			}),
	});

	const { mutate: blockAccount } = useMutation({
		mutationFn: (data: { reasonId: number; reasonName?: string }) => {
			const formattedDate = new Date().toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			});

			return SavingsAccountService.postV1SavingsaccountsByAccountId({
				accountId,
				command: "block",
				requestBody: {
					reasonForBlock: data.reasonName,
					dateFormat: "dd MMMM yyyy",
					locale: "en",
					transactionDate: formattedDate,
					blockReasonId: data.reasonId,
				} as PostSavingsAccountsAccountIdRequest,
			});
		},
		onSuccess: () => {
			toast.success("Account blocked successfully");
			queryClient.invalidateQueries({
				queryKey: ["savingsAccountDetails", accountId],
			});
			closeBlockModal();
		},
		onError: () => {
			toast.error("Failed to block account");
		},
	});

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

	const handleBlockAccount = (reasonId: number) => {
		const reason = blockReasons?.find((r) => r.id === reasonId);
		if (reason?.name) {
			blockAccount({ reasonId, reasonName: reason.name });
		} else {
			toast.error("Invalid reason selected. Please try again.");
		}
	};

	const handleUnblockAccount = () => {
		unblockAccount();
	};

	return {
		account,
		isLoading,
		transactions: account?.transactions,
		blockReasons,
		blockAccount: handleBlockAccount,
		unblockAccount: handleUnblockAccount,
		isBlockModalOpen,
		openBlockModal,
		closeBlockModal,
	};
};
