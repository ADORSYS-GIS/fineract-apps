import {
	GetTellersTellerIdCashiersCashiersIdSummaryAndTransactionsResponse,
	TellerCashManagementService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Route } from "@/routes/dashboard";

export const useCashierTransactionSummary = (enabled: boolean) => {
	const { page = 1, limit = 10 } = Route.useSearch();
	const { cashierInfo, currencyCode } = useRouteContext({ from: "__root__" });

	const tellerId = cashierInfo?.tellerId;
	const cashierId = cashierInfo?.id;

	const {
		data: cashierData,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
		error: summaryError,
	} = useQuery<GetTellersTellerIdCashiersCashiersIdSummaryAndTransactionsResponse>(
		{
			queryKey: [
				"cashierSummary",
				tellerId,
				cashierId,
				currencyCode,
				page,
				limit,
			],
			queryFn: () => {
				if (tellerId && cashierId && currencyCode) {
					return TellerCashManagementService.getV1TellersByTellerIdCashiersByCashierIdSummaryandtransactions(
						{
							tellerId,
							cashierId,
							currencyCode,
							offset: (page - 1) * limit,
							limit,
						},
					);
				}
				// This should not happen if the first query succeeds
				return Promise.reject(
					new Error("tellerId, cashierId, or currencyCode not available"),
				);
			},
			enabled: !!tellerId && !!cashierId && !!currencyCode && enabled,
		},
	);

	return {
		cashierData,
		currencyCode,
		isLoading: isSummaryLoading,
		isError: isSummaryError,
		error: summaryError,
	};
};
