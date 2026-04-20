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

	const isBtaBond =
		formData.category === "BONDS" && formData.bondType === "DISCOUNT";

	// LP margin display (manual mode or when ask/bid are set)
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
					Set the issuer price, LP bid/ask spread, and fee structure for this
					asset.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Face Value — BTA only */}
				{isBtaBond && (
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Face Value (XAF) *
						</label>
						<input
							type="number"
							aria-label="Face value"
							className={inputClass("face value")}
							placeholder="e.g. 5000"
							value={formData.faceValue || ""}
							onChange={(e) =>
								updateFormData({ faceValue: Number(e.target.value) })
							}
							min={0}
						/>
						{fieldError("face value") ? (
							<p className="text-xs text-red-600 mt-1">
								{fieldError("face value")}
							</p>
						) : (
							<p className="text-xs text-gray-400 mt-1">
								Par value redeemed at maturity. BTA purchase price is discounted
								below this value.
							</p>
						)}
					</div>
				)}

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
							{isBtaBond
								? "Current discounted purchase price (below face value)"
								: "Wholesale price from the original issuer"}
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
							Fee on each BUY/SELL transaction. Default: 0.50%
						</p>
					)}
				</div>
			</div>

			{/* LP Pricing Mode */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					LP Pricing Mode
				</label>
				<div className="flex gap-2 mb-4">
					<button
						type="button"
						onClick={() => updateFormData({ pricingMode: "spread" })}
						className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
							formData.pricingMode === "spread"
								? "bg-blue-600 text-white border-blue-600"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
						}`}
					>
						Spread %
					</button>
					<button
						type="button"
						onClick={() => updateFormData({ pricingMode: "manual" })}
						className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
							formData.pricingMode === "manual"
								? "bg-blue-600 text-white border-blue-600"
								: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
						}`}
					>
						Manual Prices
					</button>
				</div>

				{formData.pricingMode === "spread" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Spread (%)
							</label>
							<input
								type="number"
								aria-label="Spread percent"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								placeholder="0.30"
								value={formData.spreadPercent}
								onChange={(e) =>
									updateFormData({ spreadPercent: Number(e.target.value) })
								}
								min={0}
								max={10}
								step={0.01}
							/>
							<p className="text-xs text-gray-400 mt-1">
								Ask = issuerPrice × (1 + spread%), Bid = issuerPrice × (1 −
								spread%). Default: 0.30%
							</p>
						</div>
						{formData.issuerPrice > 0 && (
							<div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col justify-center gap-1 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">LP Ask Price:</span>
									<span className="font-medium">
										{formData.lpAskPrice.toLocaleString()} XAF
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">LP Bid Price:</span>
									<span className="font-medium">
										{formData.lpBidPrice.toLocaleString()} XAF
									</span>
								</div>
							</div>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
								<p className="text-xs text-red-600 mt-1">
									{fieldError("lp ask")}
								</p>
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
								<p className="text-xs text-red-600 mt-1">
									{fieldError("lp bid")}
								</p>
							) : (
								<p className="text-xs text-gray-400 mt-1">
									What investors receive when selling. Must be &le; LP ask price
								</p>
							)}
						</div>
					</div>
				)}
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
		</div>
	);
};
