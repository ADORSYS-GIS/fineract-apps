import { Button, Card, Pagination } from "@fineract-apps/ui";
import { X } from "lucide-react";
import { FC, useState } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useOrderResolution } from "./useOrderResolution";

const statusColors: Record<string, string> = {
	NEEDS_RECONCILIATION: "bg-yellow-100 text-yellow-800",
	FAILED: "bg-red-100 text-red-800",
	MANUALLY_CLOSED: "bg-gray-100 text-gray-600",
	FILLED: "bg-green-100 text-green-800",
	PENDING: "bg-blue-100 text-blue-800",
	EXECUTING: "bg-purple-100 text-purple-800",
	REJECTED: "bg-orange-100 text-orange-800",
};

function StatusBadge({ status }: { status: string }) {
	const color = statusColors[status] ?? "bg-gray-100 text-gray-600";
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
		>
			{status.replace(/_/g, " ")}
		</span>
	);
}

const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString() : "—");

export const OrderResolutionView: FC<ReturnType<typeof useOrderResolution>> = ({
	orders,
	orderSummary,
	isLoading,
	isError,
	refetch,
	currentPage,
	totalPages,
	onPageChange,
	resolveOrder,
	isResolving,
	statusFilter,
	setStatusFilter,
	assetFilter,
	setAssetFilter,
	searchInput,
	setSearchInput,
	fromDate,
	setFromDate,
	toDate,
	setToDate,
	assetOptions,
	selectedOrderId,
	setSelectedOrderId,
	orderDetail,
	detailLoading,
	adminAlertCount,
}) => {
	const [resolveModal, setResolveModal] = useState<{
		orderId: string;
		resolution: string;
	} | null>(null);

	if (isError) {
		return <ErrorFallback message="Failed to load orders." onRetry={refetch} />;
	}

	if (isLoading) {
		return (
			<div className="bg-gray-50 min-h-screen">
				<main className="p-4 sm:p-6 lg:p-8">
					<h1 className="text-2xl font-bold text-gray-800 mb-6">
						Order Resolution
					</h1>
					<TableSkeleton rows={5} cols={8} />
				</main>
			</div>
		);
	}

	const inputClass =
		"border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<div className="flex items-center gap-3 mb-6">
					<h1 className="text-2xl font-bold text-gray-800">Order Resolution</h1>
					{adminAlertCount > 0 && (
						<span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white">
							{adminAlertCount}
						</span>
					)}
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<Card className="p-4">
						<p className="text-sm text-gray-500">Needs Reconciliation</p>
						<p className="text-2xl font-bold text-yellow-600">
							{orderSummary.needsReconciliation}
						</p>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Failed</p>
						<p className="text-2xl font-bold text-red-600">
							{orderSummary.failed}
						</p>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Manually Closed</p>
						<p className="text-2xl font-bold text-gray-600">
							{orderSummary.manuallyClosed}
						</p>
					</Card>
				</div>

				{/* Filter Bar */}
				<div className="flex flex-wrap gap-3 mb-4">
					<select
						className={inputClass}
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
					>
						<option value="">All Statuses</option>
						<option value="NEEDS_RECONCILIATION">Needs Reconciliation</option>
						<option value="FAILED">Failed</option>
						<option value="MANUALLY_CLOSED">Manually Closed</option>
						<option value="FILLED">Filled</option>
						<option value="PENDING">Pending</option>
						<option value="EXECUTING">Executing</option>
					</select>
					<select
						className={inputClass}
						value={assetFilter}
						onChange={(e) => setAssetFilter(e.target.value)}
					>
						<option value="">All Assets</option>
						{assetOptions.map((a) => (
							<option key={a.assetId} value={a.assetId}>
								{a.symbol} — {a.name}
							</option>
						))}
					</select>
					<input
						type="text"
						className={`${inputClass} w-48`}
						placeholder="Search order/user ID..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<input
						type="date"
						className={inputClass}
						value={fromDate}
						onChange={(e) => setFromDate(e.target.value)}
						title="From date"
					/>
					<input
						type="date"
						className={inputClass}
						value={toDate}
						onChange={(e) => setToDate(e.target.value)}
						title="To date"
					/>
					{(statusFilter ||
						assetFilter ||
						searchInput ||
						fromDate ||
						toDate) && (
						<button
							onClick={() => {
								setStatusFilter("");
								setAssetFilter("");
								setSearchInput("");
								setFromDate("");
								setToDate("");
							}}
							className="text-sm text-blue-600 hover:text-blue-800 px-2"
						>
							Clear filters
						</button>
					)}
				</div>

				{/* Orders Table */}
				{orders.length === 0 ? (
					<Card className="p-12 text-center">
						<p className="text-gray-500">
							No orders match the current filters.
						</p>
					</Card>
				) : (
					<>
						<div
							className="bg-white rounded-lg shadow overflow-hidden"
							role="region"
							aria-label="Orders requiring resolution"
						>
							<div className="overflow-x-auto">
								<table
									className="min-w-full divide-y divide-gray-200"
									aria-label="Order resolution table"
								>
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Order ID
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Asset
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												User
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Side
											</th>
											<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												Amount
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Reason
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Created
											</th>
											<th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{orders.map((order) => (
											<tr
												key={order.orderId}
												className="hover:bg-gray-50 cursor-pointer"
												onClick={() => setSelectedOrderId(order.orderId)}
											>
												<td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">
													{order.orderId.slice(0, 8)}...
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
													{order.symbol ?? order.assetId.slice(0, 8)}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
													{order.userExternalId}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm">
													<span
														className={
															order.side === "BUY"
																? "text-green-700 font-medium"
																: "text-red-700 font-medium"
														}
													>
														{order.side}
													</span>
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
													{order.totalAmount?.toLocaleString() ?? "—"}
												</td>
												<td className="px-4 py-3 whitespace-nowrap">
													<StatusBadge status={order.status} />
												</td>
												<td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
													{order.failureReason ?? "—"}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
													{new Date(order.createdAt).toLocaleDateString()}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-center">
													{(order.status === "NEEDS_RECONCILIATION" ||
														order.status === "FAILED") && (
														<Button
															variant="outline"
															onClick={(e) => {
																e.stopPropagation();
																setResolveModal({
																	orderId: order.orderId,
																	resolution: "",
																});
															}}
															className="text-xs"
														>
															Resolve
														</Button>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
						{totalPages > 1 && (
							<div className="mt-4">
								<Pagination
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={onPageChange}
								/>
							</div>
						)}
					</>
				)}
			</main>

			{/* Detail Slide-Over Panel */}
			{selectedOrderId && (
				<div
					className="fixed inset-0 bg-black/30 z-40"
					onClick={() => setSelectedOrderId(null)}
				>
					<div
						className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-semibold text-gray-900">
									Order Detail
								</h2>
								<button
									onClick={() => setSelectedOrderId(null)}
									className="p-1 hover:bg-gray-100 rounded"
								>
									<X className="h-5 w-5 text-gray-500" />
								</button>
							</div>

							{detailLoading ? (
								<div className="flex justify-center py-12">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
								</div>
							) : orderDetail ? (
								<div className="space-y-4">
									<DetailRow
										label="Order ID"
										value={orderDetail.orderId}
										mono
									/>
									<DetailRow
										label="Asset"
										value={`${orderDetail.symbol} — ${orderDetail.assetName}`}
									/>
									<DetailRow label="User" value={orderDetail.userExternalId} />
									<DetailRow
										label="User ID"
										value={String(orderDetail.userId)}
									/>
									<DetailRow label="Side" value={orderDetail.side} />
									<DetailRow
										label="Units"
										value={orderDetail.units?.toLocaleString() ?? "—"}
									/>
									<DetailRow
										label="Price/Unit"
										value={orderDetail.pricePerUnit?.toLocaleString() ?? "—"}
									/>
									<DetailRow
										label="Total Amount"
										value={`${orderDetail.totalAmount?.toLocaleString()} XAF`}
									/>
									<DetailRow
										label="Fee"
										value={orderDetail.fee?.toLocaleString() ?? "—"}
									/>
									<DetailRow
										label="Spread"
										value={orderDetail.spreadAmount?.toLocaleString() ?? "—"}
									/>

									<hr className="border-gray-200" />

									<DetailRow label="Status" value={orderDetail.status}>
										<StatusBadge status={orderDetail.status} />
									</DetailRow>
									{orderDetail.failureReason && (
										<div>
											<p className="text-xs text-gray-500 mb-1">
												Failure Reason
											</p>
											<p className="text-sm text-red-700 bg-red-50 p-2 rounded">
												{orderDetail.failureReason}
											</p>
										</div>
									)}

									<hr className="border-gray-200" />

									<DetailRow
										label="Idempotency Key"
										value={orderDetail.idempotencyKey}
										mono
									/>
									<DetailRow
										label="Fineract Batch ID"
										value={orderDetail.fineractBatchId ?? "—"}
										mono
									/>
									<DetailRow
										label="Version"
										value={String(orderDetail.version)}
									/>

									<hr className="border-gray-200" />

									<DetailRow
										label="Created"
										value={fmtDate(orderDetail.createdAt)}
									/>
									<DetailRow
										label="Updated"
										value={fmtDate(orderDetail.updatedAt)}
									/>
									{orderDetail.resolvedBy && (
										<>
											<DetailRow
												label="Resolved By"
												value={orderDetail.resolvedBy}
											/>
											<DetailRow
												label="Resolved At"
												value={fmtDate(orderDetail.resolvedAt)}
											/>
										</>
									)}

									{(orderDetail.status === "NEEDS_RECONCILIATION" ||
										orderDetail.status === "FAILED") && (
										<div className="pt-4">
											<Button
												onClick={() => {
													setSelectedOrderId(null);
													setResolveModal({
														orderId: orderDetail.orderId,
														resolution: "",
													});
												}}
												className="w-full"
											>
												Resolve Order
											</Button>
										</div>
									)}
								</div>
							) : (
								<p className="text-gray-500">Order not found.</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Resolve Modal */}
			{resolveModal && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={() => setResolveModal(null)}
				>
					<div
						className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Resolve Order
						</h2>
						<p className="text-sm text-gray-500 mb-3">
							Order:{" "}
							<span className="font-mono">
								{resolveModal.orderId.slice(0, 12)}...
							</span>
						</p>
						<textarea
							className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							rows={4}
							placeholder="Describe the resolution (e.g., 'Verified in Fineract, transfer completed successfully')"
							value={resolveModal.resolution}
							onChange={(e) =>
								setResolveModal({
									...resolveModal,
									resolution: e.target.value,
								})
							}
						/>
						<div className="flex justify-end gap-3 mt-4">
							<Button variant="outline" onClick={() => setResolveModal(null)}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									resolveOrder({
										orderId: resolveModal.orderId,
										resolution: resolveModal.resolution,
									});
									setResolveModal(null);
								}}
								disabled={!resolveModal.resolution.trim() || isResolving}
							>
								{isResolving ? "Resolving..." : "Resolve"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

function DetailRow({
	label,
	value,
	mono,
	children,
}: {
	label: string;
	value?: string;
	mono?: boolean;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex justify-between items-start gap-4">
			<p className="text-xs text-gray-500 shrink-0">{label}</p>
			{children ?? (
				<p
					className={`text-sm text-gray-900 text-right ${mono ? "font-mono" : ""}`}
				>
					{value}
				</p>
			)}
		</div>
	);
}
