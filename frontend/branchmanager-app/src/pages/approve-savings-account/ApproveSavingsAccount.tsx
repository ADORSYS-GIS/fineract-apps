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
			<ApproveSavingsAccountDetailView
				data={detail.detail}
				submitting={detail.submitting}
				onSubmit={detail.onSubmit}
				onBack={detail.onBack}
			/>
		);
	}
	return (
		<ApproveSavingsAccountListView
			title={list.title}
			items={list.items}
			isLoading={list.isLoading}
			isError={list.isError}
		/>
	);
};
