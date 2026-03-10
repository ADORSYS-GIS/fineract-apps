export interface AuditEntry {
	id: number;
	actionName: string;
	entityName: string;
	resourceId: number;
	maker: string;
	madeOnDate: string;
	checker?: string;
	checkedOnDate?: string;
	processingResult: string;
	officeId?: number;
	groupId?: number;
	clientId?: number;
	loanId?: number;
	savingsAccountId?: number;
}

export interface AuditFilters {
	fromDate: string;
	toDate: string;
	actionName: string;
	entityName: string;
}

export interface PaginationData {
	currentPage: number;
	totalPages: number;
	totalItems: number;
}

export interface AuditTrailData {
	audits: AuditEntry[];
	isLoading: boolean;
	pagination: PaginationData;
	filters: AuditFilters;
	onFilterChange: (key: keyof AuditFilters, value: string) => void;
	onPageChange: (page: number) => void;
	onExportCSV: () => void;
	onExportExcel: () => void;
}
