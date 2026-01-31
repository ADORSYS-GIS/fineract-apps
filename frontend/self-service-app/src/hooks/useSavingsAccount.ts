import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SavingsAccount } from "@/types/account";
import { accountsApi } from "@/services/accountsApi";

/**
 * Fetches savings accounts via customer-self-service API
 *
 * This endpoint uses JWT token to identify the customer and returns
 * only accounts owned by the authenticated customer (ownership verified server-side).
 */
async function fetchSavingsAccounts(
	accessToken: string,
): Promise<SavingsAccount[]> {
	const accounts = await accountsApi.getSavingsAccounts(accessToken);

	// Map response to frontend SavingsAccount type
	return accounts.map((account) => ({
		id: typeof account.id === "number" ? account.id.toString() : account.id,
		accountNo: account.accountNo,
		productName: account.productName,
		status: account.status,
		currency: account.currency,
		accountBalance: account.accountBalance || 0,
		availableBalance: account.availableBalance || account.accountBalance || 0,
	}));
}

/**
 * Hook to fetch all savings accounts for the authenticated customer
 *
 * No clientId parameter needed - the backend extracts customer identity from JWT.
 */
export function useSavingsAccounts() {
	const auth = useAuth();

	return useQuery({
		queryKey: ["savingsAccounts"],
		queryFn: () => {
			if (!auth.user?.access_token) {
				throw new Error("Not authenticated");
			}
			return fetchSavingsAccounts(auth.user.access_token);
		},
		enabled: !!auth.user?.access_token,
		staleTime: 30 * 1000, // 30 seconds
	});
}

/**
 * Hook to get the primary (first active) savings account
 *
 * Returns the first active account, or the first account if none are active.
 */
export function usePrimarySavingsAccount() {
	const { data: accounts, ...rest } = useSavingsAccounts();

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
