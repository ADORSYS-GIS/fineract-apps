import { useState } from "react";
import { CashierTransactionSummaryView } from "./CashierTransactionSummary.view";
import { useCashierTransactionSummary } from "./useCashierTransactionSummary";

export function CashierTransactionSummary() {
	const [showSummary, setShowSummary] = useState(false);
	const { cashierData, currencyCode, isLoading, isError, error } =
		useCashierTransactionSummary(showSummary);

	const handleShowSummary = () => {
		setShowSummary(true);
	};

	return (
		<CashierTransactionSummaryView
			cashierData={cashierData}
			currencyCode={currencyCode}
			isLoading={isLoading}
			isError={isError}
			error={error}
			onShowSummary={handleShowSummary}
			showSummary={showSummary}
		/>
	);
}
