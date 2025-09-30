import { GetTellersTellerIdCashiersCashierIdResponse } from "@fineract-apps/fineract-api";

export type CashierDetailViewProps = {
	data: GetTellersTellerIdCashiersCashierIdResponse;
	isLoading: boolean;
	error: Error | null;
};
