import { AccountsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { SavingsAccount } from "@/types/account";

/**
 * Fetches savings accounts via customer-self-service API
 *
 * This endpoint uses JWT token to identify the customer and returns
 * only accounts owned by the authenticated customer (ownership verified server-side).
 */
async function fetchSavingsAccounts(): Promise<SavingsAccount[]> {
	const response = await AccountsService.getApiAccountsSavings();
	const accounts = response.accounts || [];

	// Define an explicit type for the objects coming from the API
	// to avoid using `any`. This acts as a contract for the expected data structure.
	interface ApiAccount {
		id: number | string;
		accountNo: string;
		productName: string;
		status: {
			id: number;
			code: string;
			value: string;
		};
		currency: {
			code: string;
			name: string;
			decimalPlaces: number;
			displaySymbol: string;
			nameCode: string;
			displayLabel: string;
		};
		accountBalance?: number;
		availableBalance?: number;
	}

	// Map response to frontend SavingsAccount type
	return (accounts as unknown as ApiAccount[]).map((account) => ({
		id: account.id.toString(),
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
		queryFn: fetchSavingsAccounts,
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
