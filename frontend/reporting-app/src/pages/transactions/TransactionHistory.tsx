import { TransactionHistoryView } from "./TransactionHistory.view";
import { useTransactionHistory } from "./useTransactionHistory";

export function TransactionHistory() {
	const transactionData = useTransactionHistory();
	return <TransactionHistoryView {...transactionData} />;
}
