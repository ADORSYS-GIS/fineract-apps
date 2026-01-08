import { Card } from "@fineract-apps/ui";
import { Download, FileText, Play } from "lucide-react";
import { ReportParameterModal } from "@/components/ReportParameterModal";
import { ReportViewer } from "../reports/report-viewer/ReportViewer";
import type { ReportsCatalogData } from "./ReportsCatalog.types";

export function ReportsCatalogView({
	reports,
	isLoading,
	searchTerm,
	onSearchChange,
	onRunReport,
	isParameterModalOpen,
	selectedReport,
	onCloseParameterModal,
	onSubmitParameters,
	isViewerOpen,
	viewerReportName,
	viewerParameters,
	onCloseViewer,
}: ReportsCatalogData) {
	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="text-3xl font-bold mb-6">Reports Catalog</h1>
				<p>Loading reports...</p>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Reports Catalog</h1>
			</div>

			<div className="mb-6">
				<input
					type="text"
					className="w-full px-4 py-2 border border-gray-300 rounded-lg"
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search reports..."
				/>
			</div>

			{reports.length === 0 ? (
				<Card className="p-6">
					<p className="text-gray-600 text-center">No reports available</p>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{reports.map((report) => (
						<Card key={report.id} className="p-6">
							<div className="flex items-start mb-4">
								<FileText className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
								<div className="flex-1">
									<h3 className="font-semibold text-lg mb-1">
										{report.reportName}
									</h3>
									{report.reportType && (
										<p className="text-sm text-gray-600 mb-2">
											{report.reportType}
										</p>
									)}
									{report.description && (
										<p className="text-sm text-gray-700 mb-4">
											{report.description}
										</p>
									)}
								</div>
							</div>

							<div className="flex gap-2">
								<button
									className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
									onClick={() => onRunReport(report.id, report.reportName)}
								>
									<Play className="w-4 h-4 mr-1" />
									Run Report
								</button>
								<button className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
									<Download className="w-4 h-4" />
								</button>
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Report Parameter Modal */}
			<ReportParameterModal
				isOpen={isParameterModalOpen}
				onClose={onCloseParameterModal}
				report={selectedReport}
				onSubmit={onSubmitParameters}
			/>

			{/* Report Viewer */}
			{isViewerOpen && viewerReportName && viewerParameters && (
				<ReportViewer
					reportName={viewerReportName}
					parameters={viewerParameters}
					onClose={onCloseViewer}
				/>
			)}
		</div>
	);
}
