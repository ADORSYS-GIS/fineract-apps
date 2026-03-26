import { Button, Card } from "@fineract-apps/ui";
import { BookOpen, DollarSign, Receipt, RefreshCw } from "lucide-react";
import { FC } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { StatusBadge } from "@/components/StatusBadge";
import { type AccountingTab, useAccounting } from "./useAccounting";

const fmt = (n: number | undefined) =>
	n != null ? new Intl.NumberFormat("fr-FR").format(n) : "\u2014";

const glAccountTypeStyles: Record<string, string> = {
	ASSET: "bg-blue-100 text-blue-800",
	LIABILITY: "bg-purple-100 text-purple-800",
	INCOME: "bg-green-100 text-green-800",
	EXPENSE: "bg-red-100 text-red-800",
	EQUITY: "bg-indigo-100 text-indigo-800",
};

const tabs: { key: AccountingTab; label: string }[] = [
	{ key: "trial-balance", label: "Trial Balance" },
	{ key: "fee-tax-summary", label: "Fee & Tax Summary" },
];

export const AccountingView: FC<ReturnType<typeof useAccounting>> = ({
	activeTab,
	setActiveTab,
	currencyCode,
	setCurrencyCode,
	fromDate,
	setFromDate,
	toDate,
	setToDate,
	trialBalance,
	isLoadingTrialBalance,
	isErrorTrialBalance,
	feeTaxSummary,
	isLoadingFeeTax,
	isErrorFeeTax,
	refetch,
}) => {
	const isError =
		activeTab === "trial-balance" ? isErrorTrialBalance : isErrorFeeTax;

	if (isError) {
		return (
			<ErrorFallback
				message="Failed to load accounting reports."
				onRetry={refetch}
			/>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							Accounting Reports
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							Trial balance and fee/tax summaries for the asset service GL
							accounts
						</p>
					</div>
					<Button onClick={refetch} className="flex items-center gap-2">
						<RefreshCw className="h-4 w-4" />
						Refresh
					</Button>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<BookOpen className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">GL Accounts</p>
								<p className="text-2xl font-bold text-gray-900">
									{trialBalance?.entries.length ?? "\u2014"}
								</p>
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<DollarSign className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Total Debits</p>
								<p className="text-2xl font-bold text-gray-900">
									{fmt(trialBalance?.totalDebits)}
								</p>
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-purple-100 rounded-lg">
								<Receipt className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Total Credits</p>
								<p className="text-2xl font-bold text-gray-900">
									{fmt(trialBalance?.totalCredits)}
								</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Filter Bar */}
				<div className="flex gap-3 mb-4 flex-wrap items-end">
					<div>
						<label className="block text-xs text-gray-500 mb-1">Currency</label>
						<select
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
							value={currencyCode}
							onChange={(e) => setCurrencyCode(e.target.value)}
						>
							<option value="XAF">XAF</option>
						</select>
					</div>
					<div>
						<label className="block text-xs text-gray-500 mb-1">From</label>
						<input
							type="date"
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
							value={fromDate}
							onChange={(e) => setFromDate(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-xs text-gray-500 mb-1">To</label>
						<input
							type="date"
							className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
							value={toDate}
							onChange={(e) => setToDate(e.target.value)}
						/>
					</div>
				</div>

				{/* Tab Selector */}
				<div className="flex border-b border-gray-200 mb-4">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
								activeTab === tab.key
									? "border-blue-600 text-blue-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content */}
				{activeTab === "trial-balance" && (
					<Card className="overflow-hidden">
						{isLoadingTrialBalance ? (
							<div className="flex justify-center py-12">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
							</div>
						) : !trialBalance || trialBalance.entries.length === 0 ? (
							<p className="text-sm text-gray-500 text-center py-12">
								No trial balance entries found
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="text-left text-xs text-gray-500 uppercase border-b bg-gray-50">
											<th className="px-4 py-3">GL Code</th>
											<th className="px-4 py-3">Account Name</th>
											<th className="px-4 py-3">Type</th>
											<th className="px-4 py-3 text-right">Debits</th>
											<th className="px-4 py-3 text-right">Credits</th>
											<th className="px-4 py-3 text-right">Balance</th>
										</tr>
									</thead>
									<tbody>
										{trialBalance.entries.map((entry) => (
											<tr
												key={entry.glAccountId}
												className="border-b border-gray-100 hover:bg-gray-50"
											>
												<td className="px-4 py-3 font-mono text-xs">
													{entry.glCode}
												</td>
												<td className="px-4 py-3 font-medium">
													{entry.glAccountName}
												</td>
												<td className="px-4 py-3">
													<span
														className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${glAccountTypeStyles[entry.glAccountType] ?? "bg-gray-100 text-gray-800"}`}
													>
														{entry.glAccountType}
													</span>
												</td>
												<td className="px-4 py-3 text-right font-mono">
													{fmt(entry.debitAmount)}
												</td>
												<td className="px-4 py-3 text-right font-mono">
													{fmt(entry.creditAmount)}
												</td>
												<td className="px-4 py-3 text-right font-mono font-medium">
													{fmt(entry.balance)}
												</td>
											</tr>
										))}
									</tbody>
									<tfoot>
										<tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
											<td className="px-4 py-3" colSpan={3}>
												Totals
											</td>
											<td className="px-4 py-3 text-right font-mono">
												{fmt(trialBalance.totalDebits)}
											</td>
											<td className="px-4 py-3 text-right font-mono">
												{fmt(trialBalance.totalCredits)}
											</td>
											<td className="px-4 py-3 text-right font-mono">
												{fmt(
													trialBalance.totalDebits - trialBalance.totalCredits,
												)}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						)}
					</Card>
				)}

				{activeTab === "fee-tax-summary" && (
					<Card className="overflow-hidden">
						{isLoadingFeeTax ? (
							<div className="flex justify-center py-12">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
							</div>
						) : !feeTaxSummary || feeTaxSummary.entries.length === 0 ? (
							<p className="text-sm text-gray-500 text-center py-12">
								No fee/tax entries found
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full text-sm">
									<thead>
										<tr className="text-left text-xs text-gray-500 uppercase border-b bg-gray-50">
											<th className="px-4 py-3">Category</th>
											<th className="px-4 py-3">GL Code</th>
											<th className="px-4 py-3">Description</th>
											<th className="px-4 py-3 text-right">Amount</th>
											<th className="px-4 py-3 text-right">Transactions</th>
										</tr>
									</thead>
									<tbody>
										{feeTaxSummary.entries.map((entry, idx) => (
											<tr
												key={`${entry.glCode}-${idx}`}
												className="border-b border-gray-100 hover:bg-gray-50"
											>
												<td className="px-4 py-3">
													<StatusBadge status={entry.category} />
												</td>
												<td className="px-4 py-3 font-mono text-xs">
													{entry.glCode}
												</td>
												<td className="px-4 py-3 font-medium">
													{entry.description}
												</td>
												<td className="px-4 py-3 text-right font-mono">
													{fmt(entry.amount)}
												</td>
												<td className="px-4 py-3 text-right font-mono">
													{fmt(entry.transactionCount)}
												</td>
											</tr>
										))}
									</tbody>
									<tfoot>
										<tr className="bg-gray-50 font-semibold border-t-2 border-gray-300">
											<td className="px-4 py-3" colSpan={3}>
												Total
											</td>
											<td className="px-4 py-3 text-right font-mono">
												{fmt(feeTaxSummary.total)}
											</td>
											<td className="px-4 py-3 text-right font-mono">
												{fmt(
													feeTaxSummary.entries.reduce(
														(sum, e) => sum + e.transactionCount,
														0,
													),
												)}
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						)}
					</Card>
				)}
			</main>
		</div>
	);
};
