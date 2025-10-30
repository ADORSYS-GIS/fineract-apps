import { CashierTransactionSummary } from "../CashierTransactionSummary";
import { ClientSearch } from "../ClientSearch";

export function DashboardView() {
	return (
		<div className="flex flex-col gap-4">
			<ClientSearch />
			<CashierTransactionSummary />
		</div>
	);
}
