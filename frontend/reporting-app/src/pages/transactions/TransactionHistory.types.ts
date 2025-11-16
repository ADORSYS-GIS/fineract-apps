export interface Transaction {
	id: string;
	date: string;
	clientName: string;
	type: string;
	amount: string;
	status: string;
}

export interface TransactionFilters {
	fromDate: string;
	toDate: string;
	transactionType: string;
}

export interface PaginationData {
	currentPage: number;
	totalPages: number;
	totalItems: number;
}

export interface TransactionHistoryData {
	transactions: Transaction[];
	isLoading: boolean;
	pagination: PaginationData;
	filters: TransactionFilters;
	onFilterChange: (key: keyof TransactionFilters, value: string) => void;
	onPageChange: (page: number) => void;
	onExport: () => void;
}
