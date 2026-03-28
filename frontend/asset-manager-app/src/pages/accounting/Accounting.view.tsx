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
}) => {
	const entries = trialBalance?.entries ?? [];
	const nonHeaderEntries = entries.filter((e) => !e.header);
	const activeEntries = nonHeaderEntries.filter(
		(e) => e.debitAmount > 0 || e.creditAmount > 0,
	);
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
			</div>

			{/* Trial Balance Table */}
			{isLoading ? (
				<div className="text-center py-8 text-gray-500">
					Loading trial balance...
				</div>
			) : isError ? (
				<div className="text-center py-8 text-red-500">
					Failed to load trial balance. Check asset-service connection.
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
							{entries.map((entry) => (
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
