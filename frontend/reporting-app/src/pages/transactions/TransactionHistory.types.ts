export interface Transaction {
	id: number;
	actionName: string;
	entityName: string;
	maker: string;
	madeOnDate: string;
	processingResult: string;
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
	onExportCSV: () => void;
	onExportExcel: () => void;
}
