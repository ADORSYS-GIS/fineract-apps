import { Button, Card, Pagination } from "@fineract-apps/ui";
import { Download, Eye } from "lucide-react";
import type { DateRange, JournalEntry } from "./useJournalEntries";

interface JournalEntriesViewProps {
	journalEntries: JournalEntry[];
	isLoading: boolean;
	dateRange: DateRange;
	transactionType: string;
	onDateRangeChange: (range: DateRange) => void;
	onFilterByType: (type: string) => void;
	onExportCSV: () => void;
	onViewDetails: (entryId: number) => void;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function JournalEntriesView({
	journalEntries,
	isLoading,
	dateRange,
	transactionType,
	onDateRangeChange,
	onFilterByType,
	onExportCSV,
	onViewDetails,
	currentPage,
	totalPages,
	onPageChange,
}: JournalEntriesViewProps) {
	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Journal Entries</h1>
				<Button onClick={onExportCSV} className="flex items-center gap-2">
					<Download className="h-4 w-4" />
					Export CSV
				</Button>
			</div>

			<Card className="p-6 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							From Date
						</label>
						<input
							type="date"
							value={dateRange.from.toISOString().split("T")[0]}
							onChange={(e) =>
								onDateRangeChange({
									...dateRange,
									from: new Date(e.target.value),
								})
							}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							To Date
						</label>
						<input
							type="date"
							value={dateRange.to.toISOString().split("T")[0]}
							onChange={(e) =>
								onDateRangeChange({
									...dateRange,
									to: new Date(e.target.value),
								})
							}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Transaction Type
						</label>
						<select
							value={transactionType}
							onChange={(e) => onFilterByType(e.target.value)}
							className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">All Types</option>
							<option value="DEBIT">Debit</option>
							<option value="CREDIT">Credit</option>
						</select>
					</div>
				</div>
			</Card>

			{isLoading ? (
				<Card className="p-6">
					<div className="animate-pulse space-y-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-16 bg-gray-200 rounded" />
						))}
					</div>
				</Card>
			) : journalEntries.length === 0 ? (
				<Card className="p-6 text-center text-gray-500">
					<p>
						No journal entries found for the selected date range and filters.
					</p>
				</Card>
			) : (
				<Card className="overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Transaction ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Office
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Reference Number
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Amount
									</th>
									<th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{journalEntries.map((entry) => (
									<tr key={entry.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{entry.transactionId}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{new Date(entry.transactionDate).toLocaleDateString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{entry.officeName}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{entry.referenceNumber || "-"}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
											${entry.amount.toLocaleString()}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-center text-sm">
											<Button
												onClick={() => onViewDetails(entry.id)}
												variant="ghost"
												size="sm"
												className="inline-flex items-center gap-1"
											>
												<Eye className="h-4 w-4" />
												View
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{totalPages > 1 && (
						<div className="p-4">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={onPageChange}
							/>
						</div>
					)}
				</Card>
			)}
		</div>
	);
}
