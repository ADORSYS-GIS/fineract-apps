import { Card } from "@fineract-apps/ui";
import { Download, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TransactionHistoryData } from "./TransactionHistory.types";

export function TransactionHistoryView({
	transactions,
	isLoading,
	pagination,
	filters,
	onFilterChange,
	onPageChange,
	onExportCSV,
	onExportExcel,
}: TransactionHistoryData) {
	const { t } = useTranslation();
	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="text-3xl font-bold mb-6">{t("transactions.title")}</h1>
				<p>{t("transactions.loading")}</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">{t("transactions.title")}</h1>
				<div className="flex gap-2">
					<button
						onClick={onExportCSV}
						className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
					>
						<Download className="w-4 h-4 mr-2" />
						{t("transactions.exportCsv")}
					</button>
					<button
						onClick={onExportExcel}
						className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
					>
						<Download className="w-4 h-4 mr-2" />
						{t("transactions.exportExcel")}
					</button>
				</div>
			</div>

			<Card className="p-6 mb-6">
				<div className="flex items-center mb-4">
					<Filter className="w-5 h-5 mr-2 text-gray-600" />
					<h2 className="text-lg font-semibold">{t("transactions.filters")}</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							{t("transactions.fromDate")}
						</label>
						<input
							type="date"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.fromDate}
							onChange={(e) => onFilterChange("fromDate", e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							{t("transactions.toDate")}
						</label>
						<input
							type="date"
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.toDate}
							onChange={(e) => onFilterChange("toDate", e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							{t("transactions.transactionType")}
						</label>
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.transactionType}
							onChange={(e) =>
								onFilterChange("transactionType", e.target.value)
							}
						>
							<option value="">{t("transactions.allTypes")}</option>
							<option value="deposit">{t("transactions.deposit")}</option>
							<option value="withdrawal">{t("transactions.withdrawal")}</option>
							<option value="transfer">{t("transactions.transfer")}</option>
						</select>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				{transactions.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left p-2">{t("transactions.id")}</th>
										<th className="text-left p-2">
											{t("transactions.action")}
										</th>
										<th className="text-left p-2">
											{t("transactions.entity")}
										</th>
										<th className="text-left p-2">
											{t("transactions.madeBy")}
										</th>
										<th className="text-left p-2">{t("transactions.date")}</th>
										<th className="text-left p-2">
											{t("transactions.status")}
										</th>
									</tr>
								</thead>
								<tbody>
									{transactions.map((transaction) => (
										<tr key={transaction.id} className="border-b">
											<td className="p-2">{transaction.id}</td>
											<td className="p-2">{transaction.actionName}</td>
											<td className="p-2">{transaction.entityName}</td>
											<td className="p-2">{transaction.maker}</td>
											<td className="p-2">{transaction.madeOnDate}</td>
											<td className="p-2">{transaction.processingResult}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="flex justify-between items-center mt-4">
							<p className="text-sm text-gray-600">
								{t("transactions.showing", {
									count: transactions.length,
									total: pagination.totalItems,
								})}
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => onPageChange(pagination.currentPage - 1)}
									disabled={pagination.currentPage === 1}
									className="px-3 py-1 border rounded disabled:opacity-50"
								>
									{t("transactions.previous")}
								</button>
								<span className="px-3 py-1">
									{t("transactions.page", {
										currentPage: pagination.currentPage,
										totalPages: pagination.totalPages,
									})}
								</span>
								<button
									onClick={() => onPageChange(pagination.currentPage + 1)}
									disabled={pagination.currentPage === pagination.totalPages}
									className="px-3 py-1 border rounded disabled:opacity-50"
								>
									{t("transactions.next")}
								</button>
							</div>
						</div>
					</>
				) : (
					<p className="text-center text-gray-600">
						{t("transactions.noTransactions")}
					</p>
				)}
			</Card>
		</div>
	);
}
