import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

interface TableProps<T extends object> {
	columns: ColumnDef<T>[];
	data: T[];
	caption?: string;
	ariaLabel?: string;
}

export const Table = <T extends object>({
	columns,
	data,
	caption,
	ariaLabel,
}: TableProps<T>) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<table
			className="min-w-full divide-y divide-gray-200"
			aria-label={ariaLabel}
		>
			{caption && <caption className="sr-only">{caption}</caption>}
			<thead className="bg-gray-50">
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								{header.isPlaceholder
									? null
									: flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody className="bg-white divide-y divide-gray-200">
				{table.getRowModel().rows.map((row) => (
					<tr key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id} className="px-6 py-4 whitespace-nowrap">
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};
