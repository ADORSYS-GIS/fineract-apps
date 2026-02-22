import { Card } from "@fineract-apps/ui";
import { CheckCircle } from "lucide-react";
import { FC } from "react";
import { ASSET_CATEGORY_LABELS } from "@/constants/categories";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
}

const FREQUENCY_LABELS: Record<number, string> = {
	1: "Monthly",
	3: "Quarterly",
	6: "Semi-Annual",
	12: "Annual",
};

export const ReviewStep: FC<Props> = ({ formData }) => {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-lg font-semibold text-gray-800 mb-1">
					Review & Create
				</h2>
				<p className="text-sm text-gray-500">
					Review all details before creating the asset. This will provision a
					currency, savings product, and treasury account in Fineract.
				</p>
			</div>

			{/* Company */}
			<Card className="p-4">
				<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
					Treasury Company
				</h3>
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div className="text-gray-600">Company:</div>
					<div className="font-medium">{formData.treasuryClientName}</div>
					<div className="text-gray-600">Client ID:</div>
					<div className="font-medium">{formData.treasuryClientId}</div>
				</div>
			</Card>

			{/* Asset Details */}
			<Card className="p-4">
				<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
					Asset Details
				</h3>
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div className="text-gray-600">Name:</div>
					<div className="font-medium">{formData.name}</div>
					<div className="text-gray-600">Symbol:</div>
					<div className="font-medium font-mono">{formData.symbol}</div>
					<div className="text-gray-600">Category:</div>
					<div className="font-medium">
						{ASSET_CATEGORY_LABELS[formData.category] ?? formData.category}
					</div>
					{formData.description && (
						<>
							<div className="text-gray-600">Description:</div>
							<div className="font-medium">{formData.description}</div>
						</>
					)}
				</div>
			</Card>

			{/* Bond Details */}
			{formData.category === "BONDS" && (
				<Card className="p-4">
					<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
						Bond Details
					</h3>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="text-gray-600">Issuer:</div>
						<div className="font-medium">{formData.issuer}</div>
						{formData.isinCode && (
							<>
								<div className="text-gray-600">ISIN Code:</div>
								<div className="font-medium font-mono">{formData.isinCode}</div>
							</>
						)}
						<div className="text-gray-600">Interest Rate:</div>
						<div className="font-medium">{formData.interestRate}%</div>
						<div className="text-gray-600">Maturity Date:</div>
						<div className="font-medium">{formData.maturityDate}</div>
						<div className="text-gray-600">Coupon Frequency:</div>
						<div className="font-medium">
							{FREQUENCY_LABELS[formData.couponFrequencyMonths] ??
								`${formData.couponFrequencyMonths} months`}
						</div>
						<div className="text-gray-600">First Coupon Date:</div>
						<div className="font-medium">{formData.nextCouponDate}</div>
					</div>
				</Card>
			)}

			{/* Pricing */}
			<Card className="p-4">
				<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
					Pricing & Fees
				</h3>
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div className="text-gray-600">Initial Price:</div>
					<div className="font-medium">
						{formData.initialPrice.toLocaleString()} XAF
					</div>
					<div className="text-gray-600">Trading Fee:</div>
					<div className="font-medium">{formData.tradingFeePercent}%</div>
					<div className="text-gray-600">Spread:</div>
					<div className="font-medium">{formData.spreadPercent}%</div>
					{formData.maxPositionPercent > 0 && (
						<>
							<div className="text-gray-600">Max Position:</div>
							<div className="font-medium">
								{formData.maxPositionPercent}% of supply
							</div>
						</>
					)}
					{formData.maxOrderSize > 0 && (
						<>
							<div className="text-gray-600">Max Order Size:</div>
							<div className="font-medium">
								{formData.maxOrderSize.toLocaleString()} units
							</div>
						</>
					)}
					{formData.dailyTradeLimitXaf > 0 && (
						<>
							<div className="text-gray-600">Daily Trade Limit:</div>
							<div className="font-medium">
								{formData.dailyTradeLimitXaf.toLocaleString()} XAF
							</div>
						</>
					)}
				</div>
			</Card>

			{/* Supply */}
			<Card className="p-4">
				<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
					Supply & Precision
				</h3>
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div className="text-gray-600">Total Supply:</div>
					<div className="font-medium">
						{formData.totalSupply.toLocaleString()} units
					</div>
					<div className="text-gray-600">Decimal Places:</div>
					<div className="font-medium">{formData.decimalPlaces}</div>
					<div className="text-gray-600">Total Market Cap:</div>
					<div className="font-medium">
						{(formData.totalSupply * formData.initialPrice).toLocaleString()}{" "}
						XAF
					</div>
				</div>
			</Card>

			{/* Subscription Period */}
			<Card className="p-4">
				<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
					Subscription Period
				</h3>
				<div className="grid grid-cols-2 gap-2 text-sm">
					<div className="text-gray-600">Subscription Start:</div>
					<div className="font-medium">{formData.subscriptionStartDate}</div>
					<div className="text-gray-600">Subscription End:</div>
					<div className="font-medium">{formData.subscriptionEndDate}</div>
					{formData.capitalOpenedPercent > 0 && (
						<>
							<div className="text-gray-600">Capital Opened:</div>
							<div className="font-medium">
								{formData.capitalOpenedPercent}%
							</div>
						</>
					)}
					{formData.lockupDays > 0 && (
						<>
							<div className="text-gray-600">Lock-up Period:</div>
							<div className="font-medium">{formData.lockupDays} days</div>
						</>
					)}
				</div>
			</Card>

			{/* Income Distribution (non-bond) */}
			{formData.category !== "BONDS" && formData.incomeType && (
				<Card className="p-4">
					<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
						Income Distribution
					</h3>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="text-gray-600">Income Type:</div>
						<div className="font-medium">{formData.incomeType}</div>
						{formData.incomeRate > 0 && (
							<>
								<div className="text-gray-600">Income Rate:</div>
								<div className="font-medium">{formData.incomeRate}%</div>
							</>
						)}
						{formData.distributionFrequencyMonths > 0 && (
							<>
								<div className="text-gray-600">Frequency:</div>
								<div className="font-medium">
									{FREQUENCY_LABELS[formData.distributionFrequencyMonths] ??
										`${formData.distributionFrequencyMonths} months`}
								</div>
							</>
						)}
						{formData.nextDistributionDate && (
							<>
								<div className="text-gray-600">First Distribution:</div>
								<div className="font-medium">
									{formData.nextDistributionDate}
								</div>
							</>
						)}
					</div>
				</Card>
			)}

			{/* Provisioning Note */}
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div className="flex items-start gap-2">
					<CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
					<div className="text-sm text-yellow-800">
						<p className="font-medium mb-1">What happens on create:</p>
						<ol className="list-decimal list-inside space-y-1 text-yellow-700">
							<li>
								Register <strong>{formData.symbol}</strong> as a custom currency
								in Fineract
							</li>
							<li>Create a savings product for this asset</li>
							<li>Create a treasury savings account for the company</li>
							<li>
								Deposit {formData.totalSupply.toLocaleString()} units into
								treasury
							</li>
							<li>Asset will be created in PENDING status</li>
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
};
