import { Button, Card, Pagination, SearchBar } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { FC } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";
import { StatusBadge } from "@/components/StatusBadge";
import { TableSkeleton } from "@/components/TableSkeleton";
import { useDashboard } from "./useDashboard";

const CATEGORIES = [
	{ value: "", label: "All" },
	{ value: "REAL_ESTATE", label: "Real Estate" },
	{ value: "COMMODITIES", label: "Commodities" },
	{ value: "AGRICULTURE", label: "Agriculture" },
	{ value: "STOCKS", label: "Stocks" },
	{ value: "CRYPTO", label: "Crypto" },
];

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
	refetch,
}) => {
	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Asset Catalog</h1>
						{marketStatus && (
							<p className="text-sm text-gray-500 mt-1">
								Market:{" "}
								<span
									className={
										marketStatus.isOpen
											? "text-green-600 font-medium"
											: "text-red-600 font-medium"
									}
								>
									{marketStatus.isOpen ? "Open" : "Closed"}
								</span>{" "}
								({marketStatus.schedule})
							</p>
						)}
					</div>
					<div className="flex items-center gap-3 w-full md:w-auto">
						<SearchBar
							value={searchValue}
							onValueChange={onSearchValueChange}
							onSearch={onSearch}
							placeholder="Search assets..."
							className="w-full md:w-64"
						/>
						<Link to="/create-asset">
							<Button className="flex items-center gap-2 whitespace-nowrap">
								<PlusCircle className="h-4 w-4" />
								<span>Create Asset</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Category Filter */}
				<div
					className="flex gap-2 mb-6 flex-wrap"
					role="group"
					aria-label="Filter by category"
				>
					{CATEGORIES.map((cat) => (
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

				{/* Assets Table */}
				{isAssetsError ? (
					<ErrorFallback message="Failed to load assets." onRetry={refetch} />
				) : isFetchingAssets ? (
					<TableSkeleton rows={5} cols={6} />
				) : assets.length === 0 ? (
					<Card className="p-12 text-center">
						<p className="text-gray-500">No assets found.</p>
						<Link to="/create-asset" className="mt-4 inline-block">
							<Button>Create your first asset</Button>
						</Link>
					</Card>
				) : (
					<>
						<div
							className="bg-white rounded-lg shadow overflow-hidden"
							role="region"
							aria-label="Asset catalog table"
						>
							<table
								className="min-w-full divide-y divide-gray-200"
								aria-label="Asset catalog"
							>
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Name
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Symbol
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Price (XAF)
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											24h Change
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Available
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Actions
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
												{asset.currentPrice?.toLocaleString() ?? "—"}
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
												{asset.availableSupply?.toLocaleString() ?? "—"}
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
														Manage
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
		</div>
	);
};
