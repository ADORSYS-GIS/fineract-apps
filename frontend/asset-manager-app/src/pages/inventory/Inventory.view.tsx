import { Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { useInventory } from "./useInventory";

export const InventoryView: FC<ReturnType<typeof useInventory>> = ({
	inventory,
	isLoading,
}) => {
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				<h1 className="text-2xl font-bold text-gray-800 mb-6">
					Asset Inventory
				</h1>

				{/* Summary Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
					<Card className="p-4">
						<p className="text-sm text-gray-500">Total Assets</p>
						<p className="text-2xl font-bold text-gray-900">
							{inventory.length}
						</p>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Total Circulating Units</p>
						<p className="text-2xl font-bold text-gray-900">
							{inventory
								.reduce((sum, i) => sum + i.circulatingSupply, 0)
								.toLocaleString()}
						</p>
					</Card>
					<Card className="p-4">
						<p className="text-sm text-gray-500">Total Available Units</p>
						<p className="text-2xl font-bold text-gray-900">
							{inventory
								.reduce((sum, i) => sum + i.availableSupply, 0)
								.toLocaleString()}
						</p>
					</Card>
				</div>

				{/* Inventory Table */}
				{inventory.length === 0 ? (
					<Card className="p-12 text-center">
						<p className="text-gray-500">No assets in inventory.</p>
					</Card>
				) : (
					<div className="bg-white rounded-lg shadow overflow-hidden">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Asset
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Symbol
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Total Supply
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Circulating
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Available
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Treasury Balance
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Utilization
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{inventory.map((item) => {
									const utilization =
										item.totalSupply > 0
											? (
													(item.circulatingSupply / item.totalSupply) *
													100
												).toFixed(1)
											: "0.0";
									return (
										<tr key={item.assetId} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<Link
													to="/asset-details/$assetId"
													params={{ assetId: item.assetId }}
													className="text-blue-600 hover:text-blue-800 font-medium"
												>
													{item.name}
												</Link>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
												{item.symbol}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{item.totalSupply.toLocaleString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{item.circulatingSupply.toLocaleString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{item.availableSupply.toLocaleString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{item.treasuryBalance.toLocaleString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-right">
												<div className="flex items-center justify-end gap-2">
													<div className="w-16 bg-gray-200 rounded-full h-2">
														<div
															className="bg-blue-600 h-2 rounded-full"
															style={{
																width: `${Math.min(Number(utilization), 100)}%`,
															}}
														/>
													</div>
													<span className="text-gray-700">{utilization}%</span>
												</div>
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
