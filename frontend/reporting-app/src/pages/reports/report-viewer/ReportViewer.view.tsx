import { Card } from "@fineract-apps/ui";
import { Download, FileSpreadsheet, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReportViewerData } from "./ReportViewer.types";

interface ReportViewerViewProps extends ReportViewerData {
	reportName: string;
	onClose: () => void;
}

export function ReportViewerView({
	reportName,
	columnHeaders,
	data,
	isLoading,
	error,
	onClose,
	onExportCSV,
	onExportExcel,
}: ReportViewerViewProps) {
	const { t } = useTranslation();
	const formatCellValue = (value: unknown, columnType: string): string => {
		if (value === null || value === undefined) return "-";

		switch (columnType) {
			case "DECIMAL":
				return typeof value === "number"
					? value.toLocaleString(undefined, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})
					: String(value);
			case "INTEGER":
				return typeof value === "number"
					? value.toLocaleString()
					: String(value);
			case "DATE":
			case "DATETIME":
				if (Array.isArray(value) && value.length >= 3) {
					try {
						// Handles dates like [2024, 2, 1]
						const [year, month, day] = value;
						const date = new Date(year, month - 1, day);
						return date.toLocaleDateString();
					} catch {
						// Fallback for unexpected array format
						return value.join("-");
					}
				}
				// Format date if it's a string date
				if (typeof value === "string" && value.includes("-")) {
					try {
						const date = new Date(value);
						return date.toLocaleDateString();
					} catch {
						return String(value);
					}
				}
				return String(value);
			case "BOOLEAN":
				return value ? t("reportViewer.yes") : t("reportViewer.no");
			default:
				return String(value);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<Card className="w-full max-w-7xl max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
					<h2 className="text-xl font-bold">{reportName}</h2>
					<div className="flex items-center gap-2">
						{!isLoading && !error && data.length > 0 && (
							<>
								<button
									onClick={onExportCSV}
									className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
									type="button"
								>
									<Download className="w-4 h-4" />
									{t("reportViewer.csv")}
								</button>
								<button
									onClick={onExportExcel}
									className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
									type="button"
								>
									<FileSpreadsheet className="w-4 h-4" />
									{t("reportViewer.excel")}
								</button>
							</>
						)}
						<button
							onClick={onClose}
							className="p-2 hover:bg-gray-100 rounded-full"
							type="button"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-auto p-6">
					{isLoading ? (
						<div className="flex items-center justify-center h-64">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
								<p className="text-gray-600">{t("reportViewer.loading")}</p>
							</div>
						</div>
					) : error ? (
						<div className="flex items-center justify-center h-64">
							<div className="text-center">
								<p className="text-red-600 font-semibold mb-2">
									{t("reportViewer.error")}
								</p>
								<p className="text-gray-600">{error.message}</p>
							</div>
						</div>
					) : data.length === 0 ? (
						<div className="flex items-center justify-center h-64">
							<p className="text-gray-600">{t("reportViewer.noData")}</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200">
								<thead className="bg-gray-50 sticky top-0">
									<tr>
										{columnHeaders.map((header, index) => (
											<th
												key={`${header.columnName}-${index}`}
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
											>
												{header.columnName}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{data.map((row, rowIndex) => (
										<tr
											key={`row-${rowIndex}-${row.row[0]}`}
											className="hover:bg-gray-50 transition-colors"
										>
											{row.row.map((cell, cellIndex) => (
												<td
													key={`${columnHeaders[cellIndex]?.columnName || cellIndex}-${rowIndex}`}
													className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
												>
													{formatCellValue(
														cell,
														columnHeaders[cellIndex]?.columnDisplayType ||
															"STRING",
													)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>

							<div className="mt-4 text-sm text-gray-600">
								{t("reportViewer.showingRows", { count: data.length })}
							</div>
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}
