import { ClientData } from "@fineract-apps/fineract-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { fineractApi } from "@/services/api";
import { useDeleteSavingsAccount } from "./hooks/useDeleteSavingsAccount";

export const useClientDetails = () => {
	const { clientId } = useParams({ from: "/client-details/$clientId" });
	const queryClient = useQueryClient();

	const { data: client, isLoading } = useQuery<ClientData>({
		queryKey: ["client", clientId],
		queryFn: () =>
			fineractApi.clients.getV1ClientsByClientId({
				clientId: +clientId,
			}) as Promise<ClientData>,
	});

	const { data: accounts } = useQuery({
		queryKey: ["accounts", clientId],
		queryFn: () =>
			fineractApi.clients.getV1ClientsByClientIdAccounts({
				clientId: +clientId,
			}),
		enabled: !!client,
	});

	const { mutate: activateAccount } = useMutation({
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
	});

	const { mutate: deleteAccount } = useDeleteSavingsAccount(clientId);

	return {
		client,
		isLoading,
		accounts,
		activateAccount,
		deleteAccount,
	};
};
