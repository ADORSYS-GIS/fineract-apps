import { Button } from "@fineract-apps/ui";
import { FC } from "react";
import { getStatusClass } from "../../../dashboard/utils";

interface AccountCardProps {
	account: {
		id?: number;
		accountNo?: string;
		productName?: string;
		status?: {
			id?: number;
			code?: string;
			value?: string;
			approved?: boolean;
			submittedAndPendingApproval?: boolean;
		};
	};
	onActivate: (accountId: number) => void;
	onDelete: (accountId: number) => void;
}

export const AccountCard: FC<AccountCardProps> = ({
	account,
	onActivate,
	onDelete,
}) => {
	return (
		<div className="bg-white rounded-lg shadow p-4 space-y-4">
			<div className="flex justify-between">
				<p className="text-sm text-gray-500">{account.productName}</p>
				<span
					className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
						account.status?.value || "",
					)}`}
				>
					{account.status?.value}
				</span>
			</div>
			<div className="flex justify-between">
				<p className="text-sm text-gray-500">Account No:</p>
				<p className="text-md">{account.accountNo}</p>
			</div>
			<div className="flex justify-end space-x-2">
				{account.status?.approved && (
					<Button onClick={() => onActivate(account.id!)}>Activate</Button>
				)}
				{account.status?.submittedAndPendingApproval && (
					<Button variant="destructive" onClick={() => onDelete(account.id!)}>
						Delete
					</Button>
				)}
			</div>
		</div>
	);
};
