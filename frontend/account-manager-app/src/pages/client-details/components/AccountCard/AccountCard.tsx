import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { getStatusClass } from "../../../dashboard/utils";

interface Account {
	id?: number;
	accountNo?: string;
	productName?: string;
	status?: {
		id?: number;
		code?: string;
		value?: string;
		approved?: boolean;
		submittedAndPendingApproval?: boolean;
		pendingApproval?: boolean;
	};
}

interface AccountCardProps {
	account: Account;
	onActivate: (accountId: number) => void;
	onDelete: (accountId: number) => void;
	onEdit?: (accountId: number) => void;
}

const productColors: { [key: string]: string } = {
	savings: "border-blue-500",
	current: "border-green-500",
	loan: "border-red-500",
	shares: "border-yellow-500",
	recurring: "border-purple-500",
	fixed: "border-pink-500",
};

const getAccountLink = (account: Account) => {
	if (account.productName?.toLowerCase().includes("loan")) {
		return `/loan-account-details/${account.id}`;
	}
	return `/savings-account-details/${account.id}`;
};

const getBorderColorClass = (productName?: string) => {
	if (!productName) return "border-gray-500";
	const lowerProductName = productName.toLowerCase();
	for (const key in productColors) {
		if (lowerProductName.includes(key)) {
			return productColors[key];
		}
	}
	return "border-gray-500";
};

export const AccountCard: FC<AccountCardProps> = ({
	account,
	onActivate,
	onDelete,
	onEdit,
}) => {
	const borderColorClass = getBorderColorClass(account.productName);
	const isSavingsAccount = account.productName?.toLowerCase().includes("savings");
	const isLoanAccount = account.productName?.toLowerCase().includes("loan");
	const isPending =
		account.status?.submittedAndPendingApproval || account.status?.pendingApproval;

	return (
		<Link to={getAccountLink(account)} className="block mb-4">
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
					{isSavingsAccount && account.status?.approved && (
						<Button onClick={() => onActivate(account.id!)}>Activate</Button>
					)}
					{isPending && (
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
					{isLoanAccount && isPending && (
						<>
							<Button
								variant="outline"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onEdit?.(account.id!);
								}}
							>
								Edit
							</Button>
						</>
					)}
				</div>
			</div>
		</Link>
	);
};
