import { PageHeader } from "@/components/PageHeader";
import { Route } from "../../routes/approve.savings.account";
import {
	ApproveSavingsAccountDetailView,
	ApproveSavingsAccountListView,
} from "./ApproveSavingsAccount.view";
import {
	useApproveSavingsAccountDetail,
	useApproveSavingsAccountList,
} from "./useApproveSavingsAccount";

export const ApproveSavingsAccount = () => {
	const { accountId } = Route.useSearch();
	const list = useApproveSavingsAccountList();
	const detail = useApproveSavingsAccountDetail(accountId ?? 0, {
		enabled: Boolean(accountId),
	});

	if (accountId) {
		if (detail.isLoading || !detail.detail)
			return <div>Loading account details...</div>;
		return (
			<div>
				<PageHeader title="Approve Savings Account" />
				<ApproveSavingsAccountDetailView
					data={detail.detail}
					submitting={detail.submitting}
					onSubmit={detail.onSubmit}
					onBack={detail.onBack}
				/>
			</div>
		);
	}
	return (
		<div>
			<PageHeader title="Approve Savings Account" />
			<ApproveSavingsAccountListView
				items={list.items}
				isLoading={list.isLoading}
				isError={list.isError}
				page={list.page}
				limit={list.limit}
				total={list.total}
			/>
		</div>
	);
};
