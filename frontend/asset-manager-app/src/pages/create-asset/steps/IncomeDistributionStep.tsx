import { FC } from "react";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
	validationErrors: string[];
}

export const IncomeDistributionStep: FC<Props> = ({
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
					Income Distribution
				</h2>
				<p className="text-sm text-gray-500">
					Configure periodic income payments to asset holders. Leave as
					&quot;None&quot; for non-income assets.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Income Type
					</label>
					<select
						aria-label="Income type"
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={formData.incomeType}
						onChange={(e) => updateFormData({ incomeType: e.target.value })}
					>
						<option value="">None</option>
						<option value="DIVIDEND">Dividend</option>
						<option value="RENT">Rental Income</option>
						<option value="HARVEST_YIELD">Harvest Yield</option>
						<option value="PROFIT_SHARE">Profit Share</option>
					</select>
					<p className="text-xs text-gray-400 mt-1">
						Type of periodic income paid to holders
					</p>
					{formData.incomeType && (
						<div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded p-2">
							{formData.incomeType === "DIVIDEND" && (
								<>
									<span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium mr-1">
										Variable
									</span>
									Cash distribution from company profits. Typically annual or
									semi-annual.
								</>
							)}
							{formData.incomeType === "RENT" && (
								<>
									<span className="inline-block px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-medium mr-1">
										Typically Fixed
									</span>
									Rental income from property holdings. Typically monthly.
								</>
							)}
							{formData.incomeType === "HARVEST_YIELD" && (
								<>
									<span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium mr-1">
										Variable
									</span>
									Proceeds from agricultural harvest. Typically semi-annual
									after harvest season.
								</>
							)}
							{formData.incomeType === "PROFIT_SHARE" && (
								<>
									<span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium mr-1">
										Variable
									</span>
									Share of business profits. Typically annual.
								</>
							)}
							<p className="mt-1 text-gray-500">
								Income = units × issuerPrice × (rate/100) × (months/12).
							</p>
						</div>
					)}
				</div>

				{formData.incomeType && (
					<>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Income Rate (%)
							</label>
							<input
								type="number"
								aria-label="Income rate"
								className={inputClass("income rate")}
								placeholder="e.g. 5.0"
								value={formData.incomeRate || ""}
								onChange={(e) =>
									updateFormData({
										incomeRate: Number(e.target.value),
									})
								}
								min={0}
								max={100}
								step={0.01}
							/>
							<p className="text-xs text-gray-400 mt-1">
								Annual income rate as a percentage. Applied to current market
								price at distribution time
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Distribution Frequency
							</label>
							<select
								aria-label="Distribution frequency"
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={formData.distributionFrequencyMonths || ""}
								onChange={(e) =>
									updateFormData({
										distributionFrequencyMonths: Number(e.target.value),
									})
								}
							>
								<option value="">Select</option>
								<option value={1}>Monthly</option>
								<option value={3}>Quarterly</option>
								<option value={6}>Semi-Annual</option>
								<option value={12}>Annual</option>
							</select>
							<p className="text-xs text-gray-400 mt-1">
								How often income is distributed. The scheduler runs daily and
								pays when the distribution date arrives
							</p>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								First Distribution Date
							</label>
							<input
								type="date"
								aria-label="First distribution date"
								className={inputClass("distribution date")}
								value={formData.nextDistributionDate}
								onChange={(e) =>
									updateFormData({
										nextDistributionDate: e.target.value,
									})
								}
							/>
							<p className="text-xs text-gray-400 mt-1">
								Date of the first income payment. Automatically advances by the
								frequency after each payment
							</p>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
