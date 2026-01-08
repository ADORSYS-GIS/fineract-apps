import { Card } from "@fineract-apps/ui";
import { Download, FileText, Play, X } from "lucide-react";
import { ReportParameterModal } from "@/components/ReportParameterModal";
import { ReportViewer } from "../reports/report-viewer/ReportViewer";
import type { ReportsCatalogData } from "./ReportsCatalog.types";

export function ReportsCatalogView({
	reports,
	isLoading,
	searchTerm,
	onSearchChange,
	currentPage,
	totalPages,
	onPageChange,
	onRunReport,
	isParameterModalOpen,
	selectedReport,
	onCloseParameterModal,
	onSubmitParameters,
	isViewerOpen,
	viewerReportName,
	viewerParameters,
	onCloseViewer,
}: Readonly<ReportsCatalogData>) {
	if (isLoading) {
		return (
			<div className="p-6 h-full flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-3xl font-bold mb-6">Reports Catalog</h1>
					<p>Loading reports...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 h-[calc(100vh-var(--header-height,64px))] flex flex-col overflow-hidden">
			<div className="flex justify-between items-center mb-6 flex-shrink-0">
				<h1 className="text-3xl font-bold">Reports Catalog</h1>
			</div>

			<div className="mb-6 flex-shrink-0 relative">
				<input
					type="text"
					className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10"
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search reports..."
				/>
				{searchTerm && (
					<button
						onClick={() => onSearchChange("")}
						className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600 transition-colors z-10"
						type="button"
						aria-label="Clear search"
					>
						<X className="w-4 h-4" />
					</button>
				)}
			</div>

			{reports.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<Card className="p-6 w-full max-w-md">
						<p className="text-gray-600 text-center">No reports available</p>
					</Card>
				</div>
			) : (
				<div className="flex-1 flex flex-col min-h-0">
					<div className="flex-1 overflow-y-auto min-h-0">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 auto-rows-fr">
							{reports.map((report) => (
								<Card key={report.id} className="p-6 flex flex-col h-full">
									<div className="flex items-start mb-4 flex-1">
										<FileText className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" />
										<div className="flex-1">
											<h3
												className="font-semibold text-lg mb-1 line-clamp-1"
												title={report.reportName}
											>
												{report.reportName}
											</h3>
											{report.reportType && (
												<p className="text-sm text-gray-600 mb-2">
													{report.reportType}
												</p>
											)}
											{report.description && (
												<p
													className="text-sm text-gray-700 mb-4 line-clamp-2"
													title={report.description}
												>
													{/* Show only the first sentence */}
													{report.description.split(".")[0] + "."}
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
					</div>

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex justify-center items-center gap-4 mt-6 flex-shrink-0 py-4 border-t bg-white">
							<button
								onClick={() => onPageChange(Math.max(1, currentPage - 1))}
								disabled={currentPage === 1}
								className={`px-4 py-2 rounded-lg border ${
									currentPage === 1
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								Previous
							</button>
							<span className="text-sm text-gray-600">
								Page {currentPage} of {totalPages}
							</span>
							<button
								onClick={() =>
									onPageChange(Math.min(totalPages, currentPage + 1))
								}
								disabled={currentPage === totalPages}
								className={`px-4 py-2 rounded-lg border ${
									currentPage === totalPages
										? "bg-gray-100 text-gray-400 cursor-not-allowed"
										: "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
								}`}
							>
								Next
							</button>
						</div>
					)}
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
