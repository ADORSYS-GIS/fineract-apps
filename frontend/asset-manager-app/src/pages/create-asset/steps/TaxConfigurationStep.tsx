import { FC } from "react";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
}

export const TaxConfigurationStep: FC<Props> = ({
	formData,
	updateFormData,
}) => {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Tax Configuration
				</h2>
				<p className="text-sm text-gray-500">
					Configure Cameroon/CEMAC tax rules for this asset. Default rates apply
					when no override is set.
				</p>
			</div>

			{/* Bond Classification */}
			{formData.category === "BONDS" && (
				<div className="border border-gray-200 rounded-lg p-4 space-y-3">
					<div>
						<h3 className="text-sm font-semibold text-gray-700">
							Bond Classification
						</h3>
						<p className="text-xs text-gray-400 mt-0.5">
							These flags determine the automatic IRCM withholding rate applied
							to coupon/income payments.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="bvmac-listed"
							className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							checked={formData.isBvmacListed}
							onChange={(e) =>
								updateFormData({ isBvmacListed: e.target.checked })
							}
						/>
						<label htmlFor="bvmac-listed" className="text-sm text-gray-700">
							Listed on BVMAC{" "}
							<span className="text-gray-400">(→ IRCM rate: 11%)</span>
						</label>
					</div>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							id="gov-bond"
							className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
							checked={formData.isGovernmentBond}
							onChange={(e) =>
								updateFormData({ isGovernmentBond: e.target.checked })
							}
						/>
						<label htmlFor="gov-bond" className="text-sm text-gray-700">
							Government bond{" "}
							<span className="text-gray-400">(→ IRCM exempt by default)</span>
						</label>
					</div>
				</div>
			)}

			{/* Registration Duty */}
			<div className="border border-gray-200 rounded-lg p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold text-gray-700">
							Registration Duty
						</h3>
						<p className="text-xs text-gray-400">
							Transfer tax on buy/sell transactions (droit d'enregistrement)
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={formData.registrationDutyEnabled}
							onChange={(e) =>
								updateFormData({
									registrationDutyEnabled: e.target.checked,
								})
							}
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
					</label>
				</div>
				{formData.registrationDutyEnabled && (
					<div className="pt-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Rate (%)
						</label>
						<input
							type="number"
							aria-label="Registration duty rate"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Default: 2%"
							value={formData.registrationDutyRate || ""}
							onChange={(e) =>
								updateFormData({
									registrationDutyRate: Number(e.target.value),
								})
							}
							min={0}
							max={100}
							step={0.1}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Leave at 0 to use the system default (2%). Applied to gross
							transaction value on every trade.
						</p>
					</div>
				)}
			</div>

			{/* IRCM (Withholding Tax on Income) */}
			<div className="border border-gray-200 rounded-lg p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold text-gray-700">
							IRCM Withholding Tax
						</h3>
						<p className="text-xs text-gray-400">
							Withholding tax on income distributions (coupons, dividends, rent)
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={formData.ircmEnabled}
							onChange={(e) =>
								updateFormData({ ircmEnabled: e.target.checked })
							}
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
					</label>
				</div>
				{formData.ircmEnabled && (
					<div className="space-y-3 pt-2">
						<div className="flex items-center gap-3">
							<input
								type="checkbox"
								id="ircm-exempt"
								className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								checked={formData.ircmExempt}
								onChange={(e) =>
									updateFormData({ ircmExempt: e.target.checked })
								}
							/>
							<label htmlFor="ircm-exempt" className="text-sm text-gray-700">
								IRCM Exempt (e.g. government bonds)
							</label>
						</div>
						{!formData.ircmExempt && (
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Rate Override (%)
								</label>
								<input
									type="number"
									aria-label="IRCM rate override"
									className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Leave empty for auto rate"
									value={formData.ircmRateOverride || ""}
									onChange={(e) =>
										updateFormData({
											ircmRateOverride: Number(e.target.value),
										})
									}
									min={0}
									max={100}
									step={0.1}
								/>
								<p className="text-xs text-gray-400 mt-1">
									Leave at 0 for automatic rate: dividends 16.5%, bonds
									{" \u2265"}5yr 5.5%.
								</p>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Capital Gains Tax */}
			<div className="border border-gray-200 rounded-lg p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold text-gray-700">
							Capital Gains Tax
						</h3>
						<p className="text-xs text-gray-400">
							Tax on profitable sales. 500,000 XAF annual exemption applies
							automatically.
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={formData.capitalGainsTaxEnabled}
							onChange={(e) =>
								updateFormData({
									capitalGainsTaxEnabled: e.target.checked,
								})
							}
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
					</label>
				</div>
				{formData.capitalGainsTaxEnabled && (
					<div className="pt-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Rate Override (%)
						</label>
						<input
							type="number"
							aria-label="Capital gains rate"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Default: 16.5%"
							value={formData.capitalGainsRate || ""}
							onChange={(e) =>
								updateFormData({
									capitalGainsRate: Number(e.target.value),
								})
							}
							min={0}
							max={100}
							step={0.1}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Leave at 0 to use the system default (16.5%). Only applied when
							cumulative annual gains exceed 500,000 XAF.
						</p>
					</div>
				)}
			</div>

			{/* TVA (Value Added Tax) */}
			<div className="border border-gray-200 rounded-lg p-4 space-y-3">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-sm font-semibold text-gray-700">
							TVA (Value Added Tax)
						</h3>
						<p className="text-xs text-gray-400">
							VAT applied to trading fees. Default rate: 19.25%.
						</p>
					</div>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="sr-only peer"
							checked={formData.tvaEnabled}
							onChange={(e) => updateFormData({ tvaEnabled: e.target.checked })}
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
					</label>
				</div>
				{formData.tvaEnabled && (
					<div className="pt-2">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Rate Override (%)
						</label>
						<input
							type="number"
							aria-label="TVA rate override"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							placeholder="Default: 19.25%"
							value={formData.tvaRate || ""}
							onChange={(e) =>
								updateFormData({ tvaRate: Number(e.target.value) })
							}
							min={0}
							max={100}
							step={0.1}
						/>
						<p className="text-xs text-gray-400 mt-1">
							Leave at 0 to use the system default (19.25%). Applied to the
							trading fee amount only.
						</p>
					</div>
				)}
			</div>

			{/* Info box */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
				<p className="font-medium mb-1">Tax defaults (Cameroon/CEMAC)</p>
				<ul className="list-disc list-inside space-y-0.5 text-blue-700 text-xs">
					<li>
						Registration duty: 2% on transaction value (disabled by default)
					</li>
					<li>IRCM dividends: 16.5% withholding</li>
					<li>IRCM bonds {"\u2265"}5 years: 5.5% withholding</li>
					<li>Capital gains: 16.5% (500,000 XAF annual exemption)</li>
					<li>TVA: 19.25% on trading fees (disabled by default)</li>
				</ul>
			</div>
		</div>
	);
};
