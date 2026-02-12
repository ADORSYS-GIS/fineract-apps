import { AccountsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { Transaction } from "@/types/transaction";

export type { Transaction };

/**
 * Fetches transactions via customer-self-service API
 *
 * This endpoint verifies account ownership server-side before returning data.
 */
async function fetchTransactions(accountId: number): Promise<Transaction[]> {
	const response =
		await AccountsService.getApiAccountsSavingsByAccountIdTransactions({
			accountId,
		});

	// Transactions are already mapped by the backend
	return (response.transactions || []) as unknown as Transaction[];
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
			if (!accountId) {
				// Should not happen if enabled is set correctly
				return Promise.resolve([]);
			}
			return fetchTransactions(parseInt(accountId, 10));
		},
		enabled: !!accountId && !!auth.user?.access_token,
		staleTime: 30 * 1000, // 30 seconds
	});
}
