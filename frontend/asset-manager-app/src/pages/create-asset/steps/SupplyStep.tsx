import { FC } from "react";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
	validationErrors: string[];
}

export const SupplyStep: FC<Props> = ({
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
				<h2 className="text-lg font-semibold text-gray-800 mb-1">Supply</h2>
				<p className="text-sm text-gray-500">
					Define the total supply and precision for this asset.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Total Supply (Units) *
					</label>
					<input
						type="number"
						aria-label="Total supply"
						className={inputClass("supply")}
						placeholder="e.g. 100000"
						value={formData.totalSupply || ""}
						onChange={(e) =>
							updateFormData({ totalSupply: Number(e.target.value) })
						}
						min={1}
					/>
					{fieldError("supply") ? (
						<p className="text-xs text-red-600 mt-1">{fieldError("supply")}</p>
					) : (
						<p className="text-xs text-gray-400 mt-1">
							Total number of units to mint into the treasury
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Decimal Places
					</label>
					<select
						aria-label="Decimal places"
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={formData.decimalPlaces}
						onChange={(e) =>
							updateFormData({ decimalPlaces: Number(e.target.value) })
						}
					>
						<option value={0}>0 (whole units only)</option>
						<option value={2}>2 (e.g. 1.50 units)</option>
						<option value={4}>4 (e.g. 1.0050 units)</option>
						<option value={8}>8 (high precision)</option>
					</select>
					<p className="text-xs text-gray-400 mt-1">
						Precision for fractional ownership
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Expected Launch Date
					</label>
					<input
						type="date"
						aria-label="Expected launch date"
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={formData.expectedLaunchDate}
						onChange={(e) =>
							updateFormData({ expectedLaunchDate: e.target.value })
						}
					/>
					<p className="text-xs text-gray-400 mt-1">
						Leave empty if the asset is ready to go live immediately
					</p>
				</div>
			</div>

			{/* Summary */}
			{formData.totalSupply > 0 && formData.initialPrice > 0 && (
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
					<h3 className="text-sm font-semibold text-blue-800 mb-2">
						Supply Summary
					</h3>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="text-gray-600">Total Supply:</div>
						<div className="font-medium">
							{formData.totalSupply.toLocaleString()} units
						</div>
						<div className="text-gray-600">Price per Unit:</div>
						<div className="font-medium">
							{formData.initialPrice.toLocaleString()} XAF
						</div>
						<div className="text-gray-600">Total Market Cap:</div>
						<div className="font-medium">
							{(formData.totalSupply * formData.initialPrice).toLocaleString()}{" "}
							XAF
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
