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
						<thead className="text-xs text-white uppercase bg-primary">
							<tr>
								{columns.map((column) => (
									<th
										key={String(column.key)}
										className={`px-6 py-3 text-left ${column.className || ""}`}
									>
										{column.header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{[...Array(loadingRows)].map((_, rowIndex) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Skeleton loader
								<tr key={rowIndex} className="animate-pulse">
									{columns.map((column) => (
										<td
											key={String(column.key)}
											className="px-6 py-4 whitespace-nowrap"
										>
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
					<thead className="text-xs text-white uppercase bg-primary">
						<tr>
							{columns.map((column) => (
								<th
									key={String(column.key)}
									className={`px-6 py-3 text-left ${column.className || ""}`}
								>
									{column.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{data.map((item, rowIndex) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Data row might not have unique ID
							<tr key={rowIndex} className="hover:bg-gray-50">
								{columns.map((column) => (
									<td
										key={String(column.key)}
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
