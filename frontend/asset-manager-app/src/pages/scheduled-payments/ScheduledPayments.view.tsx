import { Button, Card, Pagination } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { FC } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { PaymentResultsPreview } from "@/components/PaymentResultsPreview";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useScheduledPayments } from "./useScheduledPayments";

const statusColors: Record<string, string> = {
	PENDING: "bg-yellow-100 text-yellow-800",
	CONFIRMED: "bg-green-100 text-green-800",
	CANCELLED: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
	const color = statusColors[status] ?? "bg-gray-100 text-gray-600";
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
		>
			{status}
		</span>
	);
}

const fmtDate = (d?: string) =>
	d ? new Date(d).toLocaleDateString() : "\u2014";
const fmtAmount = (n?: number) =>
	n != null ? n.toLocaleString() + " XAF" : "\u2014";

export const ScheduledPaymentsView: FC<
	ReturnType<typeof useScheduledPayments>
> = ({
	schedules,
	paymentSummary,
	isLoading,
	isError,
	refetch,
	currentPage,
	totalPages,
	onPageChange,
	statusFilter,
	setStatusFilter,
	typeFilter,
	setTypeFilter,
	assetFilter,
	setAssetFilter,
	assetOptions,
	confirmModal,
	openConfirmModal,
	closeConfirmModal,
	setConfirmAmount,
	confirmPayment,
	isConfirming,
	cancelModal,
	openCancelModal,
	closeCancelModal,
	setCancelReason,
	cancelPayment,
	isCancelling,
	detailId,
	setDetailId,
	detail,
	detailLoading,
}) => {
	if (isError) {
		return (
			<ErrorFallback
				message="Failed to load scheduled payments."
				onRetry={refetch}
			/>
		);
	}

	if (isLoading) {
		return (
			<div className="bg-gray-50 min-h-screen">
				<main className="p-4 sm:p-6 lg:p-8">
					<h1 className="text-2xl font-bold text-gray-800 mb-6">
						Scheduled Payments
					</h1>
					<TableSkeleton rows={5} cols={7} />
				</main>
			</div>
		);
	}

	const inputClass =
		"border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Scheduled Payments
				</h1>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<Card className="p-4">
						<p className="text-sm text-gray-500">Pending</p>
						<p className="text-2xl font-bold text-yellow-600">
							{paymentSummary.pendingCount}
						</p>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Confirmed This Month</p>
						<p className="text-2xl font-bold text-green-600">
							{paymentSummary.confirmedThisMonth}
						</p>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Total Paid This Month</p>
						<p className="text-2xl font-bold text-gray-800">
							{fmtAmount(paymentSummary.totalPaidThisMonth)}
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
						<option value="PENDING">Pending</option>
						<option value="CONFIRMED">Confirmed</option>
						<option value="CANCELLED">Cancelled</option>
					</select>
					<select
						className={inputClass}
						value={typeFilter}
						onChange={(e) => setTypeFilter(e.target.value)}
					>
						<option value="">All Types</option>
						<option value="COUPON">Coupon</option>
						<option value="INCOME">Income</option>
					</select>
					<select
						className={inputClass}
						value={assetFilter}
						onChange={(e) => setAssetFilter(e.target.value)}
					>
						<option value="">All Assets</option>
						{assetOptions.map((a) => (
							<option key={a.id} value={a.id}>
								{a.symbol} — {a.name}
							</option>
						))}
					</select>
					{(statusFilter || typeFilter || assetFilter) && (
						<button
							onClick={() => {
								setStatusFilter("");
								setTypeFilter("");
								setAssetFilter("");
							}}
							className="text-sm text-blue-600 hover:text-blue-800 px-2"
						>
							Clear filters
						</button>
					)}
				</div>

				{/* Table */}
				{schedules.length === 0 ? (
					<Card className="p-12 text-center">
						<p className="text-gray-500">
							No scheduled payments match the current filters.
						</p>
					</Card>
				) : (
					<>
						<div className="bg-white rounded-lg shadow overflow-hidden">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Asset
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Type
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Schedule Date
											</th>
											<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												Holders
											</th>
											<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												Estimated Total
											</th>
											<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												Treasury
											</th>
											<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{schedules.map((s) => (
											<tr
												key={s.id}
												className="hover:bg-gray-50 cursor-pointer"
												onClick={() => setDetailId(s.id)}
											>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
													<Link
														to="/asset-details/$assetId"
														params={{ assetId: s.assetId }}
														onClick={(e) => e.stopPropagation()}
														className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
													>
														{s.symbol ?? s.assetId.slice(0, 8)}
													</Link>
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
													{s.paymentType}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
													{fmtDate(s.scheduleDate)}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
													{s.holderCount}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
													{fmtAmount(s.estimatedTotal)}
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-sm text-right">
													{s.treasuryBalance != null ? (
														<span
															className={
																s.treasuryBalance >= (s.estimatedTotal ?? 0)
																	? "text-green-700 font-medium"
																	: "text-red-600 font-medium"
															}
														>
															{fmtAmount(s.treasuryBalance)}
														</span>
													) : (
														"\u2014"
													)}
												</td>
												<td className="px-4 py-3 whitespace-nowrap">
													<StatusBadge status={s.status} />
												</td>
												<td className="px-4 py-3 whitespace-nowrap text-center">
													{s.status === "PENDING" && (
														<div className="flex gap-2 justify-center">
															<Button
																variant="default"
																onClick={(e) => {
																	e.stopPropagation();
																	openConfirmModal(s);
																}}
																className="text-xs"
															>
																Confirm
															</Button>
															<Button
																variant="outline"
																onClick={(e) => {
																	e.stopPropagation();
																	openCancelModal(s);
																}}
																className="text-xs"
															>
																Cancel
															</Button>
														</div>
													)}
													{s.status === "CONFIRMED" &&
														s.totalAmountPaid != null && (
															<span className="text-xs text-green-700">
																{fmtAmount(s.totalAmountPaid)}
															</span>
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

			{/* Detail Slide-Over */}
			{detailId && (
				<div
					className="fixed inset-0 bg-black/30 z-40"
					onClick={() => setDetailId(null)}
				>
					<div
						className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-semibold text-gray-900">
									Payment Detail
								</h2>
								<button
									onClick={() => setDetailId(null)}
									className="p-1 hover:bg-gray-100 rounded"
								>
									<X className="h-5 w-5 text-gray-500" />
								</button>
							</div>

							{detailLoading ? (
								<div className="flex justify-center py-12">
									<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
								</div>
							) : detail ? (
								<div className="space-y-4">
									<DetailRow label="Asset">
										<Link
											to="/asset-details/$assetId"
											params={{ assetId: detail.assetId }}
											className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
										>
											{detail.symbol} — {detail.assetName}
										</Link>
									</DetailRow>
									<DetailRow label="Type" value={detail.paymentType} />
									<DetailRow
										label="Schedule Date"
										value={fmtDate(detail.scheduleDate)}
									/>
									<DetailRow label="Status">
										<StatusBadge status={detail.status} />
									</DetailRow>
									<DetailRow label="Rate" value={`${detail.estimatedRate}%`} />
									<DetailRow
										label="Est. Amount/Unit"
										value={detail.estimatedAmountPerUnit?.toLocaleString()}
									/>
									<DetailRow
										label="Holders"
										value={String(detail.holderCount)}
									/>
									<DetailRow
										label="Estimated Total"
										value={fmtAmount(detail.estimatedTotal)}
									/>
									{detail.treasuryBalance != null && (
										<DetailRow label="Treasury Balance">
											<span
												className={`text-sm font-medium ${
													detail.treasuryBalance >= (detail.estimatedTotal ?? 0)
														? "text-green-700"
														: "text-red-600"
												}`}
											>
												{fmtAmount(detail.treasuryBalance)}
											</span>
										</DetailRow>
									)}

									{detail.actualAmountPerUnit != null && (
										<>
											<hr className="border-gray-200" />
											<DetailRow
												label="Actual Amount/Unit"
												value={detail.actualAmountPerUnit.toLocaleString()}
											/>
											<DetailRow
												label="Holders Paid"
												value={String(detail.holdersPaid ?? 0)}
											/>
											<DetailRow
												label="Holders Failed"
												value={String(detail.holdersFailed ?? 0)}
											/>
											<DetailRow
												label="Total Paid"
												value={fmtAmount(detail.totalAmountPaid)}
											/>
											<DetailRow
												label="Confirmed By"
												value={detail.confirmedBy ?? "\u2014"}
											/>
											<DetailRow
												label="Confirmed At"
												value={
													detail.confirmedAt
														? new Date(detail.confirmedAt).toLocaleString()
														: "\u2014"
												}
											/>
										</>
									)}

									{detail.status === "CONFIRMED" && (
										<>
											<hr className="border-gray-200" />
											<PaymentResultsPreview
												paymentId={detail.id}
												totalResults={
													(detail.holdersPaid ?? 0) +
													(detail.holdersFailed ?? 0)
												}
											/>
										</>
									)}

									{detail.cancelReason && (
										<>
											<hr className="border-gray-200" />
											<DetailRow
												label="Cancelled By"
												value={detail.cancelledBy ?? "\u2014"}
											/>
											<DetailRow label="Reason" value={detail.cancelReason} />
										</>
									)}

									{/* Holder Breakdown */}
									{detail.holders && detail.holders.length > 0 && (
										<>
											<hr className="border-gray-200" />
											<h3 className="text-sm font-semibold text-gray-700">
												Holder Breakdown
											</h3>
											<div className="max-h-60 overflow-y-auto">
												<table className="min-w-full text-sm">
													<thead>
														<tr className="text-xs text-gray-500">
															<th className="text-left py-1">User ID</th>
															<th className="text-right py-1">Units</th>
															<th className="text-right py-1">Est. Payment</th>
														</tr>
													</thead>
													<tbody>
														{detail.holders.map((h) => (
															<tr
																key={h.userId}
																className="border-t border-gray-100"
															>
																<td className="py-1 text-gray-700">
																	{h.userId}
																</td>
																<td className="py-1 text-right text-gray-700">
																	{h.units}
																</td>
																<td className="py-1 text-right text-gray-900">
																	{fmtAmount(h.estimatedPayment)}
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</>
									)}

									{/* Actions */}
									{detail.status === "PENDING" && (
										<div className="flex gap-3 pt-4">
											<Button
												onClick={() => {
													setDetailId(null);
													openConfirmModal(detail);
												}}
												className="flex-1"
											>
												Confirm
											</Button>
											<Button
												variant="outline"
												onClick={() => {
													setDetailId(null);
													openCancelModal(detail);
												}}
												className="flex-1"
											>
												Cancel
											</Button>
										</div>
									)}
								</div>
							) : (
								<p className="text-gray-500">Schedule not found.</p>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Confirm Modal */}
			{confirmModal && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={closeConfirmModal}
				>
					<div
						className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Confirm Payment
						</h2>
						<div className="space-y-3 mb-4">
							<p className="text-sm text-gray-600">
								<span className="font-medium">Asset:</span>{" "}
								{confirmModal.schedule.symbol} —{" "}
								{confirmModal.schedule.assetName}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Type:</span>{" "}
								{confirmModal.schedule.paymentType}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Date:</span>{" "}
								{fmtDate(confirmModal.schedule.scheduleDate)}
							</p>
							<p className="text-sm text-gray-600">
								<span className="font-medium">Holders:</span>{" "}
								{confirmModal.schedule.holderCount}
							</p>
						</div>

						{confirmModal.schedule.treasuryBalance != null &&
							confirmModal.schedule.treasuryBalance <
								(confirmModal.schedule.estimatedTotal ?? 0) && (
								<div className="mb-4 bg-red-50 border border-red-200 p-3 rounded text-sm text-red-800">
									Treasury balance (
									{fmtAmount(confirmModal.schedule.treasuryBalance)}) is below
									the estimated total (
									{fmtAmount(confirmModal.schedule.estimatedTotal)}).
									Confirmation will fail unless the treasury is funded.
								</div>
							)}

						{confirmModal.schedule.paymentType === "INCOME" ? (
							<div className="mb-4">
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Amount per unit (XAF)
								</label>
								<input
									type="number"
									className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									value={confirmModal.amountPerUnit}
									onChange={(e) => setConfirmAmount(e.target.value)}
									placeholder="Leave empty to use rate-based estimate"
								/>
								<p className="text-xs text-gray-400 mt-1">
									Rate-based estimate:{" "}
									{confirmModal.schedule.estimatedAmountPerUnit?.toLocaleString()}{" "}
									XAF/unit
								</p>
							</div>
						) : (
							<div className="mb-4 bg-blue-50 p-3 rounded text-sm text-blue-800">
								Coupon amount is fixed at{" "}
								{confirmModal.schedule.estimatedAmountPerUnit?.toLocaleString()}{" "}
								XAF/unit (from bond rate).
							</div>
						)}

						<div className="flex justify-end gap-3">
							<Button variant="outline" onClick={closeConfirmModal}>
								Back
							</Button>
							<Button onClick={confirmPayment} disabled={isConfirming}>
								{isConfirming ? "Processing..." : "Confirm & Pay"}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Cancel Modal */}
			{cancelModal && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					onClick={closeCancelModal}
				>
					<div
						className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
						onClick={(e) => e.stopPropagation()}
					>
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							Cancel Payment
						</h2>
						<p className="text-sm text-gray-600 mb-3">
							{cancelModal.schedule.symbol} — {cancelModal.schedule.paymentType}{" "}
							on {fmtDate(cancelModal.schedule.scheduleDate)}
						</p>
						<textarea
							className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							rows={3}
							placeholder="Reason for cancellation (optional)"
							value={cancelModal.reason}
							onChange={(e) => setCancelReason(e.target.value)}
						/>
						<div className="flex justify-end gap-3 mt-4">
							<Button variant="outline" onClick={closeCancelModal}>
								Back
							</Button>
							<Button
								variant="destructive"
								onClick={cancelPayment}
								disabled={isCancelling}
							>
								{isCancelling ? "Cancelling..." : "Cancel Payment"}
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
	children,
}: {
	label: string;
	value?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex justify-between items-start gap-4">
			<p className="text-xs text-gray-500 shrink-0">{label}</p>
			{children ?? <p className="text-sm text-gray-900 text-right">{value}</p>}
		</div>
	);
}
