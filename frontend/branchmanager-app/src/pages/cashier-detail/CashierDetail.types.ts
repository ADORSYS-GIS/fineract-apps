import { GetTellersTellerIdCashiersCashiersIdSummaryAndTransactionsResponse } from "@fineract-apps/fineract-api";

export type CashierDetailViewProps = {
	data: GetTellersTellerIdCashiersCashiersIdSummaryAndTransactionsResponse;
	isLoading: boolean;
	error: Error | null;
	page?: number;
	pageSize?: number;
	total?: number;
};
