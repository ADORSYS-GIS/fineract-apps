export interface ColumnHeader {
	columnName: string;
	columnDisplayType:
		| "TEXT"
		| "STRING"
		| "INTEGER"
		| "DECIMAL"
		| "DATE"
		| "DATETIME"
		| "BOOLEAN";
	columnType: string;
	columnLength?: number;
	columnCode?: string;
	columnValues?: unknown[];
}

export interface ReportDataRow {
	row: unknown[];
}

export interface ReportExecutionResponse {
	columnHeaders: ColumnHeader[];
	data: ReportDataRow[];
}

export interface ReportViewerProps {
	reportName: string;
	parameters: Record<string, string>;
	onClose: () => void;
}

export interface ReportViewerData {
	columnHeaders: ColumnHeader[];
	data: ReportDataRow[];
	isLoading: boolean;
	error: Error | null;
	onExportCSV: () => void;
	onExportExcel: () => void;
}
