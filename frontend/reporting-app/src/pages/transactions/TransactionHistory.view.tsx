import { Card } from "@fineract-apps/ui";
import { Download, Filter } from "lucide-react";
import type { TransactionHistoryData } from "./TransactionHistory.types";

export function TransactionHistoryView({
	isLoading,
	filters,
	onFilterChange,
	onExport,
}: TransactionHistoryData) {
	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="text-3xl font-bold mb-6">Transaction History</h1>
				<p>Loading transactions...</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Transaction History</h1>
				<button
					onClick={onExport}
					className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
				>
					<Download className="w-4 h-4 mr-2" />
					Export
				</button>
			</div>

			<Card className="p-6 mb-6">
				<div className="flex items-center mb-4">
					<Filter className="w-5 h-5 mr-2 text-gray-600" />
					<h2 className="text-lg font-semibold">Filters</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">From Date</label>
						<input
							type="date"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.fromDate}
							onChange={(e) => onFilterChange("fromDate", e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">To Date</label>
						<input
							type="date"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.toDate}
							onChange={(e) => onFilterChange("toDate", e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							Transaction Type
						</label>
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.transactionType}
							onChange={(e) =>
								onFilterChange("transactionType", e.target.value)
							}
						>
							<option value="">All Types</option>
							<option value="deposit">Deposit</option>
							<option value="withdrawal">Withdrawal</option>
							<option value="transfer">Transfer</option>
						</select>
					</div>
				</div>
			</Card>

			<Card className="p-6 text-center text-gray-600">
				No transactions found. Transaction history will be displayed here.
			</Card>
		</div>
	);
}
