import { GetTellersTellerIdCashiersCashiersIdSummaryAndTransactionsResponse } from "@fineract-apps/fineract-api";

export interface CashierTransactionSummaryViewProps {
	readonly cashierData:
		| GetTellersTellerIdCashiersCashiersIdSummaryAndTransactionsResponse
		| undefined;
	readonly isLoading: boolean;
	readonly isError: boolean;
	readonly error: Error | null;
	readonly currencyCode: string | undefined;
}
