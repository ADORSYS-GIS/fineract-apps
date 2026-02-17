import { Button } from "@fineract-apps/ui";
import { type FC, useEffect, useRef, useState } from "react";
import { ASSET_CATEGORIES } from "@/constants/categories";
import type {
	AssetDetailResponse,
	UpdateAssetRequest,
} from "@/services/assetApi";

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

	useEffect(() => {
		if (isOpen) {
			setName(asset.name);
			setDescription(asset.description ?? "");
			setImageUrl(asset.imageUrl ?? "");
			setCategory(asset.category);
			setTradingFeePercent(asset.tradingFeePercent?.toString() ?? "");
			setSpreadPercent(asset.spreadPercent?.toString() ?? "");
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
