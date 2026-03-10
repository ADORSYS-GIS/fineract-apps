import { useTranslation } from "react-i18next";
import { CashierTransactionSummary } from "../CashierTransactionSummary";
import { ClientSearch } from "../ClientSearch";

export function DashboardView() {
	const { t } = useTranslation();
	return (
		<div className="p-6 flex flex-col gap-4">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">
				{t("cashierDashboard.title")}
			</h1>
			<ClientSearch />
			<CashierTransactionSummary />
		</div>
	);
}
