import { FC } from "react";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
	validationErrors: string[];
}

export const PricingStep: FC<Props> = ({
	formData,
	updateFormData,
	validationErrors,
}) => {
	const fieldError = (keyword: string) =>
		validationErrors.find((e) => e.toLowerCase().includes(keyword));
	const inputClass = (keyword: string) =>
		`w-full border rounded-lg px-3 py-2 focus:ring-2 ${fieldError(keyword) ? "border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"}`;

	// Computed LP margin
	const lpMargin =
		formData.lpAskPrice > 0 && formData.issuerPrice > 0
			? formData.lpAskPrice - formData.issuerPrice
			: 0;
	const lpMarginPercent =
		formData.issuerPrice > 0 ? (lpMargin / formData.issuerPrice) * 100 : 0;

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Pricing & Fees
				</h2>
				<p className="text-sm text-gray-500">
					Set the issuer price, LP bid/ask prices, and fee structure for this
					asset.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Issuer Price (XAF) *
					</label>
					<input
						type="number"
						aria-label="Issuer price"
						className={inputClass("issuer price")}
						placeholder="e.g. 5000"
						value={formData.issuerPrice || ""}
						onChange={(e) =>
							updateFormData({ issuerPrice: Number(e.target.value) })
						}
						min={0}
					/>
					{fieldError("issuer price") ? (
						<p className="text-xs text-red-600 mt-1">
							{fieldError("issuer price")}
						</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							The face value (bonds) or wholesale price from the original issuer
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Trading Fee (%)
					</label>
					<input
						type="number"
						aria-label="Trading fee"
						className={inputClass("trading fee")}
						placeholder="0.50"
						value={formData.tradingFeePercent}
						onChange={(e) =>
							updateFormData({ tradingFeePercent: Number(e.target.value) })
						}
						min={0}
						max={10}
						step={0.01}
					/>
					{fieldError("trading fee") ? (
						<p className="text-xs text-red-600 mt-1">
							{fieldError("trading fee")}
						</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							Fee charged on each BUY/SELL transaction. Added to buyer's cost,
							deducted from seller's proceeds. Default: 0.50%
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						LP Ask Price (XAF) *
					</label>
					<input
						type="number"
						aria-label="LP ask price"
						className={inputClass("lp ask")}
						placeholder="e.g. 5100"
						value={formData.lpAskPrice || ""}
						onChange={(e) =>
							updateFormData({ lpAskPrice: Number(e.target.value) })
						}
						min={0}
					/>
					{fieldError("lp ask") ? (
						<p className="text-xs text-red-600 mt-1">{fieldError("lp ask")}</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							What investors pay to buy. Must be &ge; issuer price
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						LP Bid Price (XAF)
					</label>
					<input
						type="number"
						aria-label="LP bid price"
						className={inputClass("lp bid")}
						placeholder="e.g. 4900"
						value={formData.lpBidPrice || ""}
						onChange={(e) =>
							updateFormData({ lpBidPrice: Number(e.target.value) })
						}
						min={0}
					/>
					{fieldError("lp bid") ? (
						<p className="text-xs text-red-600 mt-1">{fieldError("lp bid")}</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							What investors receive when selling. Must be &le; LP ask price
						</p>
					)}
				</div>
			</div>

			{/* LP Margin Display */}
			{formData.lpAskPrice > 0 && formData.issuerPrice > 0 && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
					<p className="text-sm text-blue-800 font-medium">
						LP Margin: {lpMargin.toLocaleString()} XAF/unit (
						{lpMarginPercent.toFixed(2)}%)
					</p>
				</div>
			)}

			{/* Exposure Limits */}
			<div className="mt-6">
				<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
					Trading Limits (Optional)
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Max Position (% of supply)
						</label>
						<input
							type="number"
							aria-label="Max position percent"
							className={inputClass("max position")}
							placeholder="e.g. 10"
							value={formData.maxPositionPercent || ""}
							onChange={(e) =>
								updateFormData({
									maxPositionPercent: Number(e.target.value),
								})
							}
							min={0}
							max={100}
							step={0.01}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Max % of total supply one user can hold. Leave at 0 for no limit.
							Example: 10 means a user can hold at most 10% of all units
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Max Order Size (units)
						</label>
						<input
							type="number"
							aria-label="Max order size"
							className={inputClass("max order")}
							placeholder="e.g. 1000"
							value={formData.maxOrderSize || ""}
							onChange={(e) =>
								updateFormData({
									maxOrderSize: Number(e.target.value),
								})
							}
							min={0}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Max units a user can buy or sell in a single order. Leave at 0 for
							no limit
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Daily Trade Limit (XAF)
						</label>
						<input
							type="number"
							aria-label="Daily trade limit"
							className={inputClass("daily")}
							placeholder="e.g. 5000000"
							value={formData.dailyTradeLimitXaf || ""}
							onChange={(e) =>
								updateFormData({
									dailyTradeLimitXaf: Number(e.target.value),
								})
							}
							min={0}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Max total XAF value a user can trade per day for this asset.
							Resets at midnight. Leave at 0 for no limit
						</p>
					</div>
				</div>

				<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3 mt-6">
					Minimum Order Size (Optional)
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Min Order Size (units)
						</label>
						<input
							type="number"
							aria-label="Min order size"
							className={inputClass("min order")}
							placeholder="e.g. 1"
							value={formData.minOrderSize || ""}
							onChange={(e) =>
								updateFormData({
									minOrderSize: Number(e.target.value),
								})
							}
							min={0}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Minimum units per single order. Leave at 0 for no minimum
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Min Order Amount (XAF)
						</label>
						<input
							type="number"
							aria-label="Min order cash amount"
							className={inputClass("min cash")}
							placeholder="e.g. 10000"
							value={formData.minOrderCashAmount || ""}
							onChange={(e) =>
								updateFormData({
									minOrderCashAmount: Number(e.target.value),
								})
							}
							min={0}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Minimum XAF amount per single order. Leave at 0 for no minimum
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
