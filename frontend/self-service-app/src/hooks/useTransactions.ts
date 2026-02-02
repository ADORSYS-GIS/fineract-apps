import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { accountsApi } from "@/services/accountsApi";
import type { Transaction } from "@/types/transaction";

export type { Transaction };

/**
 * Fetches transactions via customer-self-service API
 *
 * This endpoint verifies account ownership server-side before returning data.
 */
async function fetchTransactions(
	accountId: number,
	accessToken: string,
): Promise<Transaction[]> {
	const transactions = await accountsApi.getTransactions(
		accountId,
		accessToken,
	);

	// Transactions are already mapped by the backend
	return transactions;
}

/**
 * Hook to fetch transactions for a savings account
 *
 * Includes ownership verification - will return 403 if account doesn't belong
 * to the authenticated customer.
 */
export function useTransactions(accountId: string | undefined) {
	const auth = useAuth();

	return useQuery({
		queryKey: ["transactions", accountId],
		queryFn: () => {
			if (!accountId || !auth.user?.access_token) {
				throw new Error("Not authenticated");
			}
			return fetchTransactions(parseInt(accountId), auth.user.access_token);
		},
		enabled: !!accountId && !!auth.user?.access_token,
		staleTime: 30 * 1000, // 30 seconds
	});
}
