import { Card } from "@fineract-apps/ui";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { assetApi, type RedemptionHistoryResponse } from "@/services/assetApi";

interface Props {
	assetId: string;
}

export const RedemptionHistoryTable: FC<Props> = ({ assetId }) => {
	const [page, setPage] = useState(0);
	const pageSize = 10;

	const { data, isLoading } = useQuery({
		queryKey: ["redemption-history", assetId, page],
		queryFn: () =>
			assetApi.getRedemptionHistory(assetId, { page, size: pageSize }),
		select: (res) => res.data,
	});

	const redemptions = data?.content ?? [];
	const totalPages = data?.totalPages ?? 0;

	return (
		<Card className="p-4 mb-6">
			<h2 className="text-lg font-semibold text-gray-800 mb-3">
				Principal Redemption History
			</h2>

			{isLoading ? (
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
				</div>
			) : redemptions.length === 0 ? (
				<p className="text-sm text-gray-500 py-4 text-center">
					No principal redemptions yet.
				</p>
			) : (
				<>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200 text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										Date
									</th>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										User ID
									</th>
									<th className="px-3 py-2 text-right font-medium text-gray-500">
										Units
									</th>
									<th className="px-3 py-2 text-right font-medium text-gray-500">
										Face Value
									</th>
									<th className="px-3 py-2 text-right font-medium text-gray-500">
										Amount (XAF)
									</th>
									<th className="px-3 py-2 text-right font-medium text-gray-500">
										P&L
									</th>
									<th className="px-3 py-2 text-left font-medium text-gray-500">
										Status
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{redemptions.map((r: RedemptionHistoryResponse) => (
									<tr key={r.id} className="hover:bg-gray-50">
										<td className="px-3 py-2 whitespace-nowrap">
											{new Date(r.redeemedAt).toLocaleDateString()}
										</td>
										<td className="px-3 py-2">{r.userId}</td>
										<td className="px-3 py-2 text-right">
											{r.units.toLocaleString()}
										</td>
										<td className="px-3 py-2 text-right">
											{r.faceValue.toLocaleString()}
										</td>
										<td className="px-3 py-2 text-right font-medium">
											{r.cashAmount.toLocaleString()}
										</td>
										<td className="px-3 py-2 text-right">
											{r.realizedPnl != null ? (
												<span
													className={
														r.realizedPnl >= 0
															? "text-green-600"
															: "text-red-600"
													}
												>
													{r.realizedPnl >= 0 ? "+" : ""}
													{r.realizedPnl.toLocaleString()}
												</span>
											) : (
												"—"
											)}
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
								disabled={page === 0}
								onClick={() => setPage((p) => Math.max(0, p - 1))}
							>
								Previous
							</button>
							<span className="text-sm text-gray-500">
								Page {page + 1} of {totalPages}
							</span>
							<button
								type="button"
								className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-50"
								disabled={page >= totalPages - 1}
								onClick={() => setPage((p) => p + 1)}
							>
								Next
							</button>
						</div>
					)}
				</>
			)}
		</Card>
	);
};
