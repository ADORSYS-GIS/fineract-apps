import { Card } from "@fineract-apps/ui";
import { RefreshCw } from "lucide-react";
import { FC } from "react";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useLPPerformance } from "./useLPPerformance";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

const StatCard: FC<{
	title: string;
	value: string;
	subtitle?: string;
	color?: string;
}> = ({ title, value, subtitle, color = "text-gray-900" }) => (
	<Card className="p-4">
		<h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
			{title}
		</h3>
		<p className={`text-2xl font-bold ${color}`}>{value}</p>
		{subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
	</Card>
);

export const LPPerformanceView: FC<ReturnType<typeof useLPPerformance>> = ({
	performance,
	isLoading,
	isError,
	refetch,
}) => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">LP Performance</h1>
						<p className="text-sm text-gray-500 mt-1">
							Liquidity provider spread earnings and trade metrics
						</p>
					</div>
					<button
						type="button"
						onClick={() => refetch()}
						className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
					>
						<RefreshCw className="w-4 h-4" />
						Refresh
					</button>
				</div>

				{isError && (
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
						<p className="text-red-700">
							Failed to load LP performance data. Please try again.
						</p>
					</div>
				)}

				{isLoading ? (
					<TableSkeleton rows={5} cols={6} />
				) : performance ? (
					<>
						{/* Summary Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
							<StatCard
								title="Net Margin"
								value={`${fmt(performance.netMargin)} XAF`}
								subtitle="Spread + fees - buyback"
								color={
									performance.netMargin >= 0 ? "text-green-700" : "text-red-700"
								}
							/>
							<StatCard
								title="Spread Earned"
								value={`${fmt(performance.totalSpreadEarned)} XAF`}
								subtitle="From bid/ask spread on trades"
							/>
							<StatCard
								title="Buyback Premium Paid"
								value={`${fmt(performance.totalBuybackPremiumPaid)} XAF`}
								subtitle="Premium paid when bid > issuer"
								color="text-orange-700"
							/>
							<StatCard
								title="Total Trades"
								value={performance.totalTrades.toLocaleString("fr-FR")}
								subtitle={`Fee commission: ${fmt(performance.totalFeeCommission)} XAF`}
							/>
						</div>

						{/* Per-Asset Table */}
						<Card className="overflow-hidden">
							<div className="px-4 py-3 border-b border-gray-200">
								<h2 className="text-sm font-semibold text-gray-700">
									Performance by Asset
								</h2>
							</div>
							{performance.perAsset.length === 0 ? (
								<div className="p-8 text-center text-gray-500">
									No trade data yet. Performance will appear after trades are
									executed.
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Asset
												</th>
												<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
													Spread Earned
												</th>
												<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
													Buyback Premium
												</th>
												<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
													Fee Commission
												</th>
												<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
													Net Margin
												</th>
												<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
													Trades
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{performance.perAsset.map((asset) => (
												<tr key={asset.assetId} className="hover:bg-gray-50">
													<td className="px-4 py-3 text-sm font-medium text-gray-900">
														{asset.symbol}
													</td>
													<td className="px-4 py-3 text-sm text-right text-gray-700">
														{fmt(asset.spreadEarned)} XAF
													</td>
													<td className="px-4 py-3 text-sm text-right text-orange-600">
														{fmt(asset.buybackPremiumPaid)} XAF
													</td>
													<td className="px-4 py-3 text-sm text-right text-gray-700">
														{fmt(asset.feeCommission)} XAF
													</td>
													<td
														className={`px-4 py-3 text-sm text-right font-medium ${
															asset.netMargin >= 0
																? "text-green-700"
																: "text-red-700"
														}`}
													>
														{fmt(asset.netMargin)} XAF
													</td>
													<td className="px-4 py-3 text-sm text-right text-gray-500">
														{asset.tradeCount.toLocaleString("fr-FR")}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</Card>
					</>
				) : null}
			</main>
		</div>
	);
};
