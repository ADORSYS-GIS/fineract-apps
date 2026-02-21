import { Button } from "@fineract-apps/ui";
import { type FC, useEffect, useRef, useState } from "react";
import { ASSET_CATEGORIES } from "@/constants/categories";
import type {
	AssetDetailResponse,
	UpdateAssetRequest,
} from "@/services/assetApi";

const INCOME_TYPES = [
	{ value: "", label: "None" },
	{ value: "DIVIDEND", label: "Dividend" },
	{ value: "RENT", label: "Rent" },
	{ value: "HARVEST_YIELD", label: "Harvest Yield" },
	{ value: "PROFIT_SHARE", label: "Profit Share" },
];

const FREQUENCY_OPTIONS = [
	{ value: "1", label: "Monthly" },
	{ value: "3", label: "Quarterly" },
	{ value: "6", label: "Semi-Annual" },
	{ value: "12", label: "Annual" },
];

interface EditAssetDialogProps {
	isOpen: boolean;
	asset: AssetDetailResponse;
	onSubmit: (data: UpdateAssetRequest) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const EditAssetDialog: FC<EditAssetDialogProps> = ({
	isOpen,
	asset,
	onSubmit,
	onCancel,
	isLoading,
}) => {
	const cancelRef = useRef<HTMLButtonElement>(null);
	const [name, setName] = useState(asset.name);
	const [description, setDescription] = useState(asset.description ?? "");
	const [imageUrl, setImageUrl] = useState(asset.imageUrl ?? "");
	const [category, setCategory] = useState(asset.category);
	const [tradingFeePercent, setTradingFeePercent] = useState(
		asset.tradingFeePercent?.toString() ?? "",
	);
	const [spreadPercent, setSpreadPercent] = useState(
		asset.spreadPercent?.toString() ?? "",
	);
	const [maxPositionPercent, setMaxPositionPercent] = useState(
		asset.maxPositionPercent?.toString() ?? "",
	);
	const [maxOrderSize, setMaxOrderSize] = useState(
		asset.maxOrderSize?.toString() ?? "",
	);
	const [dailyTradeLimitXaf, setDailyTradeLimitXaf] = useState(
		asset.dailyTradeLimitXaf?.toString() ?? "",
	);
	const [lockupDays, setLockupDays] = useState(
		asset.lockupDays?.toString() ?? "",
	);
	const [incomeType, setIncomeType] = useState(asset.incomeType ?? "");
	const [incomeRate, setIncomeRate] = useState(
		asset.incomeRate?.toString() ?? "",
	);
	const [distributionFrequencyMonths, setDistributionFrequencyMonths] =
		useState(asset.distributionFrequencyMonths?.toString() ?? "");
	const [nextDistributionDate, setNextDistributionDate] = useState(
		asset.nextDistributionDate ?? "",
	);

	useEffect(() => {
		if (isOpen) {
			setName(asset.name);
			setDescription(asset.description ?? "");
			setImageUrl(asset.imageUrl ?? "");
			setCategory(asset.category);
			setTradingFeePercent(asset.tradingFeePercent?.toString() ?? "");
			setSpreadPercent(asset.spreadPercent?.toString() ?? "");
			setMaxPositionPercent(asset.maxPositionPercent?.toString() ?? "");
			setMaxOrderSize(asset.maxOrderSize?.toString() ?? "");
			setDailyTradeLimitXaf(asset.dailyTradeLimitXaf?.toString() ?? "");
			setLockupDays(asset.lockupDays?.toString() ?? "");
			setIncomeType(asset.incomeType ?? "");
			setIncomeRate(asset.incomeRate?.toString() ?? "");
			setDistributionFrequencyMonths(
				asset.distributionFrequencyMonths?.toString() ?? "",
			);
			setNextDistributionDate(asset.nextDistributionDate ?? "");
			cancelRef.current?.focus();
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

	const handleSubmit = () => {
		const data: UpdateAssetRequest = {};
		if (name !== asset.name) data.name = name;
		if (description !== (asset.description ?? ""))
			data.description = description;
		if (imageUrl !== (asset.imageUrl ?? "")) data.imageUrl = imageUrl;
		if (category !== asset.category) data.category = category;
		if (tradingFeePercent !== (asset.tradingFeePercent?.toString() ?? ""))
			data.tradingFeePercent = tradingFeePercent
				? Number(tradingFeePercent)
				: undefined;
		if (spreadPercent !== (asset.spreadPercent?.toString() ?? ""))
			data.spreadPercent = spreadPercent ? Number(spreadPercent) : undefined;
		if (maxPositionPercent !== (asset.maxPositionPercent?.toString() ?? ""))
			data.maxPositionPercent = maxPositionPercent
				? Number(maxPositionPercent)
				: undefined;
		if (maxOrderSize !== (asset.maxOrderSize?.toString() ?? ""))
			data.maxOrderSize = maxOrderSize ? Number(maxOrderSize) : undefined;
		if (dailyTradeLimitXaf !== (asset.dailyTradeLimitXaf?.toString() ?? ""))
			data.dailyTradeLimitXaf = dailyTradeLimitXaf
				? Number(dailyTradeLimitXaf)
				: undefined;
		if (lockupDays !== (asset.lockupDays?.toString() ?? ""))
			data.lockupDays = lockupDays ? Number(lockupDays) : undefined;
		if (incomeType !== (asset.incomeType ?? ""))
			data.incomeType = incomeType || undefined;
		if (incomeRate !== (asset.incomeRate?.toString() ?? ""))
			data.incomeRate = incomeRate ? Number(incomeRate) : undefined;
		if (
			distributionFrequencyMonths !==
			(asset.distributionFrequencyMonths?.toString() ?? "")
		)
			data.distributionFrequencyMonths = distributionFrequencyMonths
				? Number(distributionFrequencyMonths)
				: undefined;
		if (nextDistributionDate !== (asset.nextDistributionDate ?? ""))
			data.nextDistributionDate = nextDistributionDate || undefined;

		if (Object.keys(data).length === 0) {
			onCancel();
			return;
		}
		onSubmit(data);
	};

	const inputClass =
		"w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";
	const labelClass =
		"block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
	const showIncomeFields = asset.category !== "BONDS" && incomeType !== "";

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
			role="dialog"
			aria-modal="true"
			aria-labelledby="edit-dialog-title"
			onClick={(e) => {
				if (e.target === e.currentTarget && !isLoading) onCancel();
			}}
		>
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
				<h3
					id="edit-dialog-title"
					className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
				>
					Edit Asset
				</h3>

				<div className="space-y-4">
					<div>
						<label className={labelClass}>Name</label>
						<input
							type="text"
							className={inputClass}
							value={name}
							onChange={(e) => setName(e.target.value)}
							maxLength={200}
						/>
					</div>

					<div>
						<label className={labelClass}>Category</label>
						<select
							className={inputClass}
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
							{ASSET_CATEGORIES.map((c) => (
								<option key={c.value} value={c.value}>
									{c.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className={labelClass}>Description</label>
						<textarea
							className={inputClass}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							maxLength={1000}
						/>
					</div>

					<div>
						<label className={labelClass}>Image URL</label>
						<input
							type="url"
							className={inputClass}
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							placeholder="https://..."
							maxLength={500}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>Trading Fee %</label>
							<input
								type="number"
								className={inputClass}
								value={tradingFeePercent}
								onChange={(e) => setTradingFeePercent(e.target.value)}
								min={0}
								step="0.0001"
								placeholder="e.g. 0.005"
							/>
						</div>
						<div>
							<label className={labelClass}>Spread %</label>
							<input
								type="number"
								className={inputClass}
								value={spreadPercent}
								onChange={(e) => setSpreadPercent(e.target.value)}
								min={0}
								step="0.0001"
								placeholder="e.g. 0.01"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>Max Position (%)</label>
							<input
								type="number"
								className={inputClass}
								value={maxPositionPercent}
								onChange={(e) => setMaxPositionPercent(e.target.value)}
								min={0}
								max={100}
								step="0.01"
								placeholder="e.g. 10"
							/>
						</div>
						<div>
							<label className={labelClass}>Max Order Size</label>
							<input
								type="number"
								className={inputClass}
								value={maxOrderSize}
								onChange={(e) => setMaxOrderSize(e.target.value)}
								min={0}
								placeholder="e.g. 1000"
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className={labelClass}>Daily Limit (XAF)</label>
							<input
								type="number"
								className={inputClass}
								value={dailyTradeLimitXaf}
								onChange={(e) => setDailyTradeLimitXaf(e.target.value)}
								min={0}
								placeholder="e.g. 5000000"
							/>
						</div>
						<div>
							<label className={labelClass}>Lock-up Days</label>
							<input
								type="number"
								className={inputClass}
								value={lockupDays}
								onChange={(e) => setLockupDays(e.target.value)}
								min={0}
								placeholder="e.g. 30"
							/>
						</div>
					</div>

					{/* Income Distribution (non-bond only) */}
					{asset.category !== "BONDS" && (
						<>
							<hr className="border-gray-200 dark:border-gray-600" />
							<p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
								Income Distribution
							</p>
							<div>
								<label className={labelClass}>Income Type</label>
								<select
									className={inputClass}
									value={incomeType}
									onChange={(e) => setIncomeType(e.target.value)}
								>
									{INCOME_TYPES.map((t) => (
										<option key={t.value} value={t.value}>
											{t.label}
										</option>
									))}
								</select>
							</div>
							{showIncomeFields && (
								<>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className={labelClass}>Income Rate (%)</label>
											<input
												type="number"
												className={inputClass}
												value={incomeRate}
												onChange={(e) => setIncomeRate(e.target.value)}
												min={0}
												step="0.01"
												placeholder="e.g. 5.00"
											/>
										</div>
										<div>
											<label className={labelClass}>Frequency</label>
											<select
												className={inputClass}
												value={distributionFrequencyMonths}
												onChange={(e) =>
													setDistributionFrequencyMonths(e.target.value)
												}
											>
												<option value="">Select...</option>
												{FREQUENCY_OPTIONS.map((f) => (
													<option key={f.value} value={f.value}>
														{f.label}
													</option>
												))}
											</select>
										</div>
									</div>
									<div>
										<label className={labelClass}>Next Distribution Date</label>
										<input
											type="date"
											className={inputClass}
											value={nextDistributionDate}
											onChange={(e) => setNextDistributionDate(e.target.value)}
										/>
									</div>
								</>
							)}
						</>
					)}
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<Button
						ref={cancelRef}
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</div>
		</div>
	);
};
