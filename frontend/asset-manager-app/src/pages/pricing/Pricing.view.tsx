import { Button, Card } from "@fineract-apps/ui";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import { usePricing } from "./usePricing";

const PERIODS = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

export const PricingView: FC<ReturnType<typeof usePricing>> = ({
	assetId,
	asset,
	price,
	isLoadingPrice,
	priceHistory,
	isLoadingHistory,
	period,
	setPeriod,
	onSetPrice,
	isSettingPrice,
}) => {
	const [manualPrice, setManualPrice] = useState("");

	const handleSetPrice = () => {
		const p = Number(manualPrice);
		if (Number.isFinite(p) && p > 0) {
			onSetPrice(p);
			setManualPrice("");
		}
	};

	return (
		<div className="bg-gray-50 min-h-screen">
			<main className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex items-center gap-4 mb-6">
					<Link to="/asset-details/$assetId" params={{ assetId }}>
						<Button variant="outline" className="p-2">
							<ArrowLeft className="h-4 w-4" />
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							Pricing - {asset?.name ?? assetId}
						</h1>
						<p className="text-sm text-gray-500">
							Price management and history
						</p>
					</div>
				</div>

				{/* Current Price */}
				{isLoadingPrice ? (
					<div className="flex justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<Card className="p-4">
							<p className="text-sm text-gray-500">Current Price</p>
							<p className="text-2xl font-bold">
								{price?.currentPrice?.toLocaleString() ?? "—"} XAF
							</p>
						</Card>
						<Card className="p-4">
							<p className="text-sm text-gray-500">Previous Close</p>
							<p className="text-xl font-semibold">
								{price?.previousClose?.toLocaleString() ?? "—"} XAF
							</p>
						</Card>
						<Card className="p-4">
							<p className="text-sm text-gray-500">24h Change</p>
							<p
								className={`text-xl font-semibold ${
									(price?.change24hPercent ?? 0) >= 0
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{(price?.change24hPercent ?? 0) >= 0 ? "+" : ""}
								{(price?.change24hPercent ?? 0).toFixed(2)}%
							</p>
						</Card>
						<Card className="p-4">
							<p className="text-sm text-gray-500">Price Mode</p>
							<p className="text-xl font-semibold">{asset?.priceMode ?? "—"}</p>
						</Card>
					</div>
				)}

				{/* OHLC */}
				{price && (
					<Card className="p-4 mb-6">
						<h2 className="text-lg font-semibold text-gray-800 mb-3">
							OHLC (Today)
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div>
								<p className="text-sm text-gray-500">Open</p>
								<p className="font-medium">
									{price.dayOpen?.toLocaleString() ?? "—"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">High</p>
								<p className="font-medium text-green-600">
									{price.dayHigh?.toLocaleString() ?? "—"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Low</p>
								<p className="font-medium text-red-600">
									{price.dayLow?.toLocaleString() ?? "—"}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Close</p>
								<p className="font-medium">
									{price.dayClose?.toLocaleString() ?? "—"}
								</p>
							</div>
						</div>
					</Card>
				)}

				{/* Manual Price Override */}
				<Card className="p-4 mb-6">
					<h2 className="text-lg font-semibold text-gray-800 mb-3">
						Set Manual Price
					</h2>
					<div className="flex gap-3 items-end">
						<div className="flex-1">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								New Price (XAF)
							</label>
							<input
								type="number"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="Enter new price..."
								value={manualPrice}
								onChange={(e) => setManualPrice(e.target.value)}
								min={0}
							/>
						</div>
						<Button
							onClick={handleSetPrice}
							disabled={!manualPrice || isSettingPrice}
						>
							{isSettingPrice ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Set Price"
							)}
						</Button>
					</div>
				</Card>

				{/* Price History */}
				<Card className="p-4">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold text-gray-800">
							Price History
						</h2>
						<div className="flex gap-1">
							{PERIODS.map((p) => (
								<button
									key={p}
									onClick={() => setPeriod(p)}
									className={`px-3 py-1 text-xs rounded ${
										period === p
											? "bg-blue-600 text-white"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
									}`}
								>
									{p}
								</button>
							))}
						</div>
					</div>
					{isLoadingHistory ? (
						<div className="flex justify-center py-8">
							<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
						</div>
					) : priceHistory.length === 0 ? (
						<p className="text-sm text-gray-500 text-center py-8">
							No price history available
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="min-w-full text-sm">
								<thead>
									<tr className="text-left text-xs text-gray-500 uppercase border-b">
										<th className="pb-2">Timestamp</th>
										<th className="pb-2">Price (XAF)</th>
									</tr>
								</thead>
								<tbody>
									{priceHistory.map((point) => (
										<tr
											key={point.capturedAt}
											className="border-b border-gray-100"
										>
											<td className="py-2 text-gray-600">
												{new Date(point.capturedAt).toLocaleString()}
											</td>
											<td className="py-2 font-mono">
												{point.price.toLocaleString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</Card>
			</main>
		</div>
	);
};
