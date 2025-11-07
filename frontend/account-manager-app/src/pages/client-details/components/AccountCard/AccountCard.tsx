import { Button } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { useTranslation } from "react-i18next";
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
	savingsAccount: "border-blue-500",
	shareAccount: "border-yellow-500",
	recurringDepositAccount: "border-purple-500",
	fixedDepositsAccount: "border-pink-500",
	loanAccount: "border-red-500",
};

export const AccountCard: FC<AccountCardProps> = ({
	account,
	onActivate,
	onDelete,
}) => {
	const { t } = useTranslation();
	const getTranslatedProductName = (productName: string | undefined) => {
		switch (productName) {
			case "Savings Account":
				return t("savingsAccount");
			case "Savings Product":
				return t("savingsProduct");
			case "Share Account":
				return t("shareAccount");
			case "Recurring Deposit Account":
				return t("recurringDepositAccount");
			case "Fixed Deposit Account":
				return t("fixedDepositsAccount");
			case "Loan Account":
				return t("loanAccount");
			default:
				return productName;
		}
	};

	const getProductKey = (productName: string | undefined) => {
		switch (productName) {
			case "Savings Account":
				return "savingsAccount";
			case "Savings Product":
				return "savingsProduct";
			case "Share Account":
				return "shareAccount";
			case "Recurring Deposit Account":
				return "recurringDepositAccount";
			case "Fixed Deposit Account":
				return "fixedDepositsAccount";
			case "Loan Account":
				return "loanAccount";
			default:
				return "";
		}
	};

	const productKey = getProductKey(account.productName);
	const borderColorClass = productColors[productKey] ?? "border-gray-500";

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
					<p className="text-sm text-gray-500">
						{getTranslatedProductName(account.productName)}
					</p>
					<span
						className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
							account.status?.value ?? "",
						)}`}
					>
						{account.status?.value}
					</span>
				</div>
				<div className="flex justify-between">
					<p className="text-sm text-gray-500">{t("accountNo")}:</p>
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
