import { Route } from "../../routes/tellers.$tellerId.cashiers.$cashierId";
import { CashierDetailView } from "./CashierDetail.view";
import { useCashierDetail } from "./useCashierDetail";

export const CashierDetail = () => {
	const { tellerId, cashierId } = Route.useParams();
	const { data, isLoading, error } = useCashierDetail(
		Number(tellerId),
		Number(cashierId),
	);
	return (
		<CashierDetailView
			data={data || {}}
			isLoading={isLoading}
			error={error as Error | null}
		/>
	);
};
