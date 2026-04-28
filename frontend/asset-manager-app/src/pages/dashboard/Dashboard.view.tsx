import { Button, Card, Pagination, SearchBar } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { PlusCircle, Upload } from "lucide-react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ErrorFallback } from "@/components/ErrorFallback";
import { ExportTemplateMenu } from "@/components/ExportTemplateMenu";
import { ImportAssetsDialog } from "@/components/ImportAssetsDialog";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
	ASSET_CATEGORIES_WITH_ALL,
	BOND_FILTER_OPTIONS,
	BOND_ONLY_MODE,
} from "@/constants/categories";
import { formatNumber } from "@/lib/format";
import { useDashboard } from "./useDashboard";

const StatCard: FC<{
	title: string;
	children: React.ReactNode;
}> = ({ title, children }) => (
	<Card className="p-4">
		<h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
			{title}
		</h3>
		{children}
	</Card>
);

export const DashboardView: FC<ReturnType<typeof useDashboard>> = ({
	searchValue,
	onSearchValueChange,
	onSearch,
	assets,
	isFetchingAssets,
	isAssetsError,
	currentPage,
	totalPages,
	onPageChange,
	categoryFilter,
	onCategoryChange,
	marketStatus,
	dashboardSummary,
	settlementSummary,
	refetch,
	isImportOpen,
	onOpenImport,
	onCloseImport,
}) => {
	const { t } = useTranslation();

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							{t("assetManager.dashboard.title")}
						</h1>
						{marketStatus && (
							<p className="text-sm text-gray-500 mt-1">
								{t("assetManager.dashboard.market")}:{" "}
								<span
									className={
										marketStatus.isOpen
											? "text-green-600 font-medium"
											: "text-red-600 font-medium"
									}
								>
									{marketStatus.isOpen
										? t("assetManager.dashboard.marketOpen")
										: t("assetManager.dashboard.marketClosed")}
								</span>{" "}
								({marketStatus.schedule})
							</p>
						)}
					</div>
					<div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
						<SearchBar
							value={searchValue}
							onValueChange={onSearchValueChange}
							onSearch={onSearch}
							placeholder={t("assetManager.dashboard.searchPlaceholder")}
							className="w-full md:w-64"
						/>
						<ExportTemplateMenu />
						<Button
							variant="outline"
							onClick={onOpenImport}
							className="flex items-center gap-2 whitespace-nowrap"
						>
							<Upload className="h-4 w-4" />
							<span>{t("assetManager.dashboard.importAssets")}</span>
						</Button>
						<Link to="/create-asset">
							<Button className="flex items-center gap-2 whitespace-nowrap">
								<PlusCircle className="h-4 w-4" />
								<span>{t("assetManager.dashboard.createAsset")}</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Category Filter */}
				<div
					className="flex gap-2 mb-6 flex-wrap"
					role="group"
					aria-label={t("assetManager.dashboard.filterByCategory")}
				>
					{(BOND_ONLY_MODE
						? BOND_FILTER_OPTIONS
						: ASSET_CATEGORIES_WITH_ALL
					).map((cat) => (
						<button
							key={cat.value}
							onClick={() => onCategoryChange(cat.value)}
							aria-pressed={categoryFilter === cat.value}
							className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
								categoryFilter === cat.value
									? "bg-blue-600 text-white border-blue-600"
									: "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
							}`}
						>
							{cat.label}
						</button>
					))}
				</div>

				{/* Dashboard Summary */}
				{dashboardSummary && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						<StatCard title={t("assetManager.dashboard.stats.assets")}>
							<p className="text-2xl font-bold text-gray-900">
								{dashboardSummary.assets.active}
								<span className="text-sm font-normal text-gray-500">
									{" "}
									{t("assetManager.dashboard.stats.active")}
								</span>
							</p>
							<div className="flex gap-3 mt-1 text-xs text-gray-500">
								<span>
									{t("assetManager.dashboard.stats.pending", {
										count: dashboardSummary.assets.pending,
									})}
								</span>
								<span>
									{t("assetManager.dashboard.stats.halted", {
										count: dashboardSummary.assets.halted,
									})}
								</span>
								<span>
									{t("assetManager.dashboard.stats.total", {
										count: dashboardSummary.assets.total,
									})}
								</span>
								<span>
									{t("assetManager.dashboard.stats.investors", {
										count: dashboardSummary.activeInvestors,
									})}
								</span>
							</div>
						</StatCard>

						<StatCard title={t("assetManager.dashboard.stats.trading24h")}>
							<p className="text-2xl font-bold text-gray-900">
								{dashboardSummary.trading.tradeCount24h}
								<span className="text-sm font-normal text-gray-500">
									{" "}
									{t("assetManager.dashboard.stats.trades")}
								</span>
							</p>
							<div className="flex gap-3 mt-1 text-xs text-gray-500">
								<span className="text-green-600">
									{t("assetManager.dashboard.stats.buy", {
										volume: formatNumber(dashboardSummary.trading.buyVolume24h),
									})}
								</span>
								<span className="text-red-600">
									{t("assetManager.dashboard.stats.sell", {
										volume: formatNumber(
											dashboardSummary.trading.sellVolume24h,
										),
									})}
								</span>
								<span>
									{t("assetManager.dashboard.stats.traders", {
										count: dashboardSummary.trading.activeTraders24h,
									})}
								</span>
							</div>
						</StatCard>

						<StatCard title={t("assetManager.dashboard.stats.orderHealth")}>
							{dashboardSummary.orders.needsReconciliation +
								dashboardSummary.orders.failed >
							0 ? (
								<>
									<p className="text-2xl font-bold text-red-600">
										{dashboardSummary.orders.needsReconciliation +
											dashboardSummary.orders.failed}
										<span className="text-sm font-normal">
											{" "}
											{t("assetManager.dashboard.stats.issues")}
										</span>
									</p>
									<div className="flex gap-3 mt-1 text-xs text-gray-500">
										<span>
											{t("assetManager.dashboard.stats.stuck", {
												count: dashboardSummary.orders.needsReconciliation,
											})}
										</span>
										<span>
											{t("assetManager.dashboard.stats.failed", {
												count: dashboardSummary.orders.failed,
											})}
										</span>
									</div>
								</>
							) : (
								<p className="text-2xl font-bold text-green-600">
									{t("assetManager.dashboard.stats.allClear")}
								</p>
							)}
						</StatCard>
					</div>
				)}

				{/* Settlement Alert */}
				{settlementSummary && settlementSummary.pendingCount > 0 && (
					<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center justify-between">
						<div>
							<p className="font-semibold text-yellow-800 dark:text-yellow-200">
								{t("assetManager.dashboard.settlementsPending", {
									count: settlementSummary.pendingCount,
								})}
							</p>
							<p className="text-sm text-yellow-600 dark:text-yellow-400">
								{settlementSummary.approvedCount > 0
									? t("assetManager.dashboard.settlementsApproved", {
											count: settlementSummary.approvedCount,
										})
									: t("assetManager.dashboard.settlementsAwaitingApproval")}
							</p>
						</div>
						<Link
							to="/settlement"
							className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
						>
							{t("assetManager.dashboard.viewSettlements")}
						</Link>
					</div>
				)}

				{/* Assets Table */}
				{isAssetsError ? (
					<ErrorFallback
						message={t("assetManager.dashboard.loadAssetsFailed")}
						onRetry={refetch}
					/>
				) : isFetchingAssets ? (
					<TableSkeleton rows={5} cols={6} />
				) : assets.length === 0 ? (
					<Card className="p-12 text-center">
						<p className="text-gray-500">
							{t("assetManager.dashboard.noAssets")}
						</p>
						<Link to="/create-asset" className="mt-4 inline-block">
							<Button>{t("assetManager.dashboard.createFirstAsset")}</Button>
						</Link>
					</Card>
				) : (
					<>
						<div
							className="bg-white rounded-lg shadow overflow-hidden"
							role="region"
							aria-label={t("assetManager.dashboard.table.region")}
						>
							<table
								className="min-w-full divide-y divide-gray-200"
								aria-label={t("assetManager.dashboard.table.caption")}
							>
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("assetManager.dashboard.table.name")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("assetManager.dashboard.table.symbol")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("assetManager.dashboard.table.priceXaf")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("assetManager.dashboard.table.change24h")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("assetManager.dashboard.table.available")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("assetManager.dashboard.table.status")}
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											{t("assetManager.dashboard.table.actions")}
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{assets.map((asset) => (
										<tr key={asset.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="font-medium text-gray-900">
													{asset.name}
												</div>
												<div className="text-sm text-gray-500">
													{asset.category}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
												{asset.symbol}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{asset.askPrice != null
													? formatNumber(asset.askPrice)
													: "—"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={
														(asset.change24hPercent ?? 0) >= 0
															? "text-green-600"
															: "text-red-600"
													}
												>
													{(asset.change24hPercent ?? 0) >= 0 ? "+" : ""}
													{(asset.change24hPercent ?? 0).toFixed(2)}%
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{asset.availableSupply != null
													? formatNumber(asset.availableSupply)
													: "—"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<StatusBadge status={asset.status} />
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<Link
													to="/asset-details/$assetId"
													params={{ assetId: asset.id }}
												>
													<Button variant="outline" className="text-xs">
														{t("assetManager.dashboard.manageAsset")}
													</Button>
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="mt-4">
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={onPageChange}
							/>
						</div>
					</>
				)}
			</main>

			<ImportAssetsDialog
				isOpen={isImportOpen}
				onClose={onCloseImport}
				onSuccess={refetch}
			/>
		</div>
	);
};
