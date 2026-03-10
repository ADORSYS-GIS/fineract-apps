export interface Report {
	id: number;
	reportName: string;
	reportType?: string;
	description?: string;
	reportSubType?: string;
	reportCategory?: string;
	useReport?: boolean;
	coreReport?: boolean;
}

export interface ReportsCatalogData {
	reports: Report[];
	isLoading: boolean;
	searchTerm: string;
	onSearchChange: (term: string) => void;

	// Pagination
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;

	onRunReport: (reportId: number, reportName: string) => void;
	// Modal and viewer state
	isParameterModalOpen: boolean;
	selectedReport: { id: number; reportName: string } | null;
	onCloseParameterModal: () => void;
	onSubmitParameters: (parameters: Record<string, string>) => void;
	// Report viewer state
	isViewerOpen: boolean;
	viewerReportName: string | null;
	viewerParameters: Record<string, string> | null;
	onCloseViewer: () => void;

	// Pentaho Viewer Props
	isPentahoViewerOpen: boolean;
	pentahoReportBlob: Blob | null;
	pentahoOutputType: string | null;
	onClosePentahoViewer: () => void;
}
