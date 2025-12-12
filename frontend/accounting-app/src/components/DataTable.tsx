import { Card } from "@fineract-apps/ui";
import { ReactNode } from "react";

interface Column<T> {
	key: keyof T | string;
	header: string;
	render?: (value: unknown, item: T) => ReactNode;
	className?: string;
}

interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	isLoading?: boolean;
	emptyMessage?: string;
	loadingRows?: number;
	className?: string;
}

export function DataTable<T>({
	data,
	columns,
	isLoading = false,
	emptyMessage = "No data found.",
	loadingRows = 5,
	className = "",
}: DataTableProps<T>) {
	if (isLoading) {
		return (
			<div
				className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								{columns.map((column, index) => (
									<th
										key={index}
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										{column.header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{[...Array(loadingRows)].map((_, rowIndex) => (
								<tr key={rowIndex} className="animate-pulse">
									{columns.map((_, colIndex) => (
										<td key={colIndex} className="px-6 py-4 whitespace-nowrap">
											<div className="h-4 bg-gray-200 rounded w-3/4" />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div
				className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center text-gray-500 ${className}`}
			>
				<p>{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div
			className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
		>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							{columns.map((column, index) => (
								<th
									key={index}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.map((item, rowIndex) => (
							<tr key={rowIndex} className="hover:bg-gray-50">
								{columns.map((column, colIndex) => (
									<td
										key={colIndex}
										className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ""}`}
									>
										{column.render
											? column.render(
													(item as Record<string, unknown>)[
														column.key as string
													],
													item,
												)
											: String(
													(item as Record<string, unknown>)[
														column.key as string
													] ?? "",
												)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
