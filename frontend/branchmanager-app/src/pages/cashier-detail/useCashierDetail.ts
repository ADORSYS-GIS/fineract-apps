import { useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierId } from "@fineract-apps/fineract-api";

export function useCashierDetail(tellerId: number, cashierId: number) {
	const { data, isLoading, error } =
		useTellerCashManagementServiceGetV1TellersByTellerIdCashiersByCashierId({
			tellerId,
			cashierId,
		});

	return {
		data,
		isLoading,
		error,
	};
}
