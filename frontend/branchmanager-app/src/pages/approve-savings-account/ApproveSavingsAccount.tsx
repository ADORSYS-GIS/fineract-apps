import { Route } from "@/routes/approve.savings.account";
import {
	ApproveSavingsAccountDetailView,
	ApproveSavingsAccountListView,
} from "./ApproveSavingsAccount.view";
import {
	useApproveSavingsAccountDetail,
	useApproveSavingsAccountList,
} from "./useApproveSavingsAccount";

export const ApproveSavingsAccount = () => {
	const searchParams = Route.useSearch() as unknown as Record<
		string,
		string | number | undefined
	>;
	const accountId = searchParams.accountId as number | undefined;
	const q = searchParams.q as string | undefined;
	const sortKey = searchParams.sortKey as string | undefined;
	const sortDir =
		(searchParams.sortDir as "asc" | "desc" | undefined) ?? undefined;
	const list = useApproveSavingsAccountList({ q, sortKey, sortDir });
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
			items={list.items}
			isLoading={list.isLoading}
			isError={list.isError}
			page={list.page}
			limit={list.limit}
			total={list.total}
		/>
	);
};
