import {
	CodeValuesService,
	PostSavingsAccountsAccountIdRequest,
	SavingsAccountService,
} from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBlockAccount = (
	accountId: number,
	onBlockSuccess?: () => void,
) => {
	const queryClient = useQueryClient();

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
			onBlockSuccess?.();
		},
		onError: () => {
			toast.error("Failed to block account");
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

	return {
		blockReasons,
		blockAccount: handleBlockAccount,
	};
};
