import { createFileRoute } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle,
	Copy,
	CreditCard,
	Loader2,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	useCustomer,
	usePrimarySavingsAccount,
	useTransactions,
} from "../hooks";
import { formatCurrency } from "../lib/formatters";

export const Route = createFileRoute("/account")({
	component: AccountPage,
});

function AccountPage() {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);

	// Fetch real data using hooks
	const { data: customer, isLoading: isLoadingCustomer } = useCustomer();
	const { data: account, isLoading: isLoadingAccount } =
		usePrimarySavingsAccount();
	const { data: transactions = [] } = useTransactions(account?.id);

	const currency = account?.currency?.code || "XAF";
	const isLoading = isLoadingCustomer || isLoadingAccount;

	// Calculate summary from transactions
	const summary = transactions.reduce(
		(acc, tx) => {
			if (tx.reversed) return acc;
			if (tx.type === "deposit") {
				acc.totalDeposits += tx.amount;
				acc.depositCount++;
			} else {
				acc.totalWithdrawals += tx.amount;
				acc.withdrawalCount++;
			}
			return acc;
		},
		{
			totalDeposits: 0,
			totalWithdrawals: 0,
			depositCount: 0,
			withdrawalCount: 0,
		},
	);

	const handleCopyAccountNumber = async () => {
		if (account?.accountNo) {
			await navigator.clipboard.writeText(account.accountNo);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const getStatusBadge = () => {
		const status = account?.status;
		if (!status) return null;

		const statusColors: Record<string, string> = {
			"savingsAccountStatusType.active": "bg-green-100 text-green-700",
			"savingsAccountStatusType.approved": "bg-blue-100 text-blue-700",
			"savingsAccountStatusType.submitted": "bg-yellow-100 text-yellow-700",
			"savingsAccountStatusType.closed": "bg-gray-100 text-gray-700",
		};

		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status.code] || "bg-gray-100 text-gray-700"}`}
			>
				{status.value}
			</span>
		);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
					<p className="mt-4 text-gray-600">{t("common.loading")}</p>
				</div>
			</div>
		);
	}

	// No account state
	if (!account) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-yellow-500 mx-auto" />
					<p className="mt-4 text-gray-600">No savings account found</p>
					<p className="text-sm text-gray-400 mt-1">Please contact support</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold text-gray-900">
					{t("nav.account", { defaultValue: "Account Details" })}
				</h1>
				<p className="text-gray-500 mt-1">
					View your savings account information
				</p>
			</div>

			{/* Account Card */}
			<div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white">
				<div className="flex items-start justify-between mb-6">
					<div>
						<p className="text-blue-200 text-sm">{account.productName}</p>
						<div className="flex items-center gap-2 mt-1">
							{getStatusBadge()}
						</div>
					</div>
					<CreditCard className="w-10 h-10 text-blue-200" />
				</div>

				{/* Account Number */}
				<div className="mb-6">
					<p className="text-blue-200 text-xs uppercase tracking-wide">
						Account Number
					</p>
					<div className="flex items-center gap-3 mt-1">
						<p className="text-2xl font-mono tracking-wider">
							{account.accountNo}
						</p>
						<button
							onClick={handleCopyAccountNumber}
							className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
							title="Copy account number"
						>
							{copied ? (
								<CheckCircle className="w-5 h-5 text-green-300" />
							) : (
								<Copy className="w-5 h-5" />
							)}
						</button>
					</div>
				</div>

				{/* Balances */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-blue-200 text-xs uppercase tracking-wide">
							Current Balance
						</p>
						<p className="text-xl font-semibold mt-1">
							{formatCurrency(account.accountBalance, currency)} {currency}
						</p>
					</div>
					<div>
						<p className="text-blue-200 text-xs uppercase tracking-wide">
							Available Balance
						</p>
						<p className="text-xl font-semibold mt-1">
							{formatCurrency(account.availableBalance, currency)} {currency}
						</p>
					</div>
				</div>
			</div>

			{/* Account Holder */}
			<div className="card">
				<h3 className="text-sm font-medium text-gray-500 mb-4">
					Account Holder
				</h3>
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
						<span className="text-blue-600 font-bold text-lg">
							{customer?.displayName?.[0] || "U"}
						</span>
					</div>
					<div>
						<p className="font-medium text-gray-900">
							{customer?.displayName || "Customer"}
						</p>
						<p className="text-sm text-gray-500">
							{customer?.phone || customer?.email || ""}
						</p>
					</div>
				</div>
			</div>

			{/* Account Summary */}
			<div className="card">
				<h3 className="text-sm font-medium text-gray-500 mb-4">
					Account Summary
				</h3>
				<div className="grid grid-cols-2 gap-4">
					<div className="p-4 bg-green-50 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp className="w-5 h-5 text-green-600" />
							<span className="text-sm text-gray-600">Total Deposits</span>
						</div>
						<p className="text-xl font-semibold text-green-600">
							{formatCurrency(summary.totalDeposits, currency)} {currency}
						</p>
						<p className="text-xs text-gray-500 mt-1">
							{summary.depositCount} transactions
						</p>
					</div>

					<div className="p-4 bg-red-50 rounded-lg">
						<div className="flex items-center gap-2 mb-2">
							<TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
							<span className="text-sm text-gray-600">Total Withdrawals</span>
						</div>
						<p className="text-xl font-semibold text-red-600">
							{formatCurrency(summary.totalWithdrawals, currency)} {currency}
						</p>
						<p className="text-xs text-gray-500 mt-1">
							{summary.withdrawalCount} transactions
						</p>
					</div>
				</div>
			</div>

			{/* Account Details */}
			<div className="card">
				<h3 className="text-sm font-medium text-gray-500 mb-4">
					Account Information
				</h3>
				<div className="space-y-3">
					<div className="flex items-center justify-between py-2 border-b border-gray-100">
						<span className="text-gray-600">Product Name</span>
						<span className="font-medium text-gray-900">
							{account.productName}
						</span>
					</div>
					<div className="flex items-center justify-between py-2 border-b border-gray-100">
						<span className="text-gray-600">Currency</span>
						<span className="font-medium text-gray-900">
							{account.currency?.name || currency} ({currency})
						</span>
					</div>
					<div className="flex items-center justify-between py-2 border-b border-gray-100">
						<span className="text-gray-600">Account Status</span>
						{getStatusBadge()}
					</div>
					<div className="flex items-center justify-between py-2">
						<span className="text-gray-600">Total Transactions</span>
						<span className="font-medium text-gray-900">
							{summary.depositCount + summary.withdrawalCount}
						</span>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-2 gap-4">
				<a
					href="/self-service/deposit"
					className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
				>
					<span className="text-green-600 font-medium">{t("nav.deposit")}</span>
				</a>
				<a
					href="/self-service/transactions"
					className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
				>
					<span className="text-blue-600 font-medium">
						{t("nav.transactions")}
					</span>
				</a>
			</div>
		</div>
	);
}
