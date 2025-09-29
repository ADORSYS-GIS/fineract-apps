import { Button } from "@fineract-apps/ui";
import { FC } from "react";

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
		};
	};
	onActivate: (accountId: number) => void;
}

export const AccountCard: FC<AccountCardProps> = ({ account, onActivate }) => {
	return (
		<div className="bg-white rounded-lg shadow p-4 space-y-4">
			<div className="flex justify-between">
				<p className="text-sm text-gray-500">{account.productName}</p>
				<p className="text-md">{account.status?.value}</p>
			</div>
			<div className="flex justify-between">
				<p className="text-sm text-gray-500">Account No:</p>
				<p className="text-md">{account.accountNo}</p>
			</div>
			<div className="flex justify-end">
				{account.status?.approved && (
					<Button onClick={() => onActivate(account.id!)}>Activate</Button>
				)}
			</div>
		</div>
	);
};
