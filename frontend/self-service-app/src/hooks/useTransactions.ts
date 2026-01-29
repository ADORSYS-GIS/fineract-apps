import {
	SavingsAccountData,
	SavingsAccountService,
	SavingsAccountTransactionData,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import type { Transaction } from "@/types/transaction";

export type { Transaction };

async function fetchTransactions(accountId: string): Promise<Transaction[]> {
	const data: SavingsAccountData =
		await SavingsAccountService.getV1SavingsaccountsByAccountId({
			accountId: parseInt(accountId),
			associations: "transactions",
		});

	return (data.transactions || []).map((tx: SavingsAccountTransactionData) => ({
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
		paymentDetail: tx.paymentDetailData as Transaction["paymentDetail"],
		submittedOnDate: Array.isArray(tx.submittedOnDate)
			? (tx.submittedOnDate as number[]).join("-")
			: (tx.submittedOnDate as string),
		reversed: tx.reversed as boolean,
	}));
}

export function useTransactions(accountId: string | undefined) {
	const auth = useAuth();

	return useQuery({
		queryKey: ["transactions", accountId],
		queryFn: () => {
			if (!accountId || !auth.user?.access_token) {
				throw new Error("Not authenticated");
			}
			return fetchTransactions(accountId);
		},
		enabled: !!accountId && !!auth.user?.access_token,
		staleTime: 30 * 1000, // 30 seconds
	});
}
