import { CashierTransactionSummary } from "../CashierTransactionSummary";
import { ClientSearch } from "../ClientSearch";
import { DashboardViewProps } from "./Dashboard.types";

export function DashboardView({}: Readonly<DashboardViewProps>) {
	return (
		<div className="flex flex-col gap-4">
			<ClientSearch />
			<CashierTransactionSummary />
		</div>
	);
}
