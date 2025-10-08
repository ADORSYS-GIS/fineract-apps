import { CashierTransactionSummaryView } from "./CashierTransactionSummary.view";
import { useCashierTransactionSummary } from "./useCashierTransactionSummary";

export function CashierTransactionSummary() {
	const { cashierData, isLoading, isError, error } =
		useCashierTransactionSummary();

	return (
		<CashierTransactionSummaryView
			cashierData={cashierData}
			isLoading={isLoading}
			isError={isError}
			error={error}
		/>
	);
}
