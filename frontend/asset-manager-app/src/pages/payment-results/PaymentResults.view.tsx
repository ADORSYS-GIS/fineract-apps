import { Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import type { PaymentResultResponse } from "@/services/assetApi";
import type { PaymentResultsProps } from "./usePaymentResults";

const fmtAmount = (v: number | null | undefined) =>
	v != null ? v.toLocaleString() : "—";

export const PaymentResultsView: FC<PaymentResultsProps> = ({
	schedule,
	results,
	totalPages,
	totalElements,
	isLoading,
	currentPage,
	setPage,
}) => {
	const isCoupon = schedule?.paymentType === "COUPON";

	return (
		<div className="max-w-6xl mx-auto py-6 px-4">
			{/* Back link */}
			<Link
				to="/scheduled-payments"
				search={{ assetId: undefined }}
				className="text-sm text-blue-600 hover:underline mb-4 inline-block"
			>
				&larr; Back to Scheduled Payments
			</Link>

			{/* Header */}
			{schedule && (
				<Card className="p-4 mb-6">
					<div className="flex items-center justify-between mb-3">
						<h1 className="text-xl font-bold text-gray-900">Payment Results</h1>
						<span
							className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
								schedule.status === "CONFIRMED"
									? "bg-green-100 text-green-800"
									: schedule.status === "PENDING"
										? "bg-yellow-100 text-yellow-800"
										: "bg-gray-100 text-gray-800"
							}`}
						>
							{schedule.status}
						</span>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<div>
							<p className="text-gray-500">Asset</p>
							<Link
								to="/asset-details/$assetId"
								params={{ assetId: schedule.assetId }}
								className="font-medium text-blue-600 hover:underline"
							>
								{schedule.symbol ?? schedule.assetName ?? schedule.assetId}
							</Link>
						</div>
						<div>
							<p className="text-gray-500">Type</p>
							<p className="font-medium">{schedule.paymentType}</p>
						</div>
						<div>
							<p className="text-gray-500">Schedule Date</p>
							<p className="font-medium">{schedule.scheduleDate}</p>
						</div>
						<div>
							<p className="text-gray-500">Confirmed By</p>
							<p className="font-medium">{schedule.confirmedBy ?? "—"}</p>
						</div>
					</div>

					{/* Aggregate stats */}
					<div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 text-sm">
						<div>
							<p className="text-gray-500">Holders Paid</p>
							<p className="font-semibold text-green-700">
								{schedule.holdersPaid ?? 0}
							</p>
						</div>
						<div>
							<p className="text-gray-500">Holders Failed</p>
							<p
								className={`font-semibold ${(schedule.holdersFailed ?? 0) > 0 ? "text-red-600" : "text-gray-700"}`}
							>
								{schedule.holdersFailed ?? 0}
							</p>
						</div>
						<div>
							<p className="text-gray-500">Total Paid (XAF)</p>
							<p className="font-semibold text-gray-900">
								{fmtAmount(schedule.totalAmountPaid)}
							</p>
						</div>
					</div>
				</Card>
			)}

			{/* Results table */}
			<Card className="p-4">
				<h2 className="text-lg font-semibold text-gray-800 mb-3">
					Individual Payment Records
					{totalElements > 0 && (
						<span className="text-sm font-normal text-gray-500 ml-2">
							({totalElements} total)
						</span>
					)}
				</h2>

				{isLoading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
					</div>
				) : results.length === 0 ? (
					<p className="text-sm text-gray-500 py-4 text-center">
						No payment records found. Payment may not have been executed yet.
					</p>
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200 text-sm">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											User ID
										</th>
										<th className="px-3 py-2 text-right font-medium text-gray-500">
											Units
										</th>
										{isCoupon && (
											<>
												<th className="px-3 py-2 text-right font-medium text-gray-500">
													Face Value
												</th>
												<th className="px-3 py-2 text-right font-medium text-gray-500">
													Rate
												</th>
											</>
										)}
										{!isCoupon && (
											<th className="px-3 py-2 text-right font-medium text-gray-500">
												Rate
											</th>
										)}
										<th className="px-3 py-2 text-right font-medium text-gray-500">
											Amount (XAF)
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Status
										</th>
										<th className="px-3 py-2 text-left font-medium text-gray-500">
											Paid At
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{results.map((r: PaymentResultResponse) => (
										<tr key={r.id} className="hover:bg-gray-50">
											<td className="px-3 py-2">{r.userId}</td>
											<td className="px-3 py-2 text-right">
												{r.units.toLocaleString()}
											</td>
											{isCoupon && (
												<>
													<td className="px-3 py-2 text-right">
														{fmtAmount(r.faceValue)}
													</td>
													<td className="px-3 py-2 text-right">
														{r.annualRate != null ? `${r.annualRate}%` : "—"}
													</td>
												</>
											)}
											{!isCoupon && (
												<td className="px-3 py-2 text-right">
													{r.rateApplied != null ? `${r.rateApplied}%` : "—"}
												</td>
											)}
											<td className="px-3 py-2 text-right font-medium">
												{fmtAmount(r.amount)}
											</td>
											<td className="px-3 py-2">
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
														r.status === "SUCCESS"
															? "bg-green-100 text-green-800"
															: "bg-red-100 text-red-800"
													}`}
												>
													{r.status}
												</span>
												{r.failureReason && (
													<p className="text-xs text-red-600 mt-1">
														{r.failureReason}
													</p>
												)}
											</td>
											<td className="px-3 py-2 whitespace-nowrap text-gray-500">
												{new Date(r.paidAt).toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex justify-between items-center mt-4">
								<button
									type="button"
									className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
									disabled={currentPage === 0}
									onClick={() => setPage(Math.max(0, currentPage - 1))}
								>
									Previous
								</button>
								<span className="text-sm text-gray-500">
									Page {currentPage + 1} of {totalPages}
								</span>
								<button
									type="button"
									className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
									disabled={currentPage >= totalPages - 1}
									onClick={() => setPage(currentPage + 1)}
								>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</Card>
		</div>
	);
};
