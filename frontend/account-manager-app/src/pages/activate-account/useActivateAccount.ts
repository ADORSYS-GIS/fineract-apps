import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { fineractApi } from "@/services/api";

export const useActivateAccount = () => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();

	const { mutate: activateAccount, isPending: isActivatingAccount } =
		useMutation({
			mutationKey: ["activateAccount", clientId],
			mutationFn: (accountId: number) =>
				fineractApi.savingsAccounts.postV1SavingsaccountsByAccountId({
					accountId,
					command: "activate",
					requestBody: {
						activatedOnDate: new Date().toLocaleDateString("en-GB", {
							day: "2-digit",
							month: "long",
							year: "numeric",
						}),
						dateFormat: "dd MMMM yyyy",
						locale: "en",
					},
				}),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["accounts", clientId] });
				toast.success("Account activated successfully!");
			},
			onError: (error) => {
				toast.error(
					error.message || "An error occurred while activating the account.",
				);
			},
		});

	return { activateAccount, isActivatingAccount };
};
