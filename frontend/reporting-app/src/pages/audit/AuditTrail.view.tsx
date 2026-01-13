import { Card } from "@fineract-apps/ui";
import { Download, Filter, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AuditTrailData } from "./AuditTrail.types";

export function AuditTrailView({
	audits,
	isLoading,
	pagination,
	filters,
	onFilterChange,
	onPageChange,
	onExportCSV,
	onExportExcel,
}: Readonly<AuditTrailData>) {
	const { t } = useTranslation();
	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="text-3xl font-bold mb-6">{t("audit.title")}</h1>
				<p>{t("audit.loading")}</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center">
					<Shield className="w-8 h-8 mr-3 text-purple-500" />
					<h1 className="text-3xl font-bold">{t("audit.title")}</h1>
				</div>
				<div className="flex gap-2">
					<button
						onClick={onExportCSV}
						className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
					>
						<Download className="w-4 h-4 mr-2" />
						{t("audit.exportCsv")}
					</button>
					<button
						onClick={onExportExcel}
						className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
					>
						<Download className="w-4 h-4 mr-2" />
						{t("audit.exportExcel")}
					</button>
				</div>
			</div>

			<Card className="p-6 mb-6">
				<div className="flex items-center mb-4">
					<Filter className="w-5 h-5 mr-2 text-gray-600" />
					<h2 className="text-lg font-semibold">{t("audit.filters")}</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							{t("audit.fromDate")}
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
							{t("audit.toDate")}
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
							{t("audit.action")}
						</label>
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.actionName}
							onChange={(e) => onFilterChange("actionName", e.target.value)}
						>
							<option value="">{t("audit.allActions")}</option>
							<option value="CREATE">{t("audit.create")}</option>
							<option value="UPDATE">{t("audit.update")}</option>
							<option value="DELETE">{t("audit.delete")}</option>
							<option value="APPROVE">{t("audit.approve")}</option>
							<option value="REJECT">{t("audit.reject")}</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">
							{t("audit.entity")}
						</label>
						<select
							className="w-full px-3 py-2 border border-gray-300 rounded-lg"
							value={filters.entityName}
							onChange={(e) => onFilterChange("entityName", e.target.value)}
						>
							<option value="">{t("audit.allEntities")}</option>
							<option value="CLIENT">{t("audit.client")}</option>
							<option value="LOAN">{t("audit.loan")}</option>
							<option value="SAVINGS">{t("audit.savingsAccount")}</option>
							<option value="USER">{t("audit.user")}</option>
							<option value="OFFICE">{t("audit.office")}</option>
						</select>
					</div>
				</div>
			</Card>

			<Card className="p-6">
				{audits.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("audit.id")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("audit.action")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("audit.entity")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("audit.madeBy")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("audit.madeOn")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("audit.status")}
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{audits.map((audit) => (
										<tr key={audit.id}>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{audit.id}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{audit.actionName}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{audit.entityName}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{audit.maker}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{new Date(audit.madeOnDate).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{audit.processingResult}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="flex justify-between items-center mt-4">
							<span className="text-sm text-gray-700">
								{t("audit.showing", {
									count: audits.length,
									total: pagination.totalItems,
								})}
							</span>
							<div className="flex gap-2">
								<button
									onClick={() => onPageChange(pagination.currentPage - 1)}
									disabled={pagination.currentPage === 1}
									className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
								>
									{t("audit.previous")}
								</button>
								<button
									onClick={() => onPageChange(pagination.currentPage + 1)}
									disabled={pagination.currentPage === pagination.totalPages}
									className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
								>
									{t("audit.next")}
								</button>
							</div>
						</div>
					</>
				) : (
					<div className="text-center text-gray-600">
						{t("audit.noEntries")}
					</div>
				)}
			</Card>
		</div>
	);
}
