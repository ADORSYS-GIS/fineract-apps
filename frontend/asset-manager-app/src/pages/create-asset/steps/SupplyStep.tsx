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
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Supply & Subscription
				</h2>
				<p className="text-sm text-gray-500">
					Define the total supply, precision, and subscription period for this
					asset.
				</p>
			</div>

			{/* Supply & Precision */}
			<div>
				<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
					Supply & Precision
				</h3>
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
							<p className="text-xs text-red-600 mt-1">
								{fieldError("supply")}
							</p>
						) : (
							<p className="text-xs text-gray-400 mt-1">
								Total units created and deposited into the treasury. This is the
								maximum that can be sold to investors (you can mint more later)
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
							Controls fractional ownership. 0 = whole units only, 2 = 0.01 unit
							precision, 8 = very fine-grained. Most assets use 0
						</p>
					</div>
				</div>
			</div>

			{/* Subscription Period */}
			<div>
				<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
					Subscription Period
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Subscription Start Date *
						</label>
						<input
							type="date"
							aria-label="Subscription start date"
							className={inputClass("subscription start")}
							value={formData.subscriptionStartDate}
							onChange={(e) =>
								updateFormData({ subscriptionStartDate: e.target.value })
							}
						/>
						{fieldError("subscription start") ? (
							<p className="text-xs text-red-600 mt-1">
								{fieldError("subscription start")}
							</p>
						) : (
							<p className="text-xs text-gray-400 mt-1">
								Users cannot buy until this date. Use this to schedule a future
								launch
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Subscription End Date *
						</label>
						<input
							type="date"
							aria-label="Subscription end date"
							className={inputClass("subscription end")}
							value={formData.subscriptionEndDate}
							onChange={(e) =>
								updateFormData({ subscriptionEndDate: e.target.value })
							}
						/>
						{fieldError("subscription end") ? (
							<p className="text-xs text-red-600 mt-1">
								{fieldError("subscription end")}
							</p>
						) : (
							<p className="text-xs text-gray-400 mt-1">
								Users cannot buy after this date. SELL orders remain allowed
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Capital Opened (%)
						</label>
						<input
							type="number"
							aria-label="Capital opened percent"
							className={inputClass("capital")}
							placeholder="e.g. 44.44"
							step="0.01"
							min="0"
							max="100"
							value={formData.capitalOpenedPercent || ""}
							onChange={(e) =>
								updateFormData({
									capitalOpenedPercent: Number.parseFloat(e.target.value),
								})
							}
						/>
						{fieldError("capital") ? (
							<p className="text-xs text-red-600 mt-1">
								{fieldError("capital")}
							</p>
						) : (
							<p className="text-xs text-gray-400 mt-1">
								Percentage of total market cap (supply × price) available for
								public purchase. 100% = full capital open
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Lock-up Period */}
			<div>
				<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
					Lock-up Period (Optional)
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Lock-up Days
						</label>
						<input
							type="number"
							aria-label="Lock-up days"
							className={inputClass("lockup")}
							placeholder="e.g. 30"
							value={formData.lockupDays || ""}
							onChange={(e) =>
								updateFormData({ lockupDays: Number(e.target.value) })
							}
							min={0}
						/>
						{fieldError("lockup") ? (
							<p className="text-xs text-red-600 mt-1">
								{fieldError("lockup")}
							</p>
						) : (
							<p className="text-xs text-gray-400 mt-1">
								Minimum holding period. After buying, a user must wait this many
								days before selling. Prevents pump-and-dump. 0 = no lock-up
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Income Distribution (non-bond only) */}
			{formData.category !== "BONDS" && (
				<div>
					<h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
						Income Distribution (Optional)
					</h3>
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
								Type of periodic income paid to holders. Leave as
								&quot;None&quot; for non-income assets
							</p>
							{formData.incomeType && (
								<div className="mt-2 text-xs bg-blue-50 border border-blue-200 rounded p-2">
									{formData.incomeType === "DIVIDEND" && (
										<>
											<span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium mr-1">
												Variable
											</span>
											Cash distribution from company profits. Typically annual
											or semi-annual.
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
										Income = units × currentPrice × (rate/100) × (months/12).
										Payout varies with market price.
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
										Annual income rate as a percentage. Applied to current
										market price at distribution time
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
										How often income is distributed. The scheduler runs daily
										and pays when the distribution date arrives
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
										Date of the first income payment. Automatically advances by
										the frequency after each payment
									</p>
								</div>
							</>
						)}
					</div>
				</div>
			)}

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
