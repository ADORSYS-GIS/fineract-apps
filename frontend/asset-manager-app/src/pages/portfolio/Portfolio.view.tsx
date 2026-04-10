import { Card } from "@fineract-apps/ui";
import { FC } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { TableSkeleton } from "@/components/TableSkeleton";
import type { PositionResponse } from "@/services/assetApi";
import { usePortfolio } from "./usePortfolio";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format a number as XAF with a thousands separator (e.g. "1 234 567 XAF"). */
function fmtXaf(value: number | undefined | null): string {
	if (value == null) return "—";
	return value.toLocaleString("fr-FR") + " XAF";
}

/** Format a percentage with two decimal places. */
function fmtPct(value: number | undefined | null): string {
	if (value == null) return "—";
	return value.toFixed(2) + " %";
}

/** Format an ISO date string to a short locale date, or "—" if absent. */
function fmtDate(iso: string | undefined | null): string {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

/** Determine the clean display price for a position. */
function getCleanPrice(pos: PositionResponse): number {
	return pos.cleanPrice ?? pos.marketPrice;
}

/** Determine the dirty display price for a position. */
function getDirtyPrice(pos: PositionResponse): number {
	return pos.dirtyPrice ?? pos.marketPrice;
}

/** Determine the total market value to display. */
function getMarketValue(pos: PositionResponse): number {
	return pos.dirtyMarketValue ?? pos.marketValue;
}

/** True when the position is a bond. */
function isBond(pos: PositionResponse): boolean {
	return !!pos.bondBenefit || !!pos.bondType;
}

/** True when accrued interest should be shown (OTA bonds, not BTA, not non-bonds). */
function showAccrued(pos: PositionResponse): boolean {
	if (!pos.bondType) return false;
	if (pos.bondType === "BTA") return false;
	return (pos.accruedInterestPerUnit ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface BondBadgeProps {
	bondType: string | undefined;
}

const BondBadge: FC<BondBadgeProps> = ({ bondType }) => {
	if (!bondType) return null;

	const isAmber = bondType === "BTA";
	return (
		<span
			className={[
				"inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ml-1.5",
				isAmber
					? "bg-amber-100 text-amber-800"
					: "bg-blue-100 text-blue-800",
			].join(" ")}
		>
			{bondType}
		</span>
	);
};

interface PnlCellProps {
	value: number;
}

const PnlCell: FC<PnlCellProps> = ({ value }) => {
	const isPositive = value >= 0;
	return (
		<span
			className={
				isPositive ? "text-green-600 font-medium" : "text-red-600 font-medium"
			}
		>
			{isPositive ? "+" : ""}
			{fmtXaf(value)}
		</span>
	);
};

// ---------------------------------------------------------------------------
// Summary bar card
// ---------------------------------------------------------------------------

interface SummaryCardProps {
	label: string;
	children: React.ReactNode;
}

const SummaryCard: FC<SummaryCardProps> = ({ label, children }) => (
	<Card className="p-4">
		<p className="text-sm text-gray-500">{label}</p>
		<div className="text-xl font-bold text-gray-900 mt-1">{children}</div>
	</Card>
);

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export const PortfolioView: FC<ReturnType<typeof usePortfolio>> = ({
	summary,
	positions,
	isLoading,
	isError,
	refetch,
}) => {
	if (isError) {
		return (
			<ErrorFallback
				message="Failed to load portfolio."
				onRetry={refetch}
			/>
		);
	}

	if (isLoading) {
		return (
			<div className="bg-gray-50 min-h-screen">
				<main className="p-4 sm:p-6 lg:p-8">
					<h1 className="text-2xl font-bold text-gray-800 mb-6">
						My Portfolio
					</h1>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						{[0, 1, 2, 3].map((i) => (
							<Card key={i} className="p-4 animate-pulse">
								<div className="h-3 bg-gray-200 rounded w-24 mb-3" />
								<div className="h-6 bg-gray-100 rounded w-32" />
							</Card>
						))}
					</div>
					<TableSkeleton rows={5} cols={9} />
				</main>
			</div>
		);
	}

	const pnlPositive = summary.unrealizedPnl >= 0;

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">My Portfolio</h1>

				{/* Summary bar */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<SummaryCard label="Total Market Value">
						{fmtXaf(summary.totalValue)}
					</SummaryCard>

					<SummaryCard label="Total Cost Basis">
						{fmtXaf(summary.totalCostBasis)}
					</SummaryCard>

					<SummaryCard label="Unrealized P&L">
						<span
							className={
								pnlPositive ? "text-green-600" : "text-red-600"
							}
						>
							{pnlPositive ? "+" : ""}
							{fmtXaf(summary.unrealizedPnl)}
							<span className="text-sm font-normal ml-2">
								({pnlPositive ? "+" : ""}
								{fmtPct(summary.unrealizedPnlPercent)})
							</span>
						</span>
					</SummaryCard>

					<SummaryCard label="Est. Annual Yield">
						{summary.estimatedAnnualYieldPercent != null
							? fmtPct(summary.estimatedAnnualYieldPercent)
							: "—"}
					</SummaryCard>
				</div>

				{/* Holdings table */}
				{positions.length === 0 ? (
					<Card className="p-12 text-center">
						<p className="text-gray-500">No positions in your portfolio.</p>
					</Card>
				) : (
					<div
						className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto"
						role="region"
						aria-label="Portfolio holdings table"
					>
						<table
							className="min-w-full divide-y divide-gray-200"
							aria-label="Portfolio holdings"
						>
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Asset
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Units
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Avg Cost
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Clean Price
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Accrued / Unit
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Dirty Price
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Market Value
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Unrealized P&L
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Next Coupon
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{positions.map((pos) => {
									const bond = isBond(pos);
									const accrued = showAccrued(pos);

									return (
										<tr key={pos.assetId} className="hover:bg-gray-50">
											{/* Asset */}
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<div>
														<div className="flex items-center">
															<span className="text-sm font-mono font-semibold text-gray-900">
																{pos.symbol ?? pos.assetId}
															</span>
															{bond && (
																<BondBadge bondType={pos.bondType} />
															)}
														</div>
														{pos.name && (
															<p className="text-xs text-gray-500 mt-0.5 max-w-[180px] truncate">
																{pos.name}
															</p>
														)}
													</div>
												</div>
											</td>

											{/* Units */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{pos.totalUnits.toLocaleString("fr-FR")}
											</td>

											{/* Avg Cost */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{fmtXaf(pos.avgPurchasePrice)}
											</td>

											{/* Clean Price */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{fmtXaf(getCleanPrice(pos))}
											</td>

											{/* Accrued Coupon */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
												{accrued
													? fmtXaf(pos.accruedInterestPerUnit)
													: <span className="text-gray-300">—</span>}
											</td>

											{/* Dirty Price */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{fmtXaf(getDirtyPrice(pos))}
											</td>

											{/* Market Value */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
												{fmtXaf(getMarketValue(pos))}
											</td>

											{/* Unrealized P&L */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
												<PnlCell value={pos.unrealizedPnl} />
												<div className="text-xs text-gray-400 mt-0.5">
													{pos.unrealizedPnl >= 0 ? "+" : ""}
													{pos.unrealizedPnlPercent.toFixed(2)}%
												</div>
											</td>

											{/* Next Coupon */}
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">
												{bond
													? fmtDate(pos.bondBenefit?.nextCouponDate)
													: <span className="text-gray-300">—</span>}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</div>
	);
};
