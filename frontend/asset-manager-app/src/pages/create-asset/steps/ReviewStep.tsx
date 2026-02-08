import { Card } from "@fineract-apps/ui";
import { CheckCircle } from "lucide-react";
import { FC } from "react";
import type { AssetFormData } from "../useCreateAsset";

interface Props {
	formData: AssetFormData;
}

const CATEGORY_LABELS: Record<string, string> = {
	REAL_ESTATE: "Real Estate",
	COMMODITIES: "Commodities",
	AGRICULTURE: "Agriculture",
	STOCKS: "Stocks",
	CRYPTO: "Crypto",
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
					<div className="text-gray-600">Cash Account ID:</div>
					<div className="font-medium">{formData.treasuryCashAccountId}</div>
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
					<div className="text-gray-600">Currency Code:</div>
					<div className="font-medium font-mono">{formData.currencyCode}</div>
					<div className="text-gray-600">Category:</div>
					<div className="font-medium">
						{CATEGORY_LABELS[formData.category] ?? formData.category}
					</div>
					{formData.description && (
						<>
							<div className="text-gray-600">Description:</div>
							<div className="font-medium">{formData.description}</div>
						</>
					)}
				</div>
			</Card>

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
					<div className="text-gray-600">Annual Yield:</div>
					<div className="font-medium">
						{formData.annualYield ? `${formData.annualYield}%` : "N/A"}
					</div>
					<div className="text-gray-600">Trading Fee:</div>
					<div className="font-medium">{formData.tradingFeePercent}%</div>
					<div className="text-gray-600">Spread:</div>
					<div className="font-medium">{formData.spreadPercent}%</div>
				</div>
			</Card>

			{/* Supply */}
			<Card className="p-4">
				<h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
					Supply
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
						{(formData.totalSupply * formData.initialPrice).toLocaleString()} XAF
					</div>
					{formData.expectedLaunchDate && (
						<>
							<div className="text-gray-600">Expected Launch:</div>
							<div className="font-medium">{formData.expectedLaunchDate}</div>
						</>
					)}
				</div>
			</Card>

			{/* Provisioning Note */}
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
				<div className="flex items-start gap-2">
					<CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
					<div className="text-sm text-yellow-800">
						<p className="font-medium mb-1">What happens on create:</p>
						<ol className="list-decimal list-inside space-y-1 text-yellow-700">
							<li>
								Register <strong>{formData.currencyCode}</strong> as a custom
								currency in Fineract
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
