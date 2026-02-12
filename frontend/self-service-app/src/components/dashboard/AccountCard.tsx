import { CreditCard, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { SavingsAccount } from "@/types";
import { formatAccountNumber, formatCurrency } from "../../lib/formatters";

interface AccountCardProps {
	account: SavingsAccount;
	onSelect?: (account: SavingsAccount) => void;
	selected?: boolean;
}

export function AccountCard({
	account,
	onSelect,
	selected = false,
}: AccountCardProps) {
	const { t } = useTranslation();
	const [showBalance, setShowBalance] = useState(true);

	const currency = account.currency?.code || "XAF";

	return (
		<div
			onClick={() => onSelect?.(account)}
			className={`card cursor-pointer transition-all ${
				selected
					? "border-blue-500 ring-2 ring-blue-200"
					: "hover:border-gray-300 hover:shadow-md"
			} ${onSelect ? "cursor-pointer" : ""}`}
		>
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
						<CreditCard className="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<p className="font-medium text-gray-900">{account.productName}</p>
						<p className="text-sm text-gray-500">
							{formatAccountNumber(account.accountNo)}
						</p>
					</div>
				</div>
				<button
					onClick={(e) => {
						e.stopPropagation();
						setShowBalance(!showBalance);
					}}
					className="p-2 rounded-full hover:bg-gray-100 transition-colors"
					aria-label={showBalance ? "Hide balance" : "Show balance"}
				>
					{showBalance ? (
						<Eye className="w-5 h-5 text-gray-400" />
					) : (
						<EyeOff className="w-5 h-5 text-gray-400" />
					)}
				</button>
			</div>

			<div className="space-y-2">
				<div>
					<p className="text-sm text-gray-500">
						{t("dashboard.accountBalance")}
					</p>
					<p className="text-2xl font-bold text-gray-900">
						{showBalance
							? `${formatCurrency(account.accountBalance, currency)} ${currency}`
							: "••••••"}
					</p>
				</div>

				{account.availableBalance !== account.accountBalance && (
					<div>
						<p className="text-sm text-gray-500">
							{t("dashboard.availableBalance")}
						</p>
						<p className="text-lg font-semibold text-green-600">
							{showBalance
								? `${formatCurrency(account.availableBalance, currency)} ${currency}`
								: "••••••"}
						</p>
					</div>
				)}
			</div>

			<div className="mt-4 pt-4 border-t">
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-500">Status</span>
					<span
						className={`px-2 py-0.5 rounded-full text-xs font-medium ${
							account.status.code === "savingsAccountStatusType.active"
								? "bg-green-100 text-green-700"
								: "bg-yellow-100 text-yellow-700"
						}`}
					>
						{account.status.value}
					</span>
				</div>
			</div>
		</div>
	);
}
