import { CashierTransactionSummaryView } from "./CashierTransactionSummary.view";
import { useCashierTransactionSummary } from "./useCashierTransactionSummary";

export function CashierTransactionSummary() {
	const { cashierData, currencyCode, isLoading, isError, error } =
		useCashierTransactionSummary();

	return (
		<CashierTransactionSummaryView
			cashierData={cashierData}
			currencyCode={currencyCode}
			isLoading={isLoading}
			isError={isError}
			error={error}
		/>
	);
}
