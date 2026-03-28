import { BookOpen, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { FC } from "react";

interface TrialBalanceEntry {
	glAccountId: number;
	glCode: string;
	glAccountName: string;
	glAccountType: string;
	header: boolean;
	parentGlCode: string | null;
	depth: number;
	debitAmount: number;
	creditAmount: number;
	balance: number;
}

interface TrialBalanceResponse {
	currencyCode: string;
	fromDate?: string;
	toDate?: string;
	entries: TrialBalanceEntry[];
	totalDebits: number;
	totalCredits: number;
}

interface AccountingViewProps {
	trialBalance?: TrialBalanceResponse;
	currencies: string[];
	currencyCode: string;
	setCurrencyCode: (v: string) => void;
	fromDate: string;
	setFromDate: (v: string) => void;
	toDate: string;
	setToDate: (v: string) => void;
	isLoading: boolean;
	isError: boolean;
	refetch: () => void;
	hideInactive: boolean;
	setHideInactive: (v: boolean) => void;
	activeTab: string;
	setActiveTab: (
		v: "trial-balance" | "income-statement" | "balance-sheet" | "tax-report",
	) => void;
}

const TYPE_COLORS: Record<string, string> = {
	ASSET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
	LIABILITY:
		"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
	EQUITY:
		"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
	INCOME:
		"bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
	EXPENSE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const fmt = (n: number) =>
	new Intl.NumberFormat("fr-FR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(n);

export const AccountingView: FC<AccountingViewProps> = ({
	trialBalance,
	currencies,
	currencyCode,
	setCurrencyCode,
	fromDate,
	setFromDate,
	toDate,
	setToDate,
	isLoading,
	isError,
	refetch,
	hideInactive,
	setHideInactive,
	activeTab,
	setActiveTab,
}) => {
	const entries = trialBalance?.entries ?? [];
	const nonHeaderEntries = entries.filter((e) => !e.header);
	const activeEntries = nonHeaderEntries.filter(
		(e) => e.debitAmount > 0 || e.creditAmount > 0,
	);

	// Filter entries based on hideInactive toggle
	const displayEntries = hideInactive
		? entries.filter((e) => {
				if (e.header) {
					// Show header only if any child has activity
					return entries.some(
						(c) =>
							c.parentGlCode === e.glCode &&
							(c.debitAmount > 0 || c.creditAmount > 0),
					);
				}
				return e.debitAmount > 0 || e.creditAmount > 0;
			})
		: entries;

	// Derived reports from trial balance data
	const revenueEntries = activeEntries.filter(
		(e) =>
			e.glAccountType === "INCOME" && (e.debitAmount > 0 || e.creditAmount > 0),
	);
	const expenseEntries = activeEntries.filter(
		(e) =>
			e.glAccountType === "EXPENSE" &&
			(e.debitAmount > 0 || e.creditAmount > 0),
	);
	const totalRevenue = revenueEntries.reduce(
		(sum, e) => sum + e.creditAmount,
		0,
	);
	const totalExpenses = expenseEntries.reduce(
		(sum, e) => sum + e.debitAmount,
		0,
	);
	const netIncome = totalRevenue - totalExpenses;

	const assetEntries = activeEntries.filter((e) => e.glAccountType === "ASSET");
	const liabilityEntries = activeEntries.filter(
		(e) => e.glAccountType === "LIABILITY",
	);
	const equityEntries = activeEntries.filter(
		(e) => e.glAccountType === "EQUITY",
	);
	const totalAssets = assetEntries.reduce(
		(sum, e) => sum + (e.debitAmount - e.creditAmount),
		0,
	);
	const totalLiabilities = liabilityEntries.reduce(
		(sum, e) => sum + (e.creditAmount - e.debitAmount),
		0,
	);
	const totalEquity =
		equityEntries.reduce(
			(sum, e) => sum + (e.creditAmount - e.debitAmount),
			0,
		) + netIncome;

	const taxEntries = entries.filter(
		(e) =>
			e.glCode.startsWith("430") &&
			!e.header &&
			(e.debitAmount > 0 || e.creditAmount > 0),
	);
	const lpTaxEntry = entries.find((e) => e.glCode === "4013");
	const totalTaxCollected = taxEntries.reduce(
		(sum, e) => sum + (e.creditAmount - e.debitAmount),
		0,
	);
	const lpTaxWithheld = lpTaxEntry
		? lpTaxEntry.creditAmount - lpTaxEntry.debitAmount
		: 0;
	const balanceDiff =
		(trialBalance?.totalDebits ?? 0) - (trialBalance?.totalCredits ?? 0);
	const isBalanced = Math.abs(balanceDiff) < 1;

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold dark:text-white">Accounting</h1>
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						Trial balance and fee/tax summaries for the asset service GL
						accounts
					</p>
				</div>
				<button
					onClick={() => refetch()}
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
				>
					<RefreshCw className="w-4 h-4" />
					Refresh
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
					<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
						<BookOpen className="w-4 h-4" />
						GL Accounts
					</div>
					<p className="text-2xl font-bold dark:text-white mt-1">
						{entries.length}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
					<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
						<TrendingUp className="w-4 h-4" />
						Total Debits
					</div>
					<p className="text-2xl font-bold dark:text-white mt-1">
						{fmt(trialBalance?.totalDebits ?? 0)}
					</p>
				</div>
				<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
					<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
						<TrendingDown className="w-4 h-4" />
						Total Credits
					</div>
					<p className="text-2xl font-bold dark:text-white mt-1">
						{fmt(trialBalance?.totalCredits ?? 0)}
					</p>
				</div>
				<div
					className={`rounded-lg p-4 shadow ${isBalanced ? "bg-green-50 dark:bg-green-900/30" : "bg-red-50 dark:bg-red-900/30"}`}
				>
					<div className="text-gray-500 dark:text-gray-400 text-sm">
						Balance Check
					</div>
					<p
						className={`text-2xl font-bold mt-1 ${isBalanced ? "text-green-600" : "text-red-600"}`}
					>
						{isBalanced ? "Balanced" : `Off by ${fmt(balanceDiff)}`}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="flex gap-4 items-center">
				<div>
					<label className="text-sm text-gray-500 dark:text-gray-400">
						Currency
					</label>
					<select
						value={currencyCode}
						onChange={(e) => setCurrencyCode(e.target.value)}
						className="ml-2 px-3 py-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
					>
						{currencies.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="text-sm text-gray-500 dark:text-gray-400">
						From
					</label>
					<input
						type="date"
						value={fromDate}
						onChange={(e) => setFromDate(e.target.value)}
						className="ml-2 px-3 py-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
					/>
				</div>
				<div>
					<label className="text-sm text-gray-500 dark:text-gray-400">To</label>
					<input
						type="date"
						value={toDate}
						onChange={(e) => setToDate(e.target.value)}
						className="ml-2 px-3 py-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
					/>
				</div>
				<label className="flex items-center gap-2 cursor-pointer">
					<input
						type="checkbox"
						checked={hideInactive}
						onChange={(e) => setHideInactive(e.target.checked)}
						className="rounded"
					/>
					<span className="text-sm text-gray-500 dark:text-gray-400">
						Hide inactive accounts
					</span>
				</label>
			</div>

			{/* Tabs */}
			<div className="flex gap-1 border-b dark:border-gray-700">
				{(
					[
						["trial-balance", "Trial Balance"],
						["income-statement", "Income Statement"],
						["balance-sheet", "Balance Sheet"],
						["tax-report", "Tax Report"],
					] as const
				).map(([key, label]) => (
					<button
						key={key}
						onClick={() => setActiveTab(key)}
						className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
							activeTab === key
								? "border-blue-600 text-blue-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
					>
						{label}
					</button>
				))}
			</div>

			{/* Tab Content */}
			{isLoading ? (
				<div className="text-center py-8 text-gray-500">Loading...</div>
			) : isError ? (
				<div className="text-center py-8 text-red-500">
					Failed to load trial balance. Check asset-service connection.
				</div>
			) : activeTab === "income-statement" ? (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
					<div>
						<h3 className="text-lg font-semibold dark:text-white mb-3">
							Revenue
						</h3>
						{revenueEntries.length === 0 ? (
							<p className="text-gray-400">No revenue recorded</p>
						) : (
							revenueEntries.map((e) => (
								<div
									key={e.glCode}
									className="flex justify-between py-1 dark:text-gray-200"
								>
									<span>
										GL {e.glCode} — {e.glAccountName}
									</span>
									<span className="font-mono text-green-600">
										{fmt(e.creditAmount)}
									</span>
								</div>
							))
						)}
						<div className="flex justify-between py-2 border-t dark:border-gray-700 font-bold dark:text-white">
							<span>Total Revenue</span>
							<span className="font-mono text-green-600">
								{fmt(totalRevenue)}
							</span>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold dark:text-white mb-3">
							Expenses
						</h3>
						{expenseEntries.length === 0 ? (
							<p className="text-gray-400">No expenses recorded</p>
						) : (
							expenseEntries.map((e) => (
								<div
									key={e.glCode}
									className="flex justify-between py-1 dark:text-gray-200"
								>
									<span>
										GL {e.glCode} — {e.glAccountName}
									</span>
									<span className="font-mono text-red-500">
										{fmt(e.debitAmount)}
									</span>
								</div>
							))
						)}
						<div className="flex justify-between py-2 border-t dark:border-gray-700 font-bold dark:text-white">
							<span>Total Expenses</span>
							<span className="font-mono text-red-500">
								{fmt(totalExpenses)}
							</span>
						</div>
					</div>
					<div className="flex justify-between py-3 border-t-2 dark:border-gray-600 text-xl font-bold dark:text-white">
						<span>Net Income</span>
						<span
							className={`font-mono ${netIncome >= 0 ? "text-green-600" : "text-red-500"}`}
						>
							{fmt(netIncome)} XAF
						</span>
					</div>
				</div>
			) : activeTab === "balance-sheet" ? (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
					<div>
						<h3 className="text-lg font-semibold dark:text-white mb-3">
							Assets
						</h3>
						{assetEntries
							.filter((e) => e.debitAmount > 0 || e.creditAmount > 0)
							.map((e) => (
								<div
									key={e.glCode}
									className="flex justify-between py-1 dark:text-gray-200"
								>
									<span>
										GL {e.glCode} — {e.glAccountName}
									</span>
									<span className="font-mono">
										{fmt(e.debitAmount - e.creditAmount)}
									</span>
								</div>
							))}
						<div className="flex justify-between py-2 border-t dark:border-gray-700 font-bold dark:text-white">
							<span>Total Assets</span>
							<span className="font-mono">{fmt(totalAssets)}</span>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold dark:text-white mb-3">
							Liabilities
						</h3>
						{liabilityEntries
							.filter((e) => e.debitAmount > 0 || e.creditAmount > 0)
							.map((e) => (
								<div
									key={e.glCode}
									className="flex justify-between py-1 dark:text-gray-200"
								>
									<span>
										GL {e.glCode} — {e.glAccountName}
									</span>
									<span className="font-mono">
										{fmt(e.creditAmount - e.debitAmount)}
									</span>
								</div>
							))}
						<div className="flex justify-between py-2 border-t dark:border-gray-700 font-bold dark:text-white">
							<span>Total Liabilities</span>
							<span className="font-mono">{fmt(totalLiabilities)}</span>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold dark:text-white mb-3">
							Equity
						</h3>
						<div className="flex justify-between py-1 dark:text-gray-200">
							<span>Retained Earnings (Net Income)</span>
							<span className="font-mono">{fmt(netIncome)}</span>
						</div>
						<div className="flex justify-between py-2 border-t dark:border-gray-700 font-bold dark:text-white">
							<span>Total Equity</span>
							<span className="font-mono">{fmt(totalEquity)}</span>
						</div>
					</div>
					<div
						className={`flex justify-between py-3 border-t-2 text-lg font-bold ${Math.abs(totalAssets - totalLiabilities - totalEquity) < 1 ? "text-green-600 border-green-200" : "text-red-500 border-red-200"}`}
					>
						<span>Assets = Liabilities + Equity</span>
						<span>
							{fmt(totalAssets)} = {fmt(totalLiabilities)} + {fmt(totalEquity)}
						</span>
					</div>
				</div>
			) : activeTab === "tax-report" ? (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
					<h3 className="text-lg font-semibold dark:text-white">
						Tax Collected (DGI)
					</h3>
					{taxEntries.length === 0 ? (
						<p className="text-gray-400">No taxes collected</p>
					) : (
						taxEntries.map((e) => (
							<div
								key={e.glCode}
								className="flex justify-between py-2 dark:text-gray-200"
							>
								<span>
									GL {e.glCode} — {e.glAccountName}
								</span>
								<span className="font-mono">
									{fmt(e.creditAmount - e.debitAmount)} XAF
								</span>
							</div>
						))
					)}
					<div className="flex justify-between py-2 border-t dark:border-gray-700 font-bold dark:text-white">
						<span>Total Tax Collected</span>
						<span className="font-mono">{fmt(totalTaxCollected)} XAF</span>
					</div>
					{lpTaxWithheld > 0 && (
						<div className="mt-4 pt-4 border-t dark:border-gray-700">
							<h3 className="text-lg font-semibold dark:text-white mb-2">
								LP Tax Withheld (Pending Remittance)
							</h3>
							<div className="flex justify-between py-2 dark:text-gray-200">
								<span>GL 4013 — LP Tax Withholding</span>
								<span className="font-mono text-yellow-600">
									{fmt(lpTaxWithheld)} XAF
								</span>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b dark:border-gray-700 text-left text-gray-500 dark:text-gray-400">
								<th className="px-4 py-3">GL CODE</th>
								<th className="px-4 py-3">ACCOUNT NAME</th>
								<th className="px-4 py-3">TYPE</th>
								<th className="px-4 py-3 text-right">DEBITS</th>
								<th className="px-4 py-3 text-right">CREDITS</th>
								<th className="px-4 py-3 text-right">BALANCE</th>
							</tr>
						</thead>
						<tbody>
							{displayEntries.map((entry) => (
								<tr
									key={entry.glAccountId}
									className={`border-b dark:border-gray-700 ${
										entry.header
											? "bg-gray-50 dark:bg-gray-700/50 font-semibold"
											: ""
									} ${entry.debitAmount === 0 && entry.creditAmount === 0 && !entry.header ? "text-gray-400 dark:text-gray-500" : ""}`}
								>
									<td className="px-4 py-2 font-mono">
										{entry.depth > 0 && (
											<span className="text-gray-300 dark:text-gray-600 mr-2">
												└
											</span>
										)}
										{entry.glCode}
									</td>
									<td
										className="px-4 py-2 dark:text-gray-200"
										style={{
											paddingLeft: `${entry.depth * 20 + 16}px`,
										}}
									>
										{entry.glAccountName}
									</td>
									<td className="px-4 py-2">
										<span
											className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[entry.glAccountType] ?? "bg-gray-100 text-gray-800"}`}
										>
											{entry.glAccountType}
										</span>
									</td>
									<td className="px-4 py-2 text-right font-mono dark:text-gray-200">
										{entry.header
											? ""
											: entry.debitAmount > 0
												? fmt(entry.debitAmount)
												: ""}
									</td>
									<td className="px-4 py-2 text-right font-mono dark:text-gray-200">
										{entry.header
											? ""
											: entry.creditAmount > 0
												? fmt(entry.creditAmount)
												: ""}
									</td>
									<td
										className={`px-4 py-2 text-right font-mono ${entry.balance < 0 ? "text-red-500" : entry.balance > 0 ? "text-green-600" : "dark:text-gray-200"}`}
									>
										{entry.header
											? ""
											: entry.balance !== 0
												? fmt(entry.balance)
												: ""}
									</td>
								</tr>
							))}
							{/* Footer totals */}
							<tr className="border-t-2 dark:border-gray-600 font-bold bg-gray-50 dark:bg-gray-700/50">
								<td className="px-4 py-3" colSpan={3}>
									Totals
								</td>
								<td className="px-4 py-3 text-right font-mono dark:text-gray-200">
									{fmt(trialBalance?.totalDebits ?? 0)}
								</td>
								<td className="px-4 py-3 text-right font-mono dark:text-gray-200">
									{fmt(trialBalance?.totalCredits ?? 0)}
								</td>
								<td
									className={`px-4 py-3 text-right font-mono ${Math.abs(balanceDiff) < 1 ? "text-green-600" : "text-red-500"}`}
								>
									{fmt(balanceDiff)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}

			{/* Summary stats */}
			{!isLoading && (
				<div className="text-sm text-gray-500 dark:text-gray-400">
					Showing {entries.length} GL accounts ({activeEntries.length} with
					activity) &middot; {currencyCode}
				</div>
			)}
		</div>
	);
};
