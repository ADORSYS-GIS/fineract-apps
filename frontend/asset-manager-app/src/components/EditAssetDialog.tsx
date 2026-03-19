import { Button } from "@fineract-apps/ui";
import { Field, Form, Formik } from "formik";
import { type FC, useEffect, useRef, useState } from "react";
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
	lpAskPrice: string;
	lpBidPrice: string;
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
	// PENDING-only fields
	issuerPrice: string;
	totalSupply: string;
	issuerName: string;
	isinCode: string;
	couponFrequencyMonths: string;
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
		lpAskPrice: asset.askPrice?.toString() ?? "",
		lpBidPrice: asset.bidPrice?.toString() ?? "",
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
		// PENDING-only fields
		issuerPrice: asset.issuerPrice?.toString() ?? "",
		totalSupply: asset.totalSupply?.toString() ?? "",
		issuerName: asset.issuerName ?? "",
		isinCode: asset.isinCode ?? "",
		couponFrequencyMonths: asset.couponFrequencyMonths?.toString() ?? "",
	};
}

function buildUpdateRequest(
	values: EditFormValues,
	initial: EditFormValues,
): UpdateAssetRequest | null {
	const data: UpdateAssetRequest = {};
	const num = (v: string) => (v ? Number(v) : undefined);

	if (values.name !== initial.name) data.name = values.name;
	if (values.description !== initial.description)
		data.description = values.description;
	if (values.imageUrl !== initial.imageUrl) data.imageUrl = values.imageUrl;
	if (values.category !== initial.category) data.category = values.category;
	if (values.tradingFeePercent !== initial.tradingFeePercent)
		data.tradingFeePercent = values.tradingFeePercent
			? Number(values.tradingFeePercent) / 100
			: undefined;
	if (values.lpBidPrice !== initial.lpBidPrice)
		data.lpBidPrice = num(values.lpBidPrice);
	if (values.lpAskPrice !== initial.lpAskPrice)
		data.lpAskPrice = num(values.lpAskPrice);
	if (values.maxPositionPercent !== initial.maxPositionPercent)
		data.maxPositionPercent = num(values.maxPositionPercent);
	if (values.maxOrderSize !== initial.maxOrderSize)
		data.maxOrderSize = num(values.maxOrderSize);
	if (values.minOrderSize !== initial.minOrderSize)
		data.minOrderSize = num(values.minOrderSize);
	if (values.minOrderCashAmount !== initial.minOrderCashAmount)
		data.minOrderCashAmount = num(values.minOrderCashAmount);
	if (values.dailyTradeLimitXaf !== initial.dailyTradeLimitXaf)
		data.dailyTradeLimitXaf = num(values.dailyTradeLimitXaf);
	if (values.lockupDays !== initial.lockupDays)
		data.lockupDays = num(values.lockupDays);
	if (values.incomeType !== initial.incomeType)
		data.incomeType = values.incomeType || undefined;
	if (values.incomeRate !== initial.incomeRate)
		data.incomeRate = num(values.incomeRate);
	if (
		values.distributionFrequencyMonths !== initial.distributionFrequencyMonths
	)
		data.distributionFrequencyMonths = num(values.distributionFrequencyMonths);
	if (values.nextDistributionDate !== initial.nextDistributionDate)
		data.nextDistributionDate = values.nextDistributionDate || undefined;
	// Tax configuration
	if (values.registrationDutyEnabled !== initial.registrationDutyEnabled)
		data.registrationDutyEnabled = values.registrationDutyEnabled;
	if (values.registrationDutyRate !== initial.registrationDutyRate)
		data.registrationDutyRate = values.registrationDutyRate
			? Number(values.registrationDutyRate) / 100
			: undefined;
	if (values.ircmEnabled !== initial.ircmEnabled)
		data.ircmEnabled = values.ircmEnabled;
	if (values.ircmRateOverride !== initial.ircmRateOverride)
		data.ircmRateOverride = values.ircmRateOverride
			? Number(values.ircmRateOverride) / 100
			: undefined;
	if (values.ircmExempt !== initial.ircmExempt)
		data.ircmExempt = values.ircmExempt;
	if (values.capitalGainsTaxEnabled !== initial.capitalGainsTaxEnabled)
		data.capitalGainsTaxEnabled = values.capitalGainsTaxEnabled;
	if (values.capitalGainsRate !== initial.capitalGainsRate)
		data.capitalGainsRate = values.capitalGainsRate
			? Number(values.capitalGainsRate) / 100
			: undefined;

	// PENDING-only fields
	if (values.issuerPrice !== initial.issuerPrice)
		data.issuerPrice = num(values.issuerPrice);
	if (values.totalSupply !== initial.totalSupply)
		data.totalSupply = num(values.totalSupply);
	if (values.issuerName !== initial.issuerName)
		data.issuerName = values.issuerName || undefined;
	if (values.isinCode !== initial.isinCode)
		data.isinCode = values.isinCode || undefined;
	if (values.couponFrequencyMonths !== initial.couponFrequencyMonths)
		data.couponFrequencyMonths = num(values.couponFrequencyMonths);

	return Object.keys(data).length > 0 ? data : null;
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
							Face value for coupon/income calculations
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
						<div>
							<label className={LABEL_CLASS}>Issuer Name</label>
							<Field
								name="issuerName"
								className={INPUT_CLASS}
								maxLength={255}
								placeholder="e.g. Etat du Sénégal"
							/>
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
		</div>
		<div className="grid grid-cols-2 gap-4">
			<div>
				<label className={LABEL_CLASS}>LP Ask Price (XAF)</label>
				<Field
					name="lpAskPrice"
					type="number"
					className={INPUT_CLASS}
					min={0}
					placeholder="e.g. 5100"
				/>
				<p className="text-xs text-gray-400 mt-1">What investors pay to buy</p>
			</div>
			<div>
				<label className={LABEL_CLASS}>LP Bid Price (XAF)</label>
				<Field
					name="lpBidPrice"
					type="number"
					className={INPUT_CLASS}
					min={0}
					placeholder="e.g. 4900"
				/>
				<p className="text-xs text-gray-400 mt-1">
					What investors receive when selling
				</p>
			</div>
		</div>
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
	setFieldValue: (field: string, value: boolean | string) => void;
}> = ({
	registrationDutyEnabled,
	ircmEnabled,
	ircmExempt,
	capitalGainsTaxEnabled,
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
								<TaxSection
									registrationDutyEnabled={
										formik.values.registrationDutyEnabled
									}
									ircmEnabled={formik.values.ircmEnabled}
									ircmExempt={formik.values.ircmExempt}
									capitalGainsTaxEnabled={formik.values.capitalGainsTaxEnabled}
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
