export interface ReportParameter {
	id: number;
	parameterId: number;
	reportId: number;
	parameterName: string;
	parameterVariable: string;
	reportParameterName?: string;
	parameterLabel?: string;
	parameterDisplayType?: "text" | "select" | "date" | "none";
	parameterFormatType?: string;
	parameterDefaultValue?: string;
	selectOne?: boolean;
	selectAll?: boolean;
	parameterData?: {
		id: number | string;
		name: string;
	}[];
	lookupTable?: {
		id: number | string;
		name: string;
	}[];
}

export interface ReportDetails {
	id: number;
	reportName: string;
	reportType?: string;
	reportSubType?: string;
	reportCategory?: string;
	description?: string;
	reportParameters: ReportParameter[];
	coreReport: boolean;
	useReport: boolean;
}

export interface ReportParameterModalProps {
	isOpen: boolean;
	onClose: () => void;
	report: {
		id: number;
		reportName: string;
	} | null;
	onSubmit: (parameters: Record<string, string>) => void;
}

export interface ParameterFormValues {
	[key: string]: string | string[];
}
