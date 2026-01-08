import type {
	ColumnHeader,
	ReportDataRow,
} from "@/pages/reports/report-viewer/ReportViewer.types";

/**
 * Export report data to CSV format
 */
export function exportToCSV(
	columnHeaders: ColumnHeader[],
	data: ReportDataRow[],
	filename: string,
): void {
	// Create CSV header row
	const headers = columnHeaders.map((h) => h.columnName).join(",");

	// Create CSV data rows
	const rows = data.map((row) => {
		return row.row
			.map((cell) => {
				// Handle different data types
				if (cell === null || cell === undefined) return "";

				const cellStr = String(cell);

				// Escape quotes and wrap in quotes if contains comma, quote, or newline
				if (
					cellStr.includes(",") ||
					cellStr.includes('"') ||
					cellStr.includes("\n")
				) {
					return `"${cellStr.replace(/"/g, '""')}"`;
				}

				return cellStr;
			})
			.join(",");
	});

	// Combine headers and rows
	const csvContent = [headers, ...rows].join("\n");

	// Create blob and download
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", filename);
	link.style.visibility = "hidden";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Export report data to Excel format using a simple HTML table method
 * For more advanced Excel features, consider using a library like exceljs
 */
export function exportToExcel(
	columnHeaders: ColumnHeader[],
	data: ReportDataRow[],
	filename: string,
): void {
	// Create HTML table
	const tableHTML = `
		<table>
			<thead>
				<tr>
					${columnHeaders.map((h) => `<th>${h.columnName}</th>`).join("")}
				</tr>
			</thead>
			<tbody>
				${data
					.map(
						(row) => `
					<tr>
						${row.row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}
					</tr>
				`,
					)
					.join("")}
			</tbody>
		</table>
	`;

	// Create blob with Excel MIME type
	const blob = new Blob([tableHTML], {
		type: "application/vnd.ms-excel",
	});

	// Create download link
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", filename);
	link.style.visibility = "hidden";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Format date for display
 */
export function formatDate(dateStr: string | null | undefined): string {
	if (!dateStr) return "-";

	try {
		const date = new Date(dateStr);
		return date.toLocaleDateString();
	} catch {
		return dateStr;
	}
}

/**
 * Format number with thousand separators and decimal places
 */
export function formatNumber(
	value: number | null | undefined,
	decimals = 2,
): string {
	if (value === null || value === undefined) return "-";

	return value.toLocaleString(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
}
