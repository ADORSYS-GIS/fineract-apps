import {
	CurrencyService,
	FetchAuthenticatedUserDetailsService,
	GetTellersTellerIdCashiersCashiersIdSummaryAndTransactionsResponse,
	GetV1TellersByTellerIdCashiersResponse,
	GetV1TellersResponse,
	TellerCashManagementService,
} from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@/routes/dashboard";

export const useCashierTransactionSummary = () => {
	const { page = 1, limit = 10 } = Route.useSearch();
	const { data: userDetails, isLoading: isUserDetailsLoading } = useQuery({
		queryKey: ["userDetails"],
		queryFn: () => FetchAuthenticatedUserDetailsService.getV1Userdetails(),
		staleTime: Infinity,
	});
	const staffId = userDetails?.staffId;
	const officeId = userDetails?.officeId;

	const { data: currencies, isLoading: isCurrenciesLoading } = useQuery({
		queryKey: ["currencies"],
		queryFn: () => CurrencyService.getV1Currencies(),
		staleTime: Infinity,
	});
	const currencyCode = currencies?.selectedCurrencyOptions?.[0]?.code;

	const {
		data: cashierInfo,
		isLoading: isCashierInfoLoading,
		isError: isCashierInfoError,
		error: cashierInfoError,
	} = useQuery({
		queryKey: ["cashierInfo", staffId, officeId],
		queryFn: async () => {
			if (!staffId || !officeId) {
				throw new Error("StaffId or OfficeId not available from user details");
			}

			const tellers: GetV1TellersResponse =
				await TellerCashManagementService.getV1Tellers({ officeId });

			for (const teller of tellers) {
				if (teller.id) {
					const cashiersResponse: GetV1TellersByTellerIdCashiersResponse =
						await TellerCashManagementService.getV1TellersByTellerIdCashiers({
							tellerId: teller.id,
						});

					const cashier = cashiersResponse?.cashiers?.find(
						(c) => c.staffId === staffId,
					);

					if (cashier) {
						return { ...cashier, tellerId: teller.id };
					}
				}
			}

			throw new Error(
				"No cashier data found for this user. Please contact an administrator.",
			);
		},
		enabled: !!staffId && !!officeId,
		staleTime: Infinity,
	});

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
			enabled: !!tellerId && !!cashierId && !!currencyCode,
		},
	);

	return {
		cashierData,
		currencyCode,
		isLoading:
			isUserDetailsLoading ||
			isCurrenciesLoading ||
			isCashierInfoLoading ||
			isSummaryLoading,
		isError: isCashierInfoError || isSummaryError,
		error: cashierInfoError || summaryError,
	};
};
