import { useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions } from "@fineract-apps/fineract-api";

export function useCashierDetail(tellerId: number, cashierId: number) {
	const { data, isLoading, error } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions(
			{
				tellerId,
				cashierId,
				currencyCode: "XAF",
			},
		);

	return {
		data,
		isLoading,
		error,
	};
}
