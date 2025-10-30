export type TableColumn<T> = {
	key: string;
	title: string;
	sortable?: boolean;
	render?: (row: T) => React.ReactNode;
	className?: string;
};

import type { Key } from "react";

export type TableProps<T extends { id: Key }> = {
	columns: TableColumn<T>[];
	data: T[];
	sortKey?: string | null;
	sortDir?: "asc" | "desc" | null;
	onSortChange?: (key: string) => void;
	className?: string;
};
