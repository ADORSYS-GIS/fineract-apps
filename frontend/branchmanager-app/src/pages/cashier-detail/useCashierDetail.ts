import { TellerCashManagementService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";

export function useCashierDetail(
	tellerId: number,
	cashierId: number,
	options?: { limit?: number; offset?: number; currencyCode?: string },
) {
	const {
		data: cashierData,
		isLoading: isCashierLoading,
		error: cashierError,
	} = useQuery({
		queryKey: ["tellers", tellerId, "cashiers", cashierId],
		queryFn: () =>
			TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierId({
				tellerId,
				cashierId,
			}),
	});
	const { data, isLoading, error } = useQuery({
		queryKey: [
			"tellers",
			tellerId,
			"cashiers",
			cashierId,
			"summary-transactions",
			options?.limit ?? 20,
			options?.offset ?? 0,
		],
		queryFn: async () =>
			(await TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions(
				{
					tellerId,
					cashierId,
					currencyCode: options?.currencyCode ?? "XAF",
					limit: options?.limit ?? 20,
					offset: options?.offset ?? 0,
					orderBy: "createdDate",
					sortOrder: "DESC",
				},
			)) ?? [],
	});

	return {
		data: { ...data, ...cashierData },
		isLoading: isLoading || isCashierLoading,
		error: error || cashierError,
	};
}
