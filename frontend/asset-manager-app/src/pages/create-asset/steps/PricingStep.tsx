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
							Price per unit in XAF (Central African CFA Franc)
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
							Fee charged on each trade (default: 0.50%)
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
							Bid-ask spread percentage (default: 1.00%)
						</p>
					)}
				</div>
			</div>
		</div>
	);
};
