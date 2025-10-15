import { Button } from "@fineract-apps/ui";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Route } from "../../routes/tellers.$tellerId.cashiers.$cashierId.index";
import { CashierDetailView } from "./CashierDetail.view";
import { useCashierDetail } from "./useCashierDetail";

export const CashierDetail = () => {
	const { tellerId, cashierId } = Route.useParams();
	const navigate = useNavigate();
	const { page, pageSize } = Route.useSearch();
	const { data, isLoading, error } = useCashierDetail(
		Number(tellerId),
		Number(cashierId),
		{
			limit: pageSize,
			offset: (page - 1) * pageSize,
		},
	);

	const actionButtons = (
		<div className="flex justify-end gap-4">
			<Button
				onClick={() =>
					navigate({
						to: "/tellers/$tellerId/cashiers/$cashierId/settle",
						params: {
							tellerId,
							cashierId,
						},
						search: {
							page,
							pageSize,
						},
					})
				}
			>
				Settle
			</Button>
			<Button
				onClick={() =>
					navigate({
						to: "/tellers/$tellerId/cashiers/$cashierId/allocate",
						params: {
							tellerId,
							cashierId,
						},
						search: {
							page,
							pageSize,
						},
					})
				}
			>
				Allocate
			</Button>
		</div>
	);

	return (
		<div className="max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
			<PageHeader to={`/tellers/${tellerId}`} title="Cashier Details" />
			<CashierDetailView
				data={data || {}}
				isLoading={isLoading}
				error={error}
				page={page}
				pageSize={pageSize}
				total={data?.cashierTransactions?.totalFilteredRecords}
				actionButtons={actionButtons}
			/>
		</div>
	);
};
