import {
	GetSavingsAccountsResponse,
	SavingsAccountService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SavingsAccount } from "@/types/account";

async function fetchSavingsAccounts(
	clientId: string,
): Promise<SavingsAccount[]> {
	const data: GetSavingsAccountsResponse =
		await SavingsAccountService.getV1Savingsaccounts({
			externalId: clientId,
		});

	return (data.pageItems || []).map((account: Record<string, unknown>) => ({
		id: (account.id as number).toString(),
		accountNo: account.accountNo as string,
		productName: (account.savingsProductName || account.productName) as string,
		status: account.status as SavingsAccount["status"],
		currency: account.currency as SavingsAccount["currency"],
		accountBalance: (account.accountBalance as number) || 0,
		availableBalance:
			(account.availableBalance as number) ||
			(account.accountBalance as number) ||
			0,
	}));
}

export function useSavingsAccounts(clientId: string | undefined) {
	const auth = useAuth();

	return useQuery({
		queryKey: ["savingsAccounts", clientId],
		queryFn: () => {
			if (!clientId || !auth.user?.access_token) {
				throw new Error("Not authenticated");
			}
			return fetchSavingsAccounts(clientId);
		},
		enabled: !!clientId,
		staleTime: 30 * 1000, // 30 seconds
	});
}

export function usePrimarySavingsAccount(clientId: string | undefined) {
	const { data: accounts, ...rest } = useSavingsAccounts(clientId);

	// Return the first active account as primary
	const primaryAccount =
		accounts?.find(
			(acc) => acc.status.code === "savingsAccountStatusType.active",
		) || accounts?.[0];

	return {
		...rest,
		data: primaryAccount,
	};
}
