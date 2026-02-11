import { FC } from "react";
import type { AssetFormData } from "../useCreateAsset";

const COUPON_FREQUENCIES = [
	{ value: 1, label: "Monthly" },
	{ value: 3, label: "Quarterly" },
	{ value: 6, label: "Semi-Annual" },
	{ value: 12, label: "Annual" },
];

interface Props {
	formData: AssetFormData;
	updateFormData: (updates: Partial<AssetFormData>) => void;
	validationErrors: string[];
}

export const BondDetailsStep: FC<Props> = ({
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
					Bond Details
				</h2>
				<p className="text-sm text-gray-500">
					Configure the bond-specific parameters: issuer, maturity, coupon rate,
					and payment schedule.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="md:col-span-2">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Issuer *
					</label>
					<input
						type="text"
						aria-label="Issuer"
						className={inputClass("issuer")}
						placeholder="e.g. Etat du Sénégal"
						value={formData.issuer}
						onChange={(e) => updateFormData({ issuer: e.target.value })}
						maxLength={255}
					/>
					{fieldError("issuer") && (
						<p className="text-xs text-red-600 mt-1">{fieldError("issuer")}</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						ISIN Code
					</label>
					<input
						type="text"
						aria-label="ISIN code"
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase"
						placeholder="e.g. SN0000038741"
						value={formData.isinCode}
						onChange={(e) =>
							updateFormData({
								isinCode: e.target.value.toUpperCase(),
							})
						}
						maxLength={12}
					/>
					<p className="text-xs text-gray-400 mt-1">
						International Securities Identification Number (ISO 6166)
					</p>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Interest Rate (%) *
					</label>
					<input
						type="number"
						aria-label="Interest rate"
						className={inputClass("interest rate")}
						placeholder="e.g. 5.80"
						step="0.01"
						min="0"
						value={formData.interestRate || ""}
						onChange={(e) =>
							updateFormData({
								interestRate: Number.parseFloat(e.target.value),
							})
						}
					/>
					{fieldError("interest rate") && (
						<p className="text-xs text-red-600 mt-1">
							{fieldError("interest rate")}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Maturity Date *
					</label>
					<input
						type="date"
						aria-label="Maturity date"
						className={inputClass("maturity")}
						value={formData.maturityDate}
						onChange={(e) => updateFormData({ maturityDate: e.target.value })}
					/>
					{fieldError("maturity") && (
						<p className="text-xs text-red-600 mt-1">
							{fieldError("maturity")}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Coupon Frequency *
					</label>
					<select
						aria-label="Coupon frequency"
						className={inputClass("coupon frequency")}
						value={formData.couponFrequencyMonths}
						onChange={(e) =>
							updateFormData({
								couponFrequencyMonths: Number.parseInt(e.target.value),
							})
						}
					>
						{COUPON_FREQUENCIES.map((f) => (
							<option key={f.value} value={f.value}>
								{f.label}
							</option>
						))}
					</select>
					{fieldError("coupon frequency") && (
						<p className="text-xs text-red-600 mt-1">
							{fieldError("coupon frequency")}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						First Coupon Date *
					</label>
					<input
						type="date"
						aria-label="First coupon date"
						className={inputClass("coupon date")}
						value={formData.nextCouponDate}
						onChange={(e) => updateFormData({ nextCouponDate: e.target.value })}
					/>
					{fieldError("coupon date") && (
						<p className="text-xs text-red-600 mt-1">
							{fieldError("coupon date")}
						</p>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Validity Date
					</label>
					<input
						type="date"
						aria-label="Validity date"
						className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						value={formData.validityDate}
						onChange={(e) => updateFormData({ validityDate: e.target.value })}
					/>
					<p className="text-xs text-gray-400 mt-1">
						Offer deadline. New BUY orders will be blocked after this date.
					</p>
				</div>
			</div>
		</div>
	);
};
