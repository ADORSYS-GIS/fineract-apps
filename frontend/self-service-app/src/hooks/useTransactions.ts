// TODO: Refactor to use the generated Fineract API client when available
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

export interface Transaction {
	id: string;
	type: "deposit" | "withdrawal";
	amount: number;
	currency: string;
	date: string;
	runningBalance: number;
	paymentDetail?: {
		paymentType: {
			id: number;
			name: string;
		};
		receiptNumber?: string;
	};
	submittedOnDate: string;
	reversed: boolean;
}

async function fetchTransactions(
	accountId: string,
	accessToken: string,
): Promise<Transaction[]> {
	const response = await fetch(
		`${import.meta.env.VITE_FINERACT_API_URL || "/fineract-provider/api/v1"}/savingsaccounts/${accountId}/transactions`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Fineract-Platform-TenantId":
					import.meta.env.VITE_FINERACT_TENANT_ID || "default",
			},
		},
	);

	if (!response.ok) {
		throw new Error("Failed to fetch transactions");
	}

	const data = await response.json();

	return (data.pageItems || data.transactions || []).map(
		(tx: Record<string, unknown>) => ({
			id: (tx.id as number).toString(),
			type: (tx.transactionType as { deposit?: boolean })?.deposit
				? "deposit"
				: "withdrawal",
			amount: tx.amount as number,
			currency: (tx.currency as { code: string })?.code || "XAF",
			date: Array.isArray(tx.date)
				? (tx.date as number[]).join("-")
				: (tx.date as string),
			runningBalance: tx.runningBalance as number,
			paymentDetail: tx.paymentDetail as Transaction["paymentDetail"],
			submittedOnDate: Array.isArray(tx.submittedOnDate)
				? (tx.submittedOnDate as number[]).join("-")
				: (tx.submittedOnDate as string),
			reversed: tx.reversed as boolean,
		}),
	);
}

export function useTransactions(accountId: string | undefined) {
	const auth = useAuth();

	return useQuery({
		queryKey: ["transactions", accountId],
		queryFn: () => {
			if (!accountId || !auth.user?.access_token) {
				throw new Error("Not authenticated");
			}
			return fetchTransactions(accountId, auth.user.access_token);
		},
		enabled: !!accountId && !!auth.user?.access_token,
		staleTime: 30 * 1000, // 30 seconds
	});
}
