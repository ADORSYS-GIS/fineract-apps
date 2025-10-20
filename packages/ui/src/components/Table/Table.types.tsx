export type TableColumn<T> = {
	key: string;
	title: string;
	sortable?: boolean;
	render?: (row: T) => React.ReactNode;
	className?: string;
};

export type TableProps<T> = {
	columns: TableColumn<T>[];
	data: T[];
	sortKey?: string | null;
	sortDir?: "asc" | "desc" | null;
	onSortChange?: (key: string) => void;
	className?: string;
};
