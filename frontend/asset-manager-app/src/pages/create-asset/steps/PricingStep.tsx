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
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Pricing & Fees
				</h2>
				<p className="text-sm text-gray-500">
					Set the initial price and fee structure for this asset.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Initial Price (XAF) *
					</label>
					<input
						type="number"
						aria-label="Initial price"
						className={inputClass("price")}
						placeholder="e.g. 5000"
						value={formData.initialPrice || ""}
						onChange={(e) =>
							updateFormData({ initialPrice: Number(e.target.value) })
						}
						min={0}
					/>
					{fieldError("price") ? (
						<p className="text-xs text-red-600 mt-1">{fieldError("price")}</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							Starting price per unit in XAF. For bonds, this is also the face
							value used in coupon calculations
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
						Spread (%)
					</label>
					<input
						type="number"
						aria-label="Spread"
						className={inputClass("spread")}
						placeholder="1.00"
						value={formData.spreadPercent}
						onChange={(e) =>
							updateFormData({ spreadPercent: Number(e.target.value) })
						}
						min={0}
						max={20}
						step={0.01}
					/>
					{fieldError("spread") ? (
						<p className="text-xs text-red-600 mt-1">{fieldError("spread")}</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							Difference between buy (ask) and sell (bid) price. Ask = price +
							spread, Bid = price - spread. Default: 1.00%
						</p>
					)}
				</div>
			</div>

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
			</div>
		</div>
	);
};
