import { Button } from "@fineract-apps/ui";
import { Field, Form, Formik } from "formik";
import { type FC, useEffect, useRef, useState } from "react";
import { BOND_TYPE_OPTIONS } from "@/constants/bondTypes";
import { ASSET_CATEGORIES } from "@/constants/categories";
import { FREQUENCY_OPTIONS } from "@/constants/frequencies";
import { INCOME_TYPES } from "@/constants/incomeTypes";
import {
	type AssetDetailResponse,
	assetApi,
	extractErrorMessage,
	type UpdateAssetRequest,
} from "@/services/assetApi";

interface EditFormValues {
	name: string;
	description: string;
	imageUrl: string;
	category: string;
	tradingFeePercent: string;
	maxPositionPercent: string;
	maxOrderSize: string;
	minOrderSize: string;
	minOrderCashAmount: string;
	dailyTradeLimitXaf: string;
	lockupDays: string;
	incomeType: string;
	incomeRate: string;
	distributionFrequencyMonths: string;
	nextDistributionDate: string;
	// Tax configuration
	registrationDutyEnabled: boolean;
	registrationDutyRate: string;
	ircmEnabled: boolean;
	ircmRateOverride: string;
	ircmExempt: boolean;
	capitalGainsTaxEnabled: boolean;
	capitalGainsRate: string;
	isBvmacListed: boolean;
	isGovernmentBond: boolean;
	tvaEnabled: boolean;
	tvaRate: string;
	// Bond-specific updatable fields
	interestRate: string;
	maturityDate: string;
	nextCouponDate: string;
	// PENDING-only fields
	issuerPrice: string;
	faceValue: string;
	totalSupply: string;
	issuerName: string;
	isinCode: string;
	couponFrequencyMonths: string;
	bondType: string;
	dayCountConvention: string;
	issuerCountry: string;
}

function buildInitialValues(asset: AssetDetailResponse): EditFormValues {
	return {
		name: asset.name,
		description: asset.description ?? "",
		imageUrl: asset.imageUrl ?? "",
		category: asset.category,
		tradingFeePercent:
			asset.tradingFeePercent != null
				? (asset.tradingFeePercent * 100).toString()
				: "",
		maxPositionPercent: asset.maxPositionPercent?.toString() ?? "",
		maxOrderSize: asset.maxOrderSize?.toString() ?? "",
		minOrderSize: asset.minOrderSize?.toString() ?? "",
		minOrderCashAmount: asset.minOrderCashAmount?.toString() ?? "",
		dailyTradeLimitXaf: asset.dailyTradeLimitXaf?.toString() ?? "",
		lockupDays: asset.lockupDays?.toString() ?? "",
		incomeType: asset.incomeType ?? "",
		incomeRate: asset.incomeRate?.toString() ?? "",
		distributionFrequencyMonths:
			asset.distributionFrequencyMonths?.toString() ?? "",
		nextDistributionDate: asset.nextDistributionDate ?? "",
		registrationDutyEnabled: asset.registrationDutyEnabled !== false,
		registrationDutyRate:
			asset.registrationDutyRate != null
				? (asset.registrationDutyRate * 100).toString()
				: "",
		ircmEnabled: asset.ircmEnabled !== false,
		ircmRateOverride:
			asset.ircmRateOverride != null
				? (asset.ircmRateOverride * 100).toString()
				: "",
		ircmExempt: asset.ircmExempt ?? false,
		capitalGainsTaxEnabled: asset.capitalGainsTaxEnabled !== false,
		capitalGainsRate:
			asset.capitalGainsRate != null
				? (asset.capitalGainsRate * 100).toString()
				: "",
		isBvmacListed: asset.isBvmacListed ?? false,
		isGovernmentBond: asset.isGovernmentBond ?? false,
		tvaEnabled: asset.tvaEnabled ?? false,
		tvaRate: asset.tvaRate != null ? (asset.tvaRate * 100).toString() : "",
		interestRate: asset.interestRate?.toString() ?? "",
		maturityDate: asset.maturityDate ?? "",
		nextCouponDate: asset.nextCouponDate ?? "",
		// PENDING-only fields
		issuerPrice: asset.issuerPrice?.toString() ?? "",
		faceValue: asset.faceValue?.toString() ?? "",
		totalSupply: asset.totalSupply?.toString() ?? "",
		issuerName: asset.issuerName ?? "",
		isinCode: asset.isinCode ?? "",
		couponFrequencyMonths: asset.couponFrequencyMonths?.toString() ?? "",
		bondType: asset.bondType ?? "",
		dayCountConvention: asset.dayCountConvention ?? "",
		issuerCountry: asset.issuerCountry ?? "",
	};
}

/** Maps form field names to their transform for the API request. */
const num = (v: string) => (v !== "" ? Number(v) : undefined);
const pct = (v: string) => (v ? Number(v) / 100 : undefined);
const str = (v: string) => v || undefined;

type FieldTransform = (v: string) => unknown;

const STRING_FIELDS: (keyof EditFormValues)[] = [
	"name",
	"description",
	"imageUrl",
	"category",
];

const NUM_FIELDS: (keyof EditFormValues)[] = [
	"maxPositionPercent",
	"maxOrderSize",
	"minOrderSize",
	"minOrderCashAmount",
	"dailyTradeLimitXaf",
	"lockupDays",
	"incomeRate",
	"distributionFrequencyMonths",
	"interestRate",
	"issuerPrice",
	"faceValue",
	"totalSupply",
	"couponFrequencyMonths",
];

const PCT_FIELDS: (keyof EditFormValues)[] = [
	"tradingFeePercent",
	"registrationDutyRate",
	"ircmRateOverride",
	"capitalGainsRate",
	"tvaRate",
];

const STR_FIELDS: (keyof EditFormValues)[] = [
	"incomeType",
	"nextDistributionDate",
	"maturityDate",
	"nextCouponDate",
	"issuerName",
	"isinCode",
	"bondType",
	"dayCountConvention",
	"issuerCountry",
];

const BOOL_FIELDS: (keyof EditFormValues)[] = [
	"registrationDutyEnabled",
	"ircmEnabled",
	"ircmExempt",
	"capitalGainsTaxEnabled",
	"isBvmacListed",
	"isGovernmentBond",
	"tvaEnabled",
];

function buildUpdateRequest(
	values: EditFormValues,
	initial: EditFormValues,
): UpdateAssetRequest | null {
	const data: Record<string, unknown> = {};

	const diffAndSet = (key: keyof EditFormValues, transform: FieldTransform) => {
		if (values[key] !== initial[key])
			data[key] = transform(values[key] as string);
	};

	for (const k of STRING_FIELDS) diffAndSet(k, (v) => v);
	for (const k of NUM_FIELDS) diffAndSet(k, num);
	for (const k of PCT_FIELDS) diffAndSet(k, pct);
	for (const k of STR_FIELDS) diffAndSet(k, str);
	for (const k of BOOL_FIELDS) {
		if (values[k] !== initial[k]) data[k] = values[k];
	}

	return Object.keys(data).length > 0 ? (data as UpdateAssetRequest) : null;
}

const INPUT_CLASS =
	"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
const LABEL_CLASS =
	"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

interface EditAssetDialogProps {
	isOpen: boolean;
	asset: AssetDetailResponse;
	onSubmit: (data: UpdateAssetRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

// --- Section components ---

const BasicInfoSection: FC<{
	previewUrl: string | null;
	uploading: boolean;
	uploadError: string | null;
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onFileSelect: (file: File) => void;
	onRemoveImage: () => void;
}> = ({
	previewUrl,
	uploading,
	uploadError,
	fileInputRef,
	onFileSelect,
	onRemoveImage,
}) => (
	<>
		<div>
			<label className={LABEL_CLASS}>Name</label>
			<Field name="name" className={INPUT_CLASS} maxLength={200} />
		</div>
		<div>
			<label className={LABEL_CLASS}>Category</label>
			<Field as="select" name="category" className={INPUT_CLASS}>
				{ASSET_CATEGORIES.map((c) => (
					<option key={c.value} value={c.value}>
						{c.label}
					</option>
				))}
			</Field>
		</div>
		<div>
			<label className={LABEL_CLASS}>Description</label>
			<Field
				as="textarea"
				name="description"
				className={INPUT_CLASS}
				rows={3}
				maxLength={1000}
			/>
		</div>
		<div>
			<label className={LABEL_CLASS}>Asset Image</label>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/svg+xml"
				className="hidden"
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					const file = e.target.files?.[0];
					if (file) onFileSelect(file);
				}}
			/>
			{previewUrl ? (
				<div className="flex items-center gap-4">
					<img
						src={previewUrl}
						alt="Asset preview"
						className="h-16 w-16 rounded-lg object-cover border border-gray-200"
					/>
					<div className="flex gap-2">
						<button
							type="button"
							className="text-sm text-blue-600 hover:text-blue-800"
							onClick={() => fileInputRef.current?.click()}
							disabled={uploading}
						>
							Change
						</button>
						<button
							type="button"
							className="text-sm text-red-600 hover:text-red-800"
							onClick={onRemoveImage}
							disabled={uploading}
						>
							Remove
						</button>
					</div>
					{uploading && (
						<span className="text-xs text-gray-500">Uploading...</span>
					)}
				</div>
			) : (
				<button
					type="button"
					className="w-full border-2 border-dashed border-gray-300 rounded-lg px-4 py-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors dark:hover:bg-gray-700"
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading}
				>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{uploading ? "Uploading..." : "Click to upload an image"}
					</p>
					<p className="text-xs text-gray-400 mt-1">
						JPEG, PNG, WebP, or SVG (max 5MB)
					</p>
				</button>
			)}
			{uploadError && (
				<p className="text-xs text-red-600 mt-1">{uploadError}</p>
			)}
		</div>
	</>
);

const CoreFieldsSection: FC<{
	isPending: boolean;
	asset: AssetDetailResponse;
}> = ({ isPending, asset }) => {
	if (isPending) {
		return (
			<>
				{/* Read-only identity fields */}
				<div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
					<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
						Asset Identity (read-only — delete and recreate to change)
					</p>
					<div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
						<div>
							<span className="text-gray-500 dark:text-gray-400">Symbol</span>
							<span className="block font-mono font-medium text-gray-800 dark:text-gray-200">
								{asset.symbol}
							</span>
						</div>
						<div>
							<span className="text-gray-500 dark:text-gray-400">Currency</span>
							<span className="block font-mono font-medium text-gray-800 dark:text-gray-200">
								{asset.currencyCode}
							</span>
						</div>
						<div>
							<span className="text-gray-500 dark:text-gray-400">Decimals</span>
							<span className="block font-medium text-gray-800 dark:text-gray-200">
								{asset.decimalPlaces}
							</span>
						</div>
					</div>
				</div>
				{/* Editable core fields */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className={LABEL_CLASS}>Issuer Price (XAF)</label>
						<Field
							name="issuerPrice"
							type="number"
							className={INPUT_CLASS}
							min={0}
							placeholder="e.g. 5000"
						/>
						<p className="text-xs text-gray-400 mt-1">
							LP acquisition cost per unit
						</p>
					</div>
					<div>
						<label className={LABEL_CLASS}>Face Value (XAF)</label>
						<Field
							name="faceValue"
							type="number"
							className={INPUT_CLASS}
							min={0}
							placeholder="e.g. 10000"
						/>
						<p className="text-xs text-gray-400 mt-1">
							Par/redemption value. Required for DISCOUNT bonds (must be &gt;
							issuer price).
						</p>
					</div>
					<div>
						<label className={LABEL_CLASS}>Total Supply</label>
						<Field
							name="totalSupply"
							type="number"
							className={INPUT_CLASS}
							min={0}
							placeholder="e.g. 100000"
						/>
						<p className="text-xs text-gray-400 mt-1">
							Maximum units that can exist
						</p>
					</div>
				</div>
				{asset.category === "BONDS" && (
					<>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className={LABEL_CLASS}>Bond Type</label>
								<Field as="select" name="bondType" className={INPUT_CLASS}>
									<option value="">Select...</option>
									{BOND_TYPE_OPTIONS.map((b) => (
										<option key={b.value} value={b.value}>
											{b.label}
										</option>
									))}
								</Field>
							</div>
							<div>
								<label className={LABEL_CLASS}>Day Count Convention</label>
								<Field
									as="select"
									name="dayCountConvention"
									className={INPUT_CLASS}
								>
									<option value="">Select...</option>
									<option value="ACT_360">ACT/360 (BTA standard)</option>
									<option value="ACT_365">ACT/365 (OTA standard)</option>
									<option value="THIRTY_360">30/360</option>
								</Field>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className={LABEL_CLASS}>Issuer Name</label>
								<Field
									name="issuerName"
									className={INPUT_CLASS}
									maxLength={255}
									placeholder="e.g. Etat du Sénégal"
								/>
							</div>
							<div>
								<label className={LABEL_CLASS}>Issuer Country</label>
								<Field
									name="issuerCountry"
									className={INPUT_CLASS}
									maxLength={255}
									placeholder="e.g. Cameroun"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className={LABEL_CLASS}>ISIN Code</label>
								<Field
									name="isinCode"
									className={INPUT_CLASS}
									maxLength={12}
									placeholder="e.g. SN0000038741"
								/>
							</div>
							<div>
								<label className={LABEL_CLASS}>Coupon Frequency</label>
								<Field
									as="select"
									name="couponFrequencyMonths"
									className={INPUT_CLASS}
								>
									<option value="">Select...</option>
									{FREQUENCY_OPTIONS.map((f) => (
										<option key={f.value} value={f.value}>
											{f.label}
										</option>
									))}
								</Field>
							</div>
						</div>
					</>
				)}
			</>
		);
	}

	return (
		<div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
			<p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
				Asset Identity (read-only)
			</p>
			<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
				<div className="text-gray-500 dark:text-gray-400">Symbol</div>
				<div className="font-mono font-medium text-gray-800 dark:text-gray-200">
					{asset.symbol}
				</div>
				<div className="text-gray-500 dark:text-gray-400">Issuer Price</div>
				<div className="font-medium text-gray-800 dark:text-gray-200">
					{asset.issuerPrice != null
						? `${asset.issuerPrice.toLocaleString()} XAF`
						: "—"}
				</div>
				<div className="text-gray-500 dark:text-gray-400">Total Supply</div>
				<div className="font-medium text-gray-800 dark:text-gray-200">
					{asset.totalSupply?.toLocaleString()} units
				</div>
				{asset.category === "BONDS" && asset.maturityDate && (
					<>
						<div className="text-gray-500 dark:text-gray-400">
							Maturity Date
						</div>
						<div className="font-medium text-gray-800 dark:text-gray-200">
							{asset.maturityDate}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

const PricingSection: FC = () => (
	<>
		<div>
			<label className={LABEL_CLASS}>Trading Fee %</label>
			<Field
				name="tradingFeePercent"
				type="number"
				className={INPUT_CLASS}
				min={0}
				step="0.0001"
				placeholder="e.g. 0.005"
			/>
			<p className="text-xs text-gray-400 mt-1">
				Fee charged on each buy/sell transaction
			</p>
		</div>
		<p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
			LP ask/bid prices are managed exclusively via the{" "}
			<strong>Pricing</strong> page to ensure spread consistency.
		</p>
	</>
);

const LimitsSection: FC = () => (
	<>
		<div className="grid grid-cols-2 gap-4">
			<div>
				<label className={LABEL_CLASS}>Max Position (%)</label>
				<Field
					name="maxPositionPercent"
					type="number"
					className={INPUT_CLASS}
					min={0}
					max={100}
					step="0.01"
					placeholder="e.g. 10"
				/>
			</div>
			<div>
				<label className={LABEL_CLASS}>Max Order Size</label>
				<Field
					name="maxOrderSize"
					type="number"
					className={INPUT_CLASS}
					min={0}
					placeholder="e.g. 1000"
				/>
			</div>
		</div>
		<div className="grid grid-cols-2 gap-4">
			<div>
				<label className={LABEL_CLASS}>Min Order Size (units)</label>
				<Field
					name="minOrderSize"
					type="number"
					className={INPUT_CLASS}
					min={0}
					placeholder="e.g. 1"
				/>
				<p className="text-xs text-gray-400 mt-1">
					Min units per order. 0 = no min
				</p>
			</div>
			<div>
				<label className={LABEL_CLASS}>Min Order Amount (XAF)</label>
				<Field
					name="minOrderCashAmount"
					type="number"
					className={INPUT_CLASS}
					min={0}
					placeholder="e.g. 10000"
				/>
				<p className="text-xs text-gray-400 mt-1">
					Min XAF per order. 0 = no min
				</p>
			</div>
		</div>
		<div className="grid grid-cols-2 gap-4">
			<div>
				<label className={LABEL_CLASS}>Daily Limit (XAF)</label>
				<Field
					name="dailyTradeLimitXaf"
					type="number"
					className={INPUT_CLASS}
					min={0}
					placeholder="e.g. 5000000"
				/>
			</div>
			<div>
				<label className={LABEL_CLASS}>Lock-up Days</label>
				<Field
					name="lockupDays"
					type="number"
					className={INPUT_CLASS}
					min={0}
					placeholder="e.g. 30"
				/>
			</div>
		</div>
	</>
);

const IncomeSection: FC<{ incomeType: string }> = ({ incomeType }) => {
	const showFields = incomeType !== "";
	return (
		<>
			<hr className="border-gray-200 dark:border-gray-600" />
			<p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
				Income Distribution
			</p>
			<div>
				<label className={LABEL_CLASS}>Income Type</label>
				<Field as="select" name="incomeType" className={INPUT_CLASS}>
					{INCOME_TYPES.map((t) => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</Field>
			</div>
			{showFields && (
				<>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className={LABEL_CLASS}>Income Rate (%)</label>
							<Field
								name="incomeRate"
								type="number"
								className={INPUT_CLASS}
								min={0}
								step="0.01"
								placeholder="e.g. 5.00"
							/>
						</div>
						<div>
							<label className={LABEL_CLASS}>Frequency</label>
							<Field
								as="select"
								name="distributionFrequencyMonths"
								className={INPUT_CLASS}
							>
								<option value="">Select...</option>
								{FREQUENCY_OPTIONS.map((f) => (
									<option key={f.value} value={f.value}>
										{f.label}
									</option>
								))}
							</Field>
						</div>
					</div>
					<div>
						<label className={LABEL_CLASS}>Next Distribution Date</label>
						<Field
							name="nextDistributionDate"
							type="date"
							className={INPUT_CLASS}
						/>
					</div>
				</>
			)}
		</>
	);
};

const TaxSection: FC<{
	registrationDutyEnabled: boolean;
	ircmEnabled: boolean;
	ircmExempt: boolean;
	capitalGainsTaxEnabled: boolean;
	isBvmacListed: boolean;
	isGovernmentBond: boolean;
	tvaEnabled: boolean;
	setFieldValue: (field: string, value: boolean | string) => void;
}> = ({
	registrationDutyEnabled,
	ircmEnabled,
	ircmExempt,
	capitalGainsTaxEnabled,
	isBvmacListed,
	isGovernmentBond,
	tvaEnabled,
	setFieldValue,
}) => (
	<>
		<hr className="border-gray-200 dark:border-gray-600" />
		<p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
			Tax Configuration
		</p>
		{/* Registration Duty */}
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
					Registration Duty
				</p>
				<p className="text-xs text-gray-400">Transfer tax on transactions</p>
			</div>
			<input
				type="checkbox"
				checked={registrationDutyEnabled}
				onChange={(e) =>
					setFieldValue("registrationDutyEnabled", e.target.checked)
				}
				className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
			/>
		</div>
		{registrationDutyEnabled && (
			<div>
				<label className={LABEL_CLASS}>Rate (%)</label>
				<Field
					name="registrationDutyRate"
					type="number"
					className={INPUT_CLASS}
					min={0}
					max={100}
					step="0.1"
					placeholder="Default: 2%"
				/>
			</div>
		)}
		{/* IRCM Withholding */}
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
					IRCM Withholding Tax
				</p>
				<p className="text-xs text-gray-400">
					Withholding on income distributions
				</p>
			</div>
			<input
				type="checkbox"
				checked={ircmEnabled}
				onChange={(e) => setFieldValue("ircmEnabled", e.target.checked)}
				className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
			/>
		</div>
		{ircmEnabled && (
			<>
				<div className="flex items-center gap-3">
					<input
						type="checkbox"
						checked={ircmExempt}
						onChange={(e) => setFieldValue("ircmExempt", e.target.checked)}
						className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
					/>
					<span className="text-sm text-gray-700 dark:text-gray-300">
						IRCM Exempt (e.g. government bonds)
					</span>
				</div>
				{!ircmExempt && (
					<div>
						<label className={LABEL_CLASS}>Rate Override (%)</label>
						<Field
							name="ircmRateOverride"
							type="number"
							className={INPUT_CLASS}
							min={0}
							max={100}
							step="0.1"
							placeholder="Leave empty for auto rate"
						/>
						<p className="text-xs text-gray-400 mt-1">
							Auto: dividends 16.5%, bonds {"\u2265"}5yr 5.5%, BVMAC-listed 11%
						</p>
					</div>
				)}
			</>
		)}
		{/* Capital Gains Tax */}
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
					Capital Gains Tax
				</p>
				<p className="text-xs text-gray-400">
					Tax on profitable sales (500,000 XAF exemption)
				</p>
			</div>
			<input
				type="checkbox"
				checked={capitalGainsTaxEnabled}
				onChange={(e) =>
					setFieldValue("capitalGainsTaxEnabled", e.target.checked)
				}
				className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
			/>
		</div>
		{capitalGainsTaxEnabled && (
			<div>
				<label className={LABEL_CLASS}>Rate Override (%)</label>
				<Field
					name="capitalGainsRate"
					type="number"
					className={INPUT_CLASS}
					min={0}
					max={100}
					step="0.1"
					placeholder="Default: 16.5%"
				/>
			</div>
		)}
		{/* BVMAC listing */}
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
					BVMAC Listed
				</p>
				<p className="text-xs text-gray-400">Triggers reduced 11% IRCM rate</p>
			</div>
			<input
				type="checkbox"
				checked={isBvmacListed}
				onChange={(e) => setFieldValue("isBvmacListed", e.target.checked)}
				className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
			/>
		</div>
		{/* Government bond */}
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
					Government Bond
				</p>
				<p className="text-xs text-gray-400">
					Government-issued bond (affects tax treatment)
				</p>
			</div>
			<input
				type="checkbox"
				checked={isGovernmentBond}
				onChange={(e) => setFieldValue("isGovernmentBond", e.target.checked)}
				className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
			/>
		</div>
		{/* TVA */}
		<div className="flex items-center justify-between">
			<div>
				<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
					TVA (VAT)
				</p>
				<p className="text-xs text-gray-400">VAT on trades</p>
			</div>
			<input
				type="checkbox"
				checked={tvaEnabled}
				onChange={(e) => setFieldValue("tvaEnabled", e.target.checked)}
				className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
			/>
		</div>
		{tvaEnabled && (
			<div>
				<label className={LABEL_CLASS}>Rate (%)</label>
				<Field
					name="tvaRate"
					type="number"
					className={INPUT_CLASS}
					min={0}
					max={100}
					step="0.01"
					placeholder="Default: 19.25%"
				/>
			</div>
		)}
	</>
);

export const EditAssetDialog: FC<EditAssetDialogProps> = ({
	isOpen,
	asset,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		asset.imageUrl || null,
	);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const initialValues = buildInitialValues(asset);

	useEffect(() => {
		if (isOpen) {
			setPreviewUrl(asset.imageUrl || null);
			setUploadError(null);
		}
	}, [isOpen, asset]);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) onCancel();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, isLoading, onCancel]);

	if (!isOpen) return null;

	const handleFileSelect = async (
		file: File,
		setFieldValue: (field: string, value: string) => void,
	) => {
		setUploadError(null);
		if (file.size > 5 * 1024 * 1024) {
			setUploadError("File size exceeds 5MB limit");
			return;
		}
		const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
		if (!allowed.includes(file.type)) {
			setUploadError("Only JPEG, PNG, WebP, and SVG files are allowed");
			return;
		}
		setPreviewUrl(URL.createObjectURL(file));
		setUploading(true);
		try {
			const { data } = await assetApi.uploadFile(file);
			setFieldValue("imageUrl", data.key);
			setPreviewUrl(data.url);
		} catch (err) {
			setUploadError(extractErrorMessage(err));
			setPreviewUrl(asset.imageUrl || null);
			setFieldValue("imageUrl", asset.imageUrl ?? "");
		} finally {
			setUploading(false);
		}
	};

	const handleRemoveImage = (
		setFieldValue: (field: string, value: string) => void,
	) => {
		setPreviewUrl(null);
		setUploadError(null);
		setFieldValue("imageUrl", "");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 dialog-backdrop"
			role="dialog"
			aria-modal="true"
			aria-labelledby="edit-dialog-title"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isLoading) onCancel();
			}}
		>
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto dialog-content">
				<h3
					id="edit-dialog-title"
					className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
				>
					Edit Asset
				</h3>

				<Formik
					initialValues={initialValues}
					enableReinitialize
					onSubmit={(values) => {
						const data = buildUpdateRequest(values, initialValues);
						if (!data) {
							onCancel();
							return;
						}
						onSubmit(data);
					}}
				>
					{(formik) => (
						<Form>
							{/* Core fields — editable when PENDING, read-only otherwise */}
							<div className="mb-4">
								<CoreFieldsSection
									isPending={asset.status === "PENDING"}
									asset={asset}
								/>
							</div>
							<div className="space-y-4">
								<BasicInfoSection
									previewUrl={previewUrl}
									uploading={uploading}
									uploadError={uploadError}
									fileInputRef={fileInputRef}
									onFileSelect={(file) =>
										handleFileSelect(file, formik.setFieldValue)
									}
									onRemoveImage={() => handleRemoveImage(formik.setFieldValue)}
								/>
								<PricingSection />
								<LimitsSection />
								{asset.category !== "BONDS" && (
									<IncomeSection incomeType={formik.values.incomeType} />
								)}
								{asset.category === "BONDS" && asset.status !== "PENDING" && (
									<>
										<hr className="border-gray-200 dark:border-gray-600" />
										<p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
											Bond Terms
										</p>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className={LABEL_CLASS}>Coupon Rate (%)</label>
												<Field
													name="interestRate"
													type="number"
													className={INPUT_CLASS}
													min={0}
													step="0.01"
													placeholder="e.g. 5.80"
												/>
											</div>
											<div>
												<label className={LABEL_CLASS}>Maturity Date</label>
												<Field
													name="maturityDate"
													type="date"
													className={INPUT_CLASS}
												/>
											</div>
										</div>
										<div>
											<label className={LABEL_CLASS}>Next Coupon Date</label>
											<Field
												name="nextCouponDate"
												type="date"
												className={INPUT_CLASS}
											/>
										</div>
									</>
								)}
								<TaxSection
									registrationDutyEnabled={
										formik.values.registrationDutyEnabled
									}
									ircmEnabled={formik.values.ircmEnabled}
									ircmExempt={formik.values.ircmExempt}
									capitalGainsTaxEnabled={formik.values.capitalGainsTaxEnabled}
									isBvmacListed={formik.values.isBvmacListed}
									isGovernmentBond={formik.values.isGovernmentBond}
									tvaEnabled={formik.values.tvaEnabled}
									setFieldValue={formik.setFieldValue}
								/>
							</div>

							<div className="flex justify-end gap-3 mt-6">
								<Button
									variant="outline"
									onClick={onCancel}
									disabled={isLoading}
									type="button"
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									{isLoading ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
};
