import { SavingsAccountService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export const useSavingsAccountCard = (accountId: number) => {
	const {
		data: accountDetails,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["savingsAccount", accountId],
		queryFn: () =>
			SavingsAccountService.getV1SavingsaccountsByAccountId({
				accountId,
			}),
		enabled: !!accountId,
	});

	return {
		accountDetails,
		accountBalance: accountDetails?.summary?.accountBalance,
		isLoading,
		isError,
	};
};
