import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
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

const productColors: { [key: string]: string } = {
	"Savings Account": "border-blue-500",
	"Current Account": "border-green-500",
	"Loan Account": "border-red-500",
	"Shares Account": "border-yellow-500",
	"Recurring Deposit Account": "border-purple-500",
	"Fixed Deposit Account": "border-pink-500",
};

export const AccountCard: FC<AccountCardProps> = ({
	account,
	onActivate,
	onDelete,
}) => {
	const borderColorClass =
		productColors[account.productName ?? ""] ?? "border-gray-500";

	return (
		<Link
			to="/savings-account-details/$accountId"
			params={{ accountId: String(account.id) }}
			className="block mb-4"
		>
			<div
				className={`bg-white rounded-lg shadow p-4 space-y-4 border-l-4 ${borderColorClass}`}
			>
				<div className="flex justify-between">
					<p className="text-sm text-gray-500">{account.productName}</p>
					<span
						className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
							account.status?.value ?? "",
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
						<Button
							variant="destructive"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onDelete(account.id!);
							}}
						>
							Delete
						</Button>
					)}
				</div>
			</div>
		</Link>
	);
};
