import { OpenAPI, request } from "@fineract-apps/fineract-api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { exportToCSV, exportToExcel } from "@/utils/exportHelpers";
import type {
	ReportExecutionResponse,
	ReportViewerData,
	ReportViewerProps,
} from "./ReportViewer.types";

export function useReportViewer({
	reportName,
	parameters,
}: ReportViewerProps): ReportViewerData {
	// Execute report
	const {
		data: reportData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["run-report", reportName, parameters],
		queryFn: async () => {
			const response = await request(OpenAPI, {
				method: "GET",
				url: `/v1/runreports/${reportName}`,
				query: parameters,
			});
			return response as unknown as ReportExecutionResponse;
		},
		retry: 1,
	});

	const handleExportCSV = () => {
		if (!reportData) {
			toast.error("No data to export");
			return;
		}

		try {
			exportToCSV(
				reportData.columnHeaders,
				reportData.data,
				`${reportName}_${new Date().toISOString().split("T")[0]}.csv`,
			);
			toast.success("Report exported to CSV");
		} catch (error) {
			toast.error("Failed to export CSV");
			console.error("CSV export error:", error);
		}
	};

	const handleExportExcel = async () => {
		if (!reportData) {
			toast.error("No data to export");
			return;
		}

		try {
			await exportToExcel(
				reportData.columnHeaders,
				reportData.data,
				`${reportName}_${new Date().toISOString().split("T")[0]}.xlsx`,
			);
			toast.success("Report exported to Excel");
		} catch (error) {
			toast.error("Failed to export Excel");
			console.error("Excel export error:", error);
		}
	};

	return {
		columnHeaders: reportData?.columnHeaders || [],
		data: reportData?.data || [],
		isLoading,
		error: error as Error | null,
		onExportCSV: handleExportCSV,
		onExportExcel: handleExportExcel,
	};
}
