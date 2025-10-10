import { Route } from "../../routes/tellers.$tellerId.cashiers.$cashierId";
import { CashierDetailView } from "./CashierDetail.view";
import { useCashierDetail } from "./useCashierDetail";

export const CashierDetail = () => {
	const { tellerId, cashierId } = Route.useParams();
	const { page, pageSize } = Route.useSearch();
	const { data, isLoading, error } = useCashierDetail(
		Number(tellerId),
		Number(cashierId),
		{
			limit: pageSize,
			offset: (page - 1) * pageSize,
		},
	);
	return (
		<CashierDetailView
			data={data || {}}
			isLoading={isLoading}
			error={error}
			page={page}
			pageSize={pageSize}
			total={data?.cashierTransactions?.totalFilteredRecords}
		/>
	);
};
