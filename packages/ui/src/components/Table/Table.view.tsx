import type { TableProps } from "./Table.types";

export function TableView<T>({
	columns,
	data,
	sortKey,
	sortDir,
	onSortChange,
	className,
}: TableProps<T>) {
	const handleSort = (key: string) => {
		if (onSortChange) onSortChange(key);
	};

	return (
		<div className={`w-full overflow-x-auto ${className ?? ""}`}>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						{columns.map((col) => (
							<th
								key={col.key}
								className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className ?? ""}`}
							>
								<div className="flex items-center gap-2">
									<span>{col.title}</span>
									{col.sortable && (
										<button
											onClick={() => handleSort(col.key)}
											aria-label={`Sort by ${col.title}`}
											className="text-gray-400 hover:text-gray-600"
										>
											{sortKey === col.key
												? sortDir === "asc"
													? "↑"
													: "↓"
												: "↕"}
										</button>
									)}
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{data.map((row, idx) => (
						<tr key={idx} className="hover:bg-gray-50">
							{columns.map((col) => (
								<td
									key={col.key}
									className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
								>
									{col.render
										? col.render(row)
										: String(
												(row as unknown as Record<string, unknown>)[col.key] ??
													"-",
											)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default TableView;
