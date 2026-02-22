import { Button, Card } from "@fineract-apps/ui";
import {
	AlertTriangle,
	Check,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	RefreshCw,
	Search,
} from "lucide-react";
import { FC, useState } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { StatusBadge } from "@/components/StatusBadge";
import { useReconciliation } from "./useReconciliation";

const severityStyles: Record<string, string> = {
	CRITICAL: "bg-red-100 text-red-800",
	WARNING: "bg-yellow-100 text-yellow-800",
	INFO: "bg-blue-100 text-blue-800",
};

const fmt = (n: number | undefined) =>
	n != null ? new Intl.NumberFormat("fr-FR").format(n) : "—";

export const ReconciliationView: FC<ReturnType<typeof useReconciliation>> = ({
	reports,
	totalPages,
	totalElements,
	openReports,
	isLoading,
	isError,
	refetch,
	page,
	setPage,
	statusFilter,
	setStatusFilter,
	severityFilter,
	setSeverityFilter,
	triggerReconciliation,
	isTriggering,
	acknowledgeReport,
	isAcknowledging,
	resolveReport,
	isResolving,
}) => {
	const [resolveId, setResolveId] = useState<number | null>(null);
	const [resolveNotes, setResolveNotes] = useState("");

	if (isError) {
		return (
			<ErrorFallback
				message="Failed to load reconciliation reports."
				onRetry={refetch}
			/>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Reconciliation</h1>
						<p className="text-sm text-gray-500 mt-1">
							Automated discrepancy detection between asset service and Fineract
						</p>
					</div>
					<Button
						onClick={triggerReconciliation}
						disabled={isTriggering}
						className="flex items-center gap-2"
					>
						<RefreshCw
							className={`h-4 w-4 ${isTriggering ? "animate-spin" : ""}`}
						/>
						{isTriggering ? "Running..." : "Trigger Reconciliation"}
					</Button>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-red-100 rounded-lg">
								<AlertTriangle className="h-5 w-5 text-red-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Open Reports</p>
								<p className="text-2xl font-bold text-gray-900">
									{openReports}
								</p>
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<Search className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Total Reports</p>
								<p className="text-2xl font-bold text-gray-900">
									{totalElements}
								</p>
							</div>
						</div>
					</Card>
					<Card className="p-4">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-green-100 rounded-lg">
								<CheckCircle className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-gray-500">Status</p>
								<p className="text-lg font-semibold text-gray-900">
									{openReports === 0 ? "All Clear" : "Needs Attention"}
								</p>
							</div>
						</div>
					</Card>
				</div>

				{/* Filters */}
				<div className="flex gap-3 mb-4 flex-wrap">
					<select
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
						value={statusFilter}
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setPage(0);
						}}
					>
						<option value="">All Statuses</option>
						<option value="OPEN">Open</option>
						<option value="ACKNOWLEDGED">Acknowledged</option>
						<option value="RESOLVED">Resolved</option>
					</select>
					<select
						className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
						value={severityFilter}
						onChange={(e) => {
							setSeverityFilter(e.target.value);
							setPage(0);
						}}
					>
						<option value="">All Severities</option>
						<option value="CRITICAL">Critical</option>
						<option value="WARNING">Warning</option>
						<option value="INFO">Info</option>
					</select>
				</div>

				{/* Table */}
				<Card className="overflow-hidden">
					{isLoading ? (
						<div className="flex justify-center py-12">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
						</div>
					) : reports.length === 0 ? (
						<p className="text-sm text-gray-500 text-center py-12">
							No reconciliation reports found
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left text-xs text-gray-500 uppercase border-b bg-gray-50">
										<th className="px-4 py-3">Date</th>
										<th className="px-4 py-3">Type</th>
										<th className="px-4 py-3">Asset</th>
										<th className="px-4 py-3">Expected</th>
										<th className="px-4 py-3">Actual</th>
										<th className="px-4 py-3">Discrepancy</th>
										<th className="px-4 py-3">Severity</th>
										<th className="px-4 py-3">Status</th>
										<th className="px-4 py-3">Actions</th>
									</tr>
								</thead>
								<tbody>
									{reports.map((r) => (
										<tr
											key={r.id}
											className="border-b border-gray-100 hover:bg-gray-50"
										>
											<td className="px-4 py-3 text-gray-600">
												{r.reportDate}
											</td>
											<td className="px-4 py-3 font-medium">
												{r.reportType.replace("_", " ")}
											</td>
											<td className="px-4 py-3 font-mono text-xs">
												{r.assetId ?? "—"}
											</td>
											<td className="px-4 py-3 font-mono">
												{fmt(r.expectedValue)}
											</td>
											<td className="px-4 py-3 font-mono">
												{fmt(r.actualValue)}
											</td>
											<td className="px-4 py-3 font-mono font-medium text-red-600">
												{fmt(r.discrepancy)}
											</td>
											<td className="px-4 py-3">
												<span
													className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${severityStyles[r.severity] ?? "bg-gray-100 text-gray-800"}`}
												>
													{r.severity}
												</span>
											</td>
											<td className="px-4 py-3">
												<StatusBadge status={r.status} />
											</td>
											<td className="px-4 py-3">
												<div className="flex gap-1">
													{r.status === "OPEN" && (
														<button
															onClick={() => acknowledgeReport(r.id)}
															disabled={isAcknowledging}
															className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 disabled:opacity-50"
															title="Acknowledge"
														>
															Ack
														</button>
													)}
													{(r.status === "OPEN" ||
														r.status === "ACKNOWLEDGED") && (
														<button
															onClick={() => setResolveId(r.id)}
															disabled={isResolving}
															className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 disabled:opacity-50"
															title="Resolve"
														>
															<Check className="h-3 w-3" />
														</button>
													)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-between items-center px-4 py-3 border-t">
							<p className="text-sm text-gray-500">
								Page {page + 1} of {totalPages} ({totalElements} total)
							</p>
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={() => setPage(Math.max(0, page - 1))}
									disabled={page === 0}
									className="p-2"
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
									disabled={page >= totalPages - 1}
									className="p-2"
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</Card>

				{/* Resolve Dialog */}
				{resolveId !== null && (
					<div
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
						role="dialog"
						aria-modal="true"
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setResolveId(null);
								setResolveNotes("");
							}
						}}
					>
						<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
								Resolve Report #{resolveId}
							</h3>
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Resolution Notes (optional)
								</label>
								<textarea
									className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
									rows={3}
									value={resolveNotes}
									onChange={(e) => setResolveNotes(e.target.value)}
									placeholder="Describe how the discrepancy was resolved..."
								/>
							</div>
							<div className="flex justify-end gap-3 mt-4">
								<Button
									variant="outline"
									onClick={() => {
										setResolveId(null);
										setResolveNotes("");
									}}
								>
									Cancel
								</Button>
								<Button
									onClick={() => {
										resolveReport(resolveId, resolveNotes || undefined);
										setResolveId(null);
										setResolveNotes("");
									}}
									disabled={isResolving}
									className="bg-green-600 hover:bg-green-700"
								>
									{isResolving ? "Resolving..." : "Resolve"}
								</Button>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
};
