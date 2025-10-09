import { useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions } from "@fineract-apps/fineract-api";

export function useCashierDetail(
	tellerId: number,
	cashierId: number,
	options?: { limit?: number; offset?: number; currencyCode?: string },
) {
	const { data, isLoading, error } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions(
			{
				tellerId,
				cashierId,
				currencyCode: options?.currencyCode ?? "XAF",
				limit: options?.limit ?? 20,
				offset: options?.offset ?? 0,
				orderBy: "createdDate",
				sortOrder: "DESC",
			},
			[
				"tellers",
				tellerId,
				"cashiers",
				cashierId,
				"summary-transactions",
				options?.limit ?? 20,
				options?.offset ?? 0,
			],
		);

	return {
		data,
		isLoading,
		error,
	};
}
