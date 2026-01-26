import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowDownCircle,
	ArrowUpCircle,
	Loader2,
	Shield,
	TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import { BalanceDisplay, RecentTransactions } from "../components/dashboard";
import { KycTierBadge, LimitsProgress } from "../components/kyc";
import {
	useCustomer,
	useLimits,
	usePrimarySavingsAccount,
	useTransactions,
} from "../hooks";
import type { Transaction } from "../hooks/useTransactions";
import { formatCurrency } from "../lib/formatters";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const auth = useAuth();
	const navigate = useNavigate();
	const { t } = useTranslation();

	// Extract user info from OIDC claims
	const userName =
		auth.user?.profile?.given_name || auth.user?.profile?.name || "User";
	const kycTier = (auth.user?.profile?.kyc_tier as number) || 1;
	const kycStatus = (auth.user?.profile?.kyc_status as string) || "pending";

	// Fetch data using hooks
	const { data: customer, isLoading: isLoadingCustomer } = useCustomer();
	const { data: account, isLoading: isLoadingAccount } =
		usePrimarySavingsAccount(customer?.id);
	const { data: transactions = [], isLoading: isLoadingTransactions } =
		useTransactions(account?.id);
	const { data: limitsData } = useLimits();

	const currency = account?.currency?.code || "XAF";
	const accountBalance = account?.accountBalance || 0;
	const availableBalance = account?.availableBalance || accountBalance;

	const isLoading = isLoadingCustomer || isLoadingAccount;

	// Map transactions to the expected format
	const mappedTransactions: Transaction[] = transactions.slice(0, 5);

	const handleViewAllTransactions = () => {
		navigate({ to: "/transactions" });
	};

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

	return (
		<div className="space-y-6">
			{/* Welcome Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">
						{t("dashboard.welcome", { name: userName })}
					</h1>
					<div className="flex items-center gap-2 mt-1">
						<KycTierBadge tier={kycTier} size="sm" />
						<span className="text-gray-400">•</span>
						<span className="text-sm text-gray-500">
							{t(`kyc.status.${kycStatus}`)}
						</span>
					</div>
				</div>
			</div>

			{/* Balance Cards */}
			<div className="grid md:grid-cols-2 gap-6">
				<div className="card">
					<BalanceDisplay
						balance={accountBalance}
						availableBalance={availableBalance}
						currency={currency}
						isLoading={isLoadingAccount}
						size="md"
					/>
				</div>

				{limitsData && (
					<div className="card">
						<h3 className="text-sm font-medium text-gray-500 mb-3">
							{t("dashboard.limits")}
						</h3>
						<LimitsProgress
							limits={{
								daily: limitsData.deposit.daily,
								perTransaction: limitsData.deposit.perTransaction,
								monthly: limitsData.deposit.monthly,
								remaining: limitsData.deposit.remaining,
							}}
							currency={currency}
						/>
					</div>
				)}
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<a
					href="/self-service/deposit"
					className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
				>
					<ArrowDownCircle className="w-8 h-8 text-green-600 mb-2" />
					<span className="font-medium text-gray-700">{t("nav.deposit")}</span>
				</a>
				<a
					href="/self-service/withdraw"
					className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
				>
					<ArrowUpCircle className="w-8 h-8 text-red-600 mb-2" />
					<span className="font-medium text-gray-700">{t("nav.withdraw")}</span>
				</a>
				<a
					href="/self-service/transactions"
					className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
				>
					<TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
					<span className="font-medium text-gray-700">
						{t("nav.transactions")}
					</span>
				</a>
				<a
					href="/self-service/kyc"
					className="card flex flex-col items-center justify-center py-6 hover:border-blue-300 hover:shadow-md transition-all"
				>
					<Shield className="w-8 h-8 text-purple-600 mb-2" />
					<span className="font-medium text-gray-700">{t("nav.kyc")}</span>
				</a>
			</div>

			{/* Recent Transactions */}
			<div className="card">
				<RecentTransactions
					transactions={mappedTransactions}
					isLoading={isLoadingTransactions}
					maxItems={5}
					currency={currency}
					onViewAll={handleViewAllTransactions}
				/>
			</div>

			{/* Upgrade prompt */}
			{kycTier < 2 && (
				<div className="card bg-blue-50 border-blue-200">
					<div className="flex items-start gap-4">
						<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
							<Shield className="w-6 h-6 text-blue-600" />
						</div>
						<div className="flex-1">
							<h3 className="font-semibold text-blue-900">
								Unlock Higher Limits
							</h3>
							<p className="text-sm text-blue-700 mt-1">
								Complete your verification to upgrade to Tier 2 and increase
								your transaction limits to {formatCurrency(500000, currency)}{" "}
								{currency} daily.
							</p>
							<a
								href="/self-service/kyc"
								className="inline-block mt-3 text-sm font-medium text-blue-600 hover:underline"
							>
								Start Verification →
							</a>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
