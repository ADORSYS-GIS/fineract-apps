import { OpenAPI, ReportsService } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import type { Report, ReportsCatalogData } from "./ReportsCatalog.types";

export function useReportsCatalog(): ReportsCatalogData {
	const [searchTerm, setSearchTerm] = useState("");

	// Parameter modal state
	const [isParameterModalOpen, setIsParameterModalOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState<{
		id: number;
		reportName: string;
	} | null>(null);

	// Report viewer state
	const [isViewerOpen, setIsViewerOpen] = useState(false);
	const [viewerReportName, setViewerReportName] = useState<string | null>(null);
	const [viewerParameters, setViewerParameters] = useState<Record<
		string,
		string
	> | null>(null);

	// Pentaho viewer state
	const [isPentahoViewerOpen, setIsPentahoViewerOpen] = useState(false);
	const [pentahoReportBlob, setPentahoReportBlob] = useState<Blob | null>(null);
	const [pentahoOutputType, setPentahoOutputType] = useState<string | null>(
		null,
	);

	// Fetch all reports
	const { data: reportsData, isLoading } = useQuery({
		queryKey: ["reports"],
		queryFn: async () => {
			const response = await ReportsService.getV1Reports();
			return response as Report[];
		},
	});

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 9;

	// Filter reports based on search term
	const filteredReports = useMemo(() => {
		if (!reportsData) return [];
		if (!searchTerm) return reportsData;

		return reportsData.filter((report) =>
			report.reportName.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [reportsData, searchTerm]);

	// Reset page when search changes
	const handleSearchChange = (term: string) => {
		setSearchTerm(term);
		setCurrentPage(1);
	};

	// Calculate pagination
	const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
	const paginatedReports = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredReports.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredReports, currentPage]);

	const handleRunReport = (reportId: number, reportName: string) => {
		setSelectedReport({ id: reportId, reportName });
		setIsParameterModalOpen(true);
	};

	const handleCloseParameterModal = () => {
		setIsParameterModalOpen(false);
		setSelectedReport(null);
	};

	const handleSubmitParameters = async (parameters: Record<string, string>) => {
		if (!selectedReport) return;

		// Close parameter modal
		setIsParameterModalOpen(false);

		const outputType = parameters["output-type"];
		const reportName = selectedReport.reportName;

		if (outputType && reportName) {
			// Handle Pentaho report download
			const queryParams = new URLSearchParams(parameters);
			const url = `${OpenAPI.BASE}/v1/runreports/${reportName}?${queryParams.toString()}`;
			const headers = {
				...OpenAPI.HEADERS,
				Authorization: `Basic ${btoa(`${OpenAPI.USERNAME}:${OpenAPI.PASSWORD}`)}`,
			};

			try {
				const response = await fetch(url, { headers });
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const blob = await response.blob();
				setPentahoReportBlob(blob);
				setPentahoOutputType(outputType);
				setIsPentahoViewerOpen(true);
			} catch (error) {
				console.error("Error running Pentaho report:", error);
				// You might want to show an error message to the user here
			}
		} else {
			// Open report viewer with parameters for table reports
			setViewerReportName(reportName);
			setViewerParameters(parameters);
			setIsViewerOpen(true);
		}
	};

	const handleCloseViewer = () => {
		setIsViewerOpen(false);
		setViewerReportName(null);
		setViewerParameters(null);
		setSelectedReport(null);
	};

	const handleClosePentahoViewer = () => {
		setIsPentahoViewerOpen(false);
		setPentahoReportBlob(null);
		setPentahoOutputType(null);
		setSelectedReport(null);
	};

	return {
		reports: paginatedReports,
		isLoading,
		searchTerm,
		onSearchChange: handleSearchChange,
		currentPage,
		totalPages,
		onPageChange: setCurrentPage,
		onRunReport: handleRunReport,
		isParameterModalOpen,
		selectedReport,
		onCloseParameterModal: handleCloseParameterModal,
		onSubmitParameters: handleSubmitParameters,
		isViewerOpen,
		viewerReportName,
		viewerParameters,
		onCloseViewer: handleCloseViewer,
		isPentahoViewerOpen,
		pentahoReportBlob,
		pentahoOutputType,
		onClosePentahoViewer: handleClosePentahoViewer,
	};
}
