import { TellerCashManagementService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useCurrency } from "@/hooks/useCurrency";

export function useCashierDetail(
	tellerId: number,
	cashierId: number,
	options?: { limit?: number; offset?: number },
) {
	const { currencyCode } = useCurrency();
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
			currencyCode,
			options?.limit ?? 20,
			options?.offset ?? 0,
		],
		queryFn: async () => {
			if (!currencyCode) {
				return Promise.reject(new Error("Currency code not available"));
			}
			return (
				(await TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions(
					{
						tellerId,
						cashierId,
						currencyCode,
						limit: options?.limit ?? 20,
						offset: options?.offset ?? 0,
						orderBy: "createdDate",
						sortOrder: "DESC",
					},
				)) ?? []
			);
		},
		enabled: !!currencyCode,
	});

	return {
		data: { ...data, ...cashierData },
		isLoading: isLoading || isCashierLoading,
		error: error || cashierError,
	};
}
