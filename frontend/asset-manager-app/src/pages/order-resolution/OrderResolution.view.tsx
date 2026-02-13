import { Button, Card, Pagination } from "@fineract-apps/ui";
import { FC, useState } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useOrderResolution } from "./useOrderResolution";

const statusColors: Record<string, string> = {
	NEEDS_RECONCILIATION: "bg-yellow-100 text-yellow-800",
	FAILED: "bg-red-100 text-red-800",
	MANUALLY_CLOSED: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
	const color = statusColors[status] ?? "bg-gray-100 text-gray-600";
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
		>
			{status.replace("_", " ")}
		</span>
	);
}

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

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Order Resolution
				</h1>

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

				{/* Orders Table */}
				{orders.length === 0 ? (
					<Card className="p-12 text-center">
						<p className="text-gray-500">No orders require resolution.</p>
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
											<tr key={order.orderId} className="hover:bg-gray-50">
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
													<Button
														variant="outline"
														onClick={() =>
															setResolveModal({
																orderId: order.orderId,
																resolution: "",
															})
														}
														className="text-xs"
													>
														Resolve
													</Button>
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
